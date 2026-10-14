// Compiles MDX content to a function body at build time (used by the
// `Mdx.compiledBody` resolver in gatsby-node.js). The templates run it with
// src/components/MdxBody.js.
//
// This is how gatsby-plugin-mdx v1 worked. gatsby-plugin-mdx 5 instead makes every
// MDX file its own webpack module, which runs out of memory with ~8000 pages.
const path = require(`path`);
const { remarkHtmlAliases, rehypeListParent, remarkLocalImages } = require(`./mdx-plugins`);

let modules;
const loadModules = () => {
  // Both packages are ESM-only.
  if (!modules) modules = Promise.all([import(`@mdx-js/mdx`), import(`remark-gfm`)]);
  return modules;
};

// filePath: the MDX file, to resolve relative image paths.
// fileUrl(absolutePath): public URL of a sourced file, or null.
const compileMdx = async (source, { filePath, fileUrl }) => {
  const [{ compile }, { default: remarkGfm }] = await loadModules();
  const dir = path.dirname(filePath);
  const publicUrl = src => {
    let decoded = src;
    try {
      decoded = decodeURI(src);
    } catch (e) {
      // keep it as written
    }
    return fileUrl(path.resolve(dir, decoded.split(/[?#]/)[0]));
  };

  const file = await compile(source, {
    outputFormat: `function-body`,
    providerImportSource: `@mdx-js/react`,
    development: false,
    // MDX v1 had GitHub flavoured markdown (tables, ...) built in.
    remarkPlugins: [remarkGfm, [remarkLocalImages, { publicUrl }], remarkHtmlAliases],
    rehypePlugins: [rehypeListParent],
  });
  return String(file);
};

module.exports = { compileMdx };
