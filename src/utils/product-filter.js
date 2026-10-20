// Build only one product's documentation (for a fast local preview):
//   set DOCS_PRODUCT=geomatik
// Only the folders that documentation/toc/<product>.json links to are sourced,
// plus the files directly in documentation/pages (start page, pdf page).
// Without DOCS_PRODUCT everything is built, as before.
const fs = require(`fs`);
const path = require(`path`);

const product = (process.env.DOCS_PRODUCT || ``).trim().toLowerCase();
const docsRoot = path.join(__dirname, `..`, `..`, `documentation`);
const pagesRoot = path.join(docsRoot, `pages`);

const normalize = p => p.replace(/\\/g, `/`).replace(/\/+$/, ``).toLowerCase();

const collectUrls = (items, urls = []) => {
  (items || []).forEach(item => {
    if (item.url) urls.push(item.url);
    collectUrls(item.items, urls);
  });
  return urls;
};

let allowedDirs = null;
if (product) {
  const tocFile = path.join(docsRoot, `toc`, `${product}.json`);
  if (!fs.existsSync(tocFile)) {
    const known = fs.readdirSync(path.join(docsRoot, `toc`)).map(f => path.basename(f, `.json`));
    throw new Error(`DOCS_PRODUCT=${product}: no ${tocFile}. Known products: ${known.join(`, `)}`);
  }
  allowedDirs = new Set(
    collectUrls(JSON.parse(fs.readFileSync(tocFile, `utf8`)))
      .filter(url => url.includes(`/`))
      .map(url => normalize(path.posix.dirname(url.replace(/^\/+/, ``))))
  );
}

const root = normalize(pagesRoot);

// `ignore` rule for gatsby-source-filesystem (chokidar): true = skip this path.
const ignorePage = (filePath, stats) => {
  if (!allowedDirs) return false;
  const p = normalize(filePath);
  if (p === root || !p.startsWith(`${root}/`)) return false;
  const rel = p.slice(root.length + 1);
  // files directly in pages/ (start page, pdf page)
  if (!rel.includes(`/`) && !(stats && stats.isDirectory())) return false;
  for (const dir of allowedDirs) {
    // inside an allowed folder, or a parent folder on the way to one
    if (rel === dir || rel.startsWith(`${dir}/`) || dir.startsWith(`${rel}/`)) return false;
  }
  return true;
};

module.exports = { product, ignorePage };
