// Makes sure the local setup is ready before start.bat / preview.bat run Gatsby:
//  1. documentation submodule checked out
//  2. node_modules matches package-lock.json (else: npm ci)
//  3. Gatsby cache (.cache, public) was made with the current setup and the
//     same DOCS_PRODUCT (else: gatsby clean)
// Each step stores a fingerprint, so nothing is redone when nothing changed.
// Uses only Node built-ins, so it also works before `npm ci` ran.
const fs = require(`fs`);
const path = require(`path`);
const crypto = require(`crypto`);
const { execSync } = require(`child_process`);

const root = path.join(__dirname, `..`);
const product = (process.env.DOCS_PRODUCT || ``).trim().toLowerCase();

const run = cmd => execSync(cmd, { cwd: root, stdio: `inherit` });
const read = file => {
  const full = path.join(root, file);
  return fs.existsSync(full) ? fs.readFileSync(full) : ``;
};
const fingerprint = (...parts) => {
  const hash = crypto.createHash(`sha1`);
  parts.forEach(part => hash.update(part).update(`\0`));
  return hash.digest(`hex`);
};
const stamp = file => {
  const full = path.join(root, file);
  return {
    get: () => (fs.existsSync(full) ? fs.readFileSync(full, `utf8`).trim() : null),
    set: value => fs.writeFileSync(full, value),
  };
};

// 0. Node version
const nodeMajor = Number(process.versions.node.split(`.`)[0]);
if (nodeMajor < 20) {
  console.error(`Node.js ${process.versions.node} is too old. Install Node.js 24 LTS from https://nodejs.org`);
  process.exit(1);
}

// 1. documentation submodule
if (!fs.existsSync(path.join(root, `documentation`, `pages`))) {
  console.log(`> Fetching the documentation (git submodule) ...`);
  run(`git submodule update --init`);
}

// 2. installed packages
const installStamp = stamp(`node_modules/.docs-install-stamp`);
const installWanted = fingerprint(read(`package-lock.json`), String(nodeMajor));
let reinstalled = false;
if (installStamp.get() !== installWanted) {
  console.log(`> Installing packages (package-lock.json changed or first run, takes about 2 minutes) ...`);
  run(`npm ci --legacy-peer-deps`);
  installStamp.set(installWanted);
  reinstalled = true;
}

// 3. Gatsby cache
const buildStamp = stamp(`.docs-build-stamp`);
const buildWanted = fingerprint(
  installWanted,
  ...[
    `gatsby-config.js`,
    `gatsby-node.js`,
    `src/utils/compile-mdx.js`,
    `src/utils/mdx-plugins.js`,
    `src/utils/product-filter.js`,
  ].map(read),
  product
);
const hasCache = fs.existsSync(path.join(root, `.cache`)) || fs.existsSync(path.join(root, `public`));
if (hasCache && (reinstalled || buildStamp.get() !== buildWanted)) {
  console.log(`> Clearing the Gatsby cache (setup or product changed) ...`);
  run(`npx gatsby clean`);
}
buildStamp.set(buildWanted);

console.log(product ? `> Ready (product: ${product})` : `> Ready (all products)`);
