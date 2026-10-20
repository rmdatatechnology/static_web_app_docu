// Deterministic MDX v1 -> MDX v3 migration for the documentation submodule.
//
// Pass 1: each file is parsed as CommonMark + GFM (how MDX v1 saw text and
// HTML). Only the source ranges of text and HTML nodes are rewritten, so fenced
// code, inline code, link targets and frontmatter stay byte-for-byte the same.
// Pass 2: MDX v1 glued block JSX together across blank lines and let Babel
// parse it; MDX v3 needs the tags inside each paragraph to balance. Line groups
// are restructured so that they do.
//
// The script is meant to run once on MDX v1 sources (it is not idempotent).
// Usage: node migrate.mjs <dir> [--dry] [--ext=.mdx,.md]
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfm} from 'micromark-extension-gfm'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {frontmatter} from 'micromark-extension-frontmatter'
import {frontmatterFromMarkdown} from 'mdast-util-frontmatter'
import {visit, SKIP} from 'unist-util-visit'
import matter from 'gray-matter'
import {createRequire} from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

// Components provided through MDXProvider in src/templates/page.js.
const COMPONENTS = new Set([
  'Example', 'Danger', 'Warning', 'Success', 'Info', 'GeoDesigner', 'GeoMapper',
  'GeoDesktop', 'InventoryManager', 'SmartArea', 'SmartNetworx', 'SmartInfra',
  'GeoWeb', 'Mobile', 'Kommassierung', 'Geomatik', 'GeoMapperOnly', 'InfoWeb',
  'Placeholder', 'U', 'Border', 'Bold', 'Menu', 'Italic', 'Image', 'MarkdownLink',
  'DownloadLink', 'Kommentar', 'Video', 'ReleaseNote', 'Icon', 'IMButton',
  'IMIconButton', 'IMPredefinedElement'
])
const HTML = new Set(('a abbr b blockquote br caption center code col colgroup dd del div dl dt em ' +
  'font h1 h2 h3 h4 h5 h6 hr i iframe img ins kbd li mark ol p pre s small span strike strong ' +
  'sub sup table tbody td tfoot th thead tr u ul').split(' '))
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr'])
// HTML attribute -> React prop (what MDX v1 did through hast-to-jsx).
const ATTR = {class: 'className', for: 'htmlFor', colspan: 'colSpan',
  rowspan: 'rowSpan', cellpadding: 'cellPadding', cellspacing: 'cellSpacing',
  tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen',
  valign: 'vAlign', bgcolor: 'bgColor', srcset: 'srcSet'}

