// Compile every .mdx/.md file and print the ones that fail.
// Usage: node validate.mjs <dir> [--mdx2] [--ext=.mdx,.md]
//   --mdx2  use the @mdx-js/mdx 2 + remark-gfm 3 that gatsby-plugin-mdx ships
//           (resolved from the repository root) instead of MDX 3.
import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import {createRequire} from 'node:module'

const root = process.argv[2]
const exts = (process.argv.find(a => a.startsWith('--ext=')) || '--ext=.mdx').slice(6).split(',')
let compile, remarkGfm
if (process.argv.includes('--mdx2')) {
  const rootRequire = createRequire(path.resolve(import.meta.dirname, '../../package.json'))
  const load = async name => import(pathToFileURL(rootRequire.resolve(name)).href)
  ;({compile} = await load('@mdx-js/mdx'))
  ;({default: remarkGfm} = await load('remark-gfm'))
} else {
  ;({compile} = await import('@mdx-js/mdx'))
  ;({default: remarkGfm} = await import('remark-gfm'))
}

const walk = d => fs.readdirSync(d, {withFileTypes: true}).flatMap(x => {
  const p = path.join(d, x.name)
  return x.isDirectory() ? (x.name === '.git' || x.name === 'node_modules' ? [] : walk(p)) : exts.includes(path.extname(p)) ? [p] : []
})
const files = walk(root)
let bad = 0
for (const f of files) {
  // Strip frontmatter the way Gatsby does (gray-matter), keeping line numbers.
  const raw = fs.readFileSync(f, 'utf8').replace(/^﻿/, '')
  const {content} = matter(raw)
  const src = '\n'.repeat(raw.slice(0, raw.length - content.length).split('\n').length - 1) + content
  try {
    await compile(src, {remarkPlugins: [remarkGfm]})
  } catch (e) {
    bad++
    console.log(`${path.relative(root, f)}:${e.line ?? '?'}:${e.column ?? '?'} ${String(e.reason ?? e.message).split('\n')[0]}`)
  }
}
console.error(`${bad}/${files.length} failed`)
