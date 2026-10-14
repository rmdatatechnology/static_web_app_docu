// Render each page with MDX v1 (original source) and MDX v3 (migrated source)
// and compare the visible text. Components are stubbed to render their children.
// Usage: node compare.mjs <original pages dir> <migrated pages dir> [--ext=.mdx,.md]
import {createRequire} from 'node:module'
import {evaluate} from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'

const rootRequire = createRequire(path.resolve('../../package.json'))
const localRequire = createRequire(import.meta.url)
const mdx1 = localRequire('mdx-v1') // npm alias for @mdx-js/mdx@1
const babel = rootRequire('@babel/core')
const React = rootRequire('react')
const runtime = rootRequire('react/jsx-runtime')
const {renderToStaticMarkup} = rootRequire('react-dom/server')
const mdxReact1 = localRequire('mdx-react-v1') // npm alias for @mdx-js/react@1
const {mdx: mdxPragma, MDXProvider} = mdxReact1
const v1Require = id => id === '@mdx-js/react' ? mdxReact1 : rootRequire(id)

const stub = name => ({children}) => React.createElement('div', {'data-c': name}, children)
const components = new Proxy({}, {get: (_, k) => typeof k === 'string' && /^[A-Z]/.test(k) ? stub(k) : undefined, has: (_, k) => /^[A-Z]/.test(String(k))})
const names = ['Example', 'Danger', 'Warning', 'Success', 'Info', 'GeoDesigner', 'GeoMapper', 'GeoDesktop',
  'InventoryManager', 'SmartArea', 'SmartNetworx', 'SmartInfra', 'GeoWeb', 'Mobile', 'Kommassierung', 'Geomatik',
  'GeoMapperOnly', 'InfoWeb', 'Placeholder', 'U', 'Border', 'Bold', 'Menu', 'Italic', 'Image', 'MarkdownLink',
  'DownloadLink', 'Kommentar', 'Video', 'ReleaseNote', 'Icon', 'IMButton', 'IMIconButton', 'IMPredefinedElement']
const provided = Object.fromEntries(names.map(n => [n, stub(n)]))

const body = f => matter(fs.readFileSync(f, 'utf8').replace(/^﻿/, '')).content
const quiet = fn => { const w = console.warn, e = console.error; console.warn = console.error = () => {}; try { return fn() } finally { console.warn = w; console.error = e } }

function render1(src) {
  const jsx = mdx1.sync(src)
  const {code} = babel.transformSync(jsx, {
    babelrc: false, configFile: false,
    presets: [[rootRequire.resolve('@babel/preset-react'), {pragma: 'mdx', pragmaFrag: 'React.Fragment'}]],
    plugins: [rootRequire.resolve('@babel/plugin-transform-modules-commonjs')]
  })
  const module = {exports: {}}
  new Function('require', 'module', 'exports', 'React', 'mdx', code)(v1Require, module, module.exports, React, mdxPragma)
  return quiet(() => renderToStaticMarkup(React.createElement(MDXProvider, {components: provided}, React.createElement(module.exports.default))))
}
async function render3(src) {
  const {default: Content} = await evaluate(src, {...runtime, remarkPlugins: [remarkGfm], development: false})
  return quiet(() => renderToStaticMarkup(React.createElement(Content, {components: provided})))
}

const decode = s => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
const text = html => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()

const [origDir, newDir] = process.argv.slice(2)
const exts = (process.argv.find(a => a.startsWith('--ext=')) || '--ext=.mdx').slice(6).split(',')
const walk = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(x => {
  const p = path.join(d, x.name)
  return x.isDirectory() ? walk(p) : exts.includes(path.extname(p)) ? [p] : []
})
let same = 0, diff = 0, v1fail = 0, v3fail = 0
for (const f of walk(origDir)) {
  const rel = path.relative(origDir, f)
  let a, b
  try { a = text(render1(body(f))) } catch (e) { v1fail++; console.log(`V1-FAIL ${rel}: ${String(e.message).split('\n')[0]}`); continue }
  try { b = text(await render3(body(path.join(newDir, rel)))) } catch (e) { v3fail++; console.log(`V3-FAIL ${rel}: ${String(e.message).split('\n')[0]}`); continue }
  if (a === b) { same++; continue }
  diff++
  let i = 0
  while (a[i] === b[i]) i++
  console.log(`DIFF ${rel}\n  v1: …${a.slice(Math.max(0, i - 40), i + 60)}\n  v3: …${b.slice(Math.max(0, i - 40), i + 60)}`)
}
console.error(`same ${same}, different ${diff}, v1 render failed ${v1fail}, v3 render failed ${v3fail}`)