// Tag grammar: CommonMark raw HTML, loosened the way Babel's JSX parser is
// (no space needed after a quoted value, `</ Name>` allowed).
const A = String.raw`[A-Za-z_:][A-Za-z0-9_.:-]*(?:\s*=\s*(?:[^\s"'=<>\x60]+|'[^']*'|"[^"]*"))?`
const OPEN_RE = new RegExp(String.raw`<([A-Za-z][A-Za-z0-9-]*)((?:\s+${A}|(?<=["'])\s*${A})*)\s*(\/?)>`, 'y')
const ATTR_RE = new RegExp(String.raw`\s*(${A.replace('(?:\\s*=', '(\\s*=')})`, 'gy')
const CLOSE_RE = /<\/\s*([A-Za-z][A-Za-z0-9-]*)\s*>/y
const COMMENT_RE = /<!--([\s\S]*?)-->/y
const PUNCT = /[!-/:-@[-`{-~]/
// Characters remark-parse 8 (MDX v1, gfm mode) treated as backslash escapes.
const LEGACY_ESCAPES = '\\`*{}[]()#+-.!_>~|'
const BLOCK_MARK_RE = /(\d{1,9})([.)])(?=[ \t])|([-+>]|#{1,6})(?=[ \t\r\n]|$)/y
const ENTITY_RE = /&(?:#\d+(?![\d;])|#[xX][0-9a-fA-F]+(?![0-9a-fA-F;])|(?:lt|gt|amp|quot|nbsp|copy|reg|deg|plusmn|auml|ouml|uuml|Auml|Ouml|Uuml|szlig)(?![A-Za-z0-9;]))/y

const stats = {files: 0, changed: 0, rules: {}}
const hit = (r, n = 1) => { stats.rules[r] = (stats.rules[r] || 0) + n }

const camel = p => p.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())
function styleObject(css) {
  const parts = css.split(';').map(d => d.trim()).filter(Boolean).map(d => {
    const i = d.indexOf(':')
    return i < 0 ? null : `${camel(d.slice(0, i))}: ${JSON.stringify(d.slice(i + 1).trim())}`
  })
  return parts.some(p => p === null) ? null : `{{${parts.join(', ')}}}`
}

function convertAttrs(name, raw) {
  const html = /^[a-z]/.test(name)
  let out = ''
  ATTR_RE.lastIndex = 0
  let m
  while (ATTR_RE.lastIndex < raw.length && (m = ATTR_RE.exec(raw))) {
    const eq = m[1].indexOf('=')
    let key = (eq < 0 ? m[1] : m[1].slice(0, eq)).trim()
    let val = eq < 0 ? undefined : m[1].slice(eq + 1).trim()
    if (html && ATTR[key.toLowerCase()]) { key = ATTR[key.toLowerCase()]; hit('attr html -> react name') }
    if (val !== undefined && !/^["']/.test(val)) { val = `"${val}"`; hit('attr quoted') }
    if (html && key === 'style' && val !== undefined) {
      const obj = styleObject(val.slice(1, -1))
      if (obj) { val = obj; hit('style string -> object') } else { key = 'data-style'; hit('style invalid -> data-style') }
    }
    out += ' ' + key + (val === undefined ? '' : '=' + val)
  }
  return out
}

// Try to read a tag at s[i]. `anyName` allows unknown lowercase elements
// (CommonMark already recognised the tag as HTML).
// Unknown components that are closed somewhere in the current file. v1 rendered
// those as a plain <div> (MDXDefaultShortcode); v3 would throw.
let closedUnknown = new Set()
const asDiv = n => closedUnknown.has(n) ? (hit('unknown component -> div'), 'div') : n

function readTag(s, i, anyName) {
  let m
  CLOSE_RE.lastIndex = OPEN_RE.lastIndex = i
  const known = n => COMPONENTS.has(n) || HTML.has(n) || closedUnknown.has(n) || (anyName && /^[a-z]/.test(n))
  if ((m = CLOSE_RE.exec(s)) && known(m[1])) {
    if (/\s/.test(m[0])) hit('tag whitespace normalised')
    return {end: CLOSE_RE.lastIndex, text: VOID.has(m[1].toLowerCase()) ? (hit('void close tag dropped'), '') : `</${asDiv(m[1])}>`}
  }
  if ((m = OPEN_RE.exec(s)) && known(m[1])) {
    let [, name, attrs, slash] = m
    name = asDiv(name)
    const isVoid = VOID.has(name.toLowerCase())
    if (isVoid && !slash) hit('void tag self-closed')
    return {end: OPEN_RE.lastIndex, text: `<${isVoid ? name.toLowerCase() : name}${convertAttrs(name, attrs)}${slash || isVoid ? ' />' : '>'}`}
  }
  return null
}

// Rewrite a source range. mode: 'text' (markdown text), 'html' (inline HTML
// node) or 'block' (HTML block: v1 handed it to Babel raw, so markdown syntax in
// its text was literal and must be escaped now).
function rewrite(s, mode) {
  let out = ''
  for (let i = 0; i < s.length;) {
    const c = s[i]
    if (c === '\\') {
      if (mode === 'block') {
        // Raw HTML: every backslash was literal.
        if (PUNCT.test(s[i + 1] || '')) { out += '\\\\'; hit('literal backslash kept') } else out += '\\'
        i++
        continue
      }
      let k = 0
      while (s[i + k] === '\\') k++
      out += s.slice(i, i + k)
      const next = s[i + k]
      // Legacy remark only escaped LEGACY_ESCAPES; v3 escapes all punctuation.
      if (k % 2 === 1 && next && PUNCT.test(next) && !LEGACY_ESCAPES.includes(next)) { out += '\\'; hit('literal backslash kept') }
      i += k
      continue
    }
    if (c === '&') {
      // Legacy remark decoded numeric references without the `;`.
      ENTITY_RE.lastIndex = i
      const m = ENTITY_RE.exec(s)
      if (m) { out += m[0] + ';'; hit('entity semicolon added'); i += m[0].length; continue }
    }
    if (mode === 'block' && /^[ \t]*$/.test(out.slice(out.lastIndexOf('\n') + 1)) && out.includes('\n')) {
      // Raw HTML text at line start: not a list item / heading / quote in v1.
      BLOCK_MARK_RE.lastIndex = i
      const m = BLOCK_MARK_RE.exec(s)
      if (m) { out += m[1] ? `${m[1]}\\${m[2]}` : `\\${m[3]}`; hit('escape block marker in raw html'); i += m[0].length; continue }
    }
    if (c === '<') {
      COMMENT_RE.lastIndex = i
      let m
      if (mode !== 'text' && (m = COMMENT_RE.exec(s))) {
        out += `{/*${m[1].replace(/\*\//g, '* /')}*/}`; hit('html comment -> mdx comment'); i = COMMENT_RE.lastIndex; continue
      }
      const tag = readTag(s, i, mode !== 'text')
      if (tag) { out += tag.text; i = tag.end; continue }
      out += '\\<'; hit('escape <'); i++; continue
    }
    if (c === '{' || c === '}') { out += '\\' + c; hit('escape ' + c); i++; continue }
    // remark-gfm also strikes through `~single~` tildes; v1 needed `~~`.
    if (c === '~' && mode !== 'block' && s[i - 1] !== '~' && s[i + 1] !== '~') { out += '\\~'; hit('escape single ~'); i++; continue }
    if (mode === 'block' && (c === '*' || c === '~' || c === '`' ||
        (c === '_' && !(/[\p{L}\p{N}]/u.test(s[i - 1] || '') && /[\p{L}\p{N}]/u.test(s[i + 1] || ''))))) {
      out += '\\' + c; hit('escape markdown in raw html'); i++; continue
    }
    out += c; i++
  }
  return out
}

// ---- pass 2 -----------------------------------------------------------------

const TAG_TOKEN = /<(\/?)([A-Za-z][A-Za-z0-9.-]*)(?:[^<>{}"']|"[^"]*"|'[^']*'|\{\{[^}]*\}\})*?(\/?)>/g
const BARRIER_MARK = /^(\d+)?([-*+.)#>])(?=\s|$)/
const LIST = /^(\s*(?:[-*+]|\d+[.)])\s+)/

const maskCode = line => line.replace(/(`+)[\s\S]*?\1/g, m => ' '.repeat(m.length))
function tokens(line) {
  const out = []
  line = maskCode(line)
  for (const m of line.matchAll(TAG_TOKEN)) {
    let k = 0
    while (line[m.index - 1 - k] === '\\') k++
    if (k % 2 === 1 || m[3]) continue
    out.push({start: m.index, end: m.index + m[0].length, close: !!m[1], name: m[2]})
  }
  return out
}
const indentOf = line => line.match(/^[ \t]*/)[0].replace(/\t/g, '    ').length
const hasText = line => line.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(TAG_TOKEN, '').trim() !== ''

// Pair open/close tags across a group of lines, HTML style: a close tag also
// closes unclosed elements above its match.
function pairUp(lines) {
  const toks = lines.flatMap((l, li) => tokens(l).map(t => ({...t, line: li})))
  const stack = [], pairs = [], unmatched = new Set(), implied = new Set()
  for (const t of toks) {
    if (!t.close) { stack.push(t); continue }
    const at = stack.findLastIndex(o => o.name === t.name)
    if (at < 0) { unmatched.add(t); continue }
    for (const o of stack.splice(at + 1)) (OPTIONAL_END.has(o.name) ? implied : unmatched).add({...o, before: t})
    pairs.push([stack.pop(), t])
  }
  for (const o of stack) unmatched.add(o)
  return {pairs, unmatched, implied}
}

// Elements whose end tag HTML lets you omit; browsers (and v1 pages) closed
// them implicitly when the parent closed.
const OPTIONAL_END = new Set(['td', 'th', 'tr', 'li', 'p', 'thead', 'tbody', 'tfoot', 'dt', 'dd', 'colgroup'])
function insertImpliedCloses(lines) {
  const {implied} = pairUp(lines)
  if (!implied.size) return lines
  lines = [...lines]
  // Insert right before the closing tag that closed the parent, last first.
  for (const o of [...implied].sort((a, b) => b.before.line - a.before.line || b.before.start - a.before.start)) {
    const l = lines[o.before.line]
    lines[o.before.line] = l.slice(0, o.before.start) + `</${o.name}>` + l.slice(o.before.start)
    hit('implied end tag inserted')
  }
  return lines
}

export function restructureGroup(lines) {
  lines = insertImpliedCloses(lines)
  // 1. Tags without a partner in this group go on their own line (flow JSX).
  const {unmatched} = pairUp(lines)
  if (unmatched.size) {
    const out = []
    lines.forEach((line, li) => {
      const cut = [...unmatched].filter(t => t.line === li).sort((a, b) => a.start - b.start)
      if (!cut.length || /^\s*\|/.test(line) || /^\s*#/.test(line)) { out.push(line); return }
      const list = line.match(LIST)
      const head = list ? list[1] : line.match(/^\s*/)[0]
      const indent = list ? ' '.repeat(head.length) : head
      const pieces = []
      let pos = head.length
      for (const t of cut) { pieces.push(line.slice(pos, t.start), line.slice(t.start, t.end)); pos = t.end }
      pieces.push(line.slice(pos))
      // A piece that was mid-line was plain text; at line start it must not
      // turn into a list item, heading or quote.
      const parts = pieces.map((p, n) => n === 0 ? p.trim() : p.trim().replace(BARRIER_MARK, '$1\\$2')).filter(Boolean)
      parts.forEach((p, n) => out.push((n === 0 ? head : indent) + p))
      hit('unbalanced tag moved to own line', cut.length)
    })
    lines = out
  }
  // 2. A paired element touching a line with text must sit in one paragraph:
  //    join the lines from its open tag to its close tag.
  const {pairs} = pairUp(lines)
  //    Joined lines hold text, which can pull in more pairs: repeat until stable.
  const text = lines.map(hasText)
  let merged = [], size = -1
  while (size !== merged.length) {
    size = merged.length
    // An indented (list item) element whose content is less indented would be
    // cut off by v3's lazy-line rules, so it needs joining as well.
    const outdented = (a, b) => lines.slice(a + 1, b + 1).some(l => indentOf(l) < indentOf(lines[a]))
    const spans = pairs.filter(([o, c]) => o.line !== c.line && (text[o.line] || text[c.line] || outdented(o.line, c.line))).map(([o, c]) => [o.line, c.line])
    spans.sort((a, b) => a[0] - b[0])
    merged = []
    for (const sp of spans) {
      const last = merged.at(-1)
      if (last && sp[0] <= last[1]) last[1] = Math.max(last[1], sp[1]); else merged.push([...sp])
    }
    let changed = false
    for (const [a, b] of merged) for (let j = a; j <= b; j++) if (!text[j]) { text[j] = true; changed = true }
    if (changed) size = -1
  }
  if (!merged.length) return lines
  const out = []
  let li = 0
  for (const [a, b] of merged) {
    while (li < a) out.push(lines[li++])
    // Joining list items (or GFM table rows) would merge real markdown blocks.
    if (lines.slice(a + 1, b + 1).some(l => /^\s*\|/.test(l) || (LIST.test(lines[a]) && LIST.test(l)))) { while (li <= b) out.push(lines[li++]); hit('join skipped (markdown block inside)'); continue }
    let joined = lines[a].replace(/\s+$/, '')
    for (let j = a + 1; j <= b; j++) {
      const next = lines[j].trim()
      if (!next) continue
      joined += (/>$/.test(joined) && next.startsWith('<') ? '' : ' ') + next
    }
    out.push(joined)
    hit('lines joined', b - a + 1)
    li = b + 1
  }
  while (li < lines.length) out.push(lines[li++])
  return out
}

function restructure(src) {
  const nl = src.includes('\r\n') ? '\r\n' : '\n'
  const lines = src.split(/\r?\n/)
  const out = []
  let i = 0
  if (/^---\s*$/.test(lines[0])) { do out.push(lines[i++]); while (i < lines.length && !/^---\s*$/.test(lines[i])); out.push(lines[i++]) }
  let group = []
  const flush = () => { if (group.length) out.push(...restructureGroup(group)); group = [] }
  while (i < lines.length) {
    const line = lines[i]
    const fence = line.match(/^(\s*(?:[-*+]\s+|\d+[.)]\s+)?)(`{3,}(?=[^`]*$)|~{3,})/)
    if (fence) {
      flush()
      out.push(line); i++
      const close = new RegExp(String.raw`^\s*${fence[2][0] === '`' ? '`' : '~'}{${fence[2].length},}\s*$`)
      while (i < lines.length && !close.test(lines[i])) out.push(lines[i++])
      if (i < lines.length) out.push(lines[i++])
      continue
    }
    if (line.trim() === '') { flush(); out.push(line); i++; continue }
    group.push(line); i++
  }
  flush()
  return out.join(nl)
}

// ---- pass 0 -----------------------------------------------------------------

// MDX v1 (remark-parse 8) accepted `**text **` and `* text*`; CommonMark does
// not. Use v1's own parser to find those and move the whitespace outside.
// `mdx-v1` is an npm alias for @mdx-js/mdx@1 (see package.json).
const v1 = createRequire(import.meta.url)('mdx-v1').createMdxAstCompiler({remarkPlugins: []})
// CommonMark delimiter-run flanking rules (spec 6.2).
const isWS = c => c === undefined || /\s/u.test(c)
const isP = c => c !== undefined && /[\p{P}\p{S}]/u.test(c)
const leftFlanking = (prev, next) => !isWS(next) && (!isP(next) || isWS(prev) || isP(prev))
const rightFlanking = (prev, next) => !isWS(prev) && (!isP(prev) || isWS(next) || isP(next))
const canOpen = (ch, prev, next) => leftFlanking(prev, next) && (ch === '*' || !rightFlanking(prev, next) || isP(prev))
const canClose = (ch, prev, next) => rightFlanking(prev, next) && (ch === '*' || !leftFlanking(prev, next) || isP(next))

function fixEmphasis(src) {
  const offset = src.length - matter(src).content.length
  const edits = []
  visit(v1.parse(src.slice(offset)), ['strong', 'emphasis'], node => {
    const s = node.position.start.offset + offset, e = node.position.end.offset + offset
    const d = node.type === 'strong' ? 2 : 1
    const inner = src.slice(s + d, e - d)
    const lead = inner.match(/^\s*/)[0], trail = inner.match(/\s*$/)[0]
    if (!inner.trim() || /[\r\n]/.test(lead + trail)) return
    const body = inner.trim()
    // Runs like `**a****b**` are ambiguous; leave them to CommonMark.
    if (node.type === 'strong' && body.includes(src.slice(s, s + 2))) return
    if (canOpen(src[s], lead ? lead.at(-1) : src[s - 1], body[0]) && canClose(src[s], body.at(-1), trail ? trail[0] : src[e])) {
      if (!lead && !trail) return
      if (lead) edits.push({s, e: s + d + lead.length, text: lead + src.slice(s, s + d)})
      if (trail) edits.push({s: e - d - trail.length, e, text: src.slice(e - d, e) + trail})
      hit('emphasis whitespace moved outside')
    } else {
      // CommonMark cannot express it (e.g. `**Name:**Text`): use HTML tags.
      const tag = node.type === 'strong' ? 'strong' : 'em'
      edits.push({s, e: s + d + lead.length, text: `${lead}<${tag}>`})
      edits.push({s: e - d - trail.length, e, text: `</${tag}>${trail}`})
      hit('emphasis -> html tag')
    }
  })
  edits.sort((a, b) => b.s - a.s)
  for (const {s, e, text} of edits) src = src.slice(0, s) + text + src.slice(e)
  return src
}

// Source ranges v1 parsed as indented code (CommonMark sometimes disagrees,
// e.g. tab-indented lists).
function v1CodeRanges(src) {
  const offset = src.length - matter(src).content.length
  const ranges = []
  visit(v1.parse(src.slice(offset)), 'code', node => { ranges.push([node.position.start.offset + offset, node.position.end.offset + offset]) })
  return ranges
}

// ---- pass 1 -----------------------------------------------------------------

export function migrate(src) {
  // micromark drops a BOM, which would shift every offset by one.
  if (src.startsWith('﻿')) return '﻿' + migrate(src.slice(1))
  // gray-matter accepts content after the closing `---`; give it its own line.
  src = src.replace(/^(---[ \t]*\r?\n[\s\S]*?\r?\n---)[ \t]+(\S[^\r\n]*)(\r?\n)/, (_, fm, rest, nl) => { hit('frontmatter close split'); return fm + nl + rest + nl })
  src = fixEmphasis(src)
  const v1Code = v1CodeRanges(src)
  closedUnknown = new Set([...src.matchAll(/<\/\s*([A-Z][A-Za-z0-9]*)\s*>/g)].map(m => m[1]).filter(n => !COMPONENTS.has(n)))
  const tree = fromMarkdown(src, {
    extensions: [gfm(), frontmatter()],
    mdastExtensions: [gfmFromMarkdown(), frontmatterFromMarkdown()]
  })
  const nl = src.includes('\r\n') ? '\r\n' : '\n'
  const edits = []
  visit(tree, (node, _, parent) => {
    const p = node.position
    if (!p) return
    const s = p.start.offset, e = p.end.offset
    switch (node.type) {
      case 'yaml': case 'inlineCode': case 'definition':
        return SKIP
      case 'code': {
        const raw = src.slice(s, e)
        if (/^(`{3,}|~{3,})/.test(raw)) return SKIP
        if (!v1Code.some(([a, b]) => s < b && e > a)) {
          // v1 did not see code here: keep it as (inline-HTML-aware) text.
          edits.push({s, e, text: rewrite(raw, 'html')})
          hit('indented code kept as text (v1 did not see code)')
          return SKIP
        }
        // Indented code is disabled in MDX v3: turn it into a fenced block.
        const lineStart = src.lastIndexOf('\n', s - 1) + 1
        const prefix = src.slice(lineStart, s)
        if (!/^[ \t]*$/.test(prefix)) { hit('indented code in container (left as is)'); if (process.env.DEBUG) console.error('CONTAINER', JSON.stringify(src.slice(lineStart, e).slice(0, 160))); return SKIP }
        const fence = node.value.includes('```') ? '~~~' : '```'
        const body = node.value.split('\n').map(l => l.replace(/\r$/, '')).map(l => l ? prefix + l : l).join(nl)
        edits.push({s, e, text: fence + nl + body + nl + prefix + fence})
        hit('indented code -> fenced')
        return SKIP
      }
      case 'html': {
        const inline = ['paragraph', 'heading', 'tableCell', 'emphasis', 'strong', 'delete', 'link'].includes(parent.type)
        edits.push({s, e, text: rewrite(src.slice(s, e), inline ? 'html' : 'block')})
        return SKIP
      }
      case 'text':
        edits.push({s, e, text: rewrite(src.slice(s, e), 'text')})
        return SKIP
      case 'image': case 'imageReference':
        return SKIP
      case 'delete':
        // remark-gfm strikes `~single~`; v1 only knew `~~double~~`.
        if (src[s + 1] !== '~') {
          edits.push({s, e: s + 1, text: '\\~'}, {s: e - 1, e, text: '\\~'})
          hit('escape single ~')
        }
        return
    }
  })
  edits.sort((a, b) => b.s - a.s)
  let out = src
  for (const {s, e, text} of edits) out = out.slice(0, s) + text + out.slice(e)
  return restructure(out)
}

if (process.argv[1]?.endsWith('migrate.mjs')) {
const root = process.argv[2]
const dry = process.argv.includes('--dry')
const exts = (process.argv.find(a => a.startsWith('--ext=')) || '--ext=.mdx').slice(6).split(',')
const walk = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(x => {
  const p = path.join(d, x.name)
  return x.isDirectory() ? (x.name === '.git' || x.name === 'node_modules' ? [] : walk(p)) : exts.includes(path.extname(p)) ? [p] : []
})
for (const f of walk(root)) {
  stats.files++
  const src = fs.readFileSync(f, 'utf8')
  const out = migrate(src)
  if (out !== src) { stats.changed++; if (!dry) fs.writeFileSync(f, out) }
}
console.log(JSON.stringify(stats, null, 2))
}
