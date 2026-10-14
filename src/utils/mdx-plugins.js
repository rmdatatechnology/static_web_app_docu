// MDX plugins that keep the component mapping of MDX v1 under gatsby-plugin-mdx 5
// (MDX 2). Used by src/utils/compile-mdx.js.

// MDX v1 sent every element through the MDXProvider components, also HTML
// written as JSX in the content (e.g. `<img src="./img/a.png" />`). MDX 2 only
// maps elements created from markdown. Rename the JSX elements we have
// components for, so they still resolve through the components map
// (see src/components/MdxComponents/withV1Mapping.js).
const HTML_ALIASES = {
  img: `HtmlImg`,
  a: `HtmlA`,
  table: `HtmlTable`,
  h1: `HtmlH1`,
  h3: `HtmlH3`,
  h4: `HtmlH4`,
};

const walk = (node, parent, fn) => {
  fn(node, parent);
  if (node.children) node.children.forEach(child => walk(child, node, fn));
};

const remarkHtmlAliases = () => tree => {
  walk(tree, null, node => {
    if (
      (node.type === `mdxJsxFlowElement` || node.type === `mdxJsxTextElement`) &&
      HTML_ALIASES[node.name]
    ) {
      node.name = HTML_ALIASES[node.name];
    }
  });
};

// MDX v1 supported `ul.li` / `ol.li` component keys; MDX 2 does not. Mark list
// items from markdown with their parent list type so the `li` component can
// tell them apart.
const rehypeListParent = () => tree => {
  walk(tree, null, (node, parent) => {
    if (
      node.type === `element` &&
      node.tagName === `li` &&
      parent &&
      parent.type === `element` &&
      (parent.tagName === `ul` || parent.tagName === `ol`)
    ) {
      node.properties = { ...node.properties, dataParent: parent.tagName };
    }
  });
};

// Replaces gatsby-remark-copy-linked-files, which v1 ran on the content:
// relative image paths (markdown images and `<img src>`) that point to an
// existing file get that file's public URL. `publicUrl(relativeSrc)` returns the
// URL or null.
const isRelative = src =>
  typeof src === `string` && src && !/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src);

const remarkLocalImages = ({ publicUrl }) => tree => {
  walk(tree, null, node => {
    if (node.type === `image` && isRelative(node.url)) {
      node.url = publicUrl(node.url) || node.url;
    }
    if (
      (node.type === `mdxJsxFlowElement` || node.type === `mdxJsxTextElement`) &&
      (node.name === `img` || node.name === HTML_ALIASES.img)
    ) {
      node.attributes.forEach(attr => {
        if (attr.type === `mdxJsxAttribute` && attr.name === `src` && isRelative(attr.value)) {
          attr.value = publicUrl(attr.value) || attr.value;
        }
      });
    }
  });
};

module.exports = { HTML_ALIASES, remarkHtmlAliases, rehypeListParent, remarkLocalImages };
