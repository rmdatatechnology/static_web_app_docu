const path = require(`path`);
const locales = require(`./config/i18n`);
const {
  localizedSlug,
  findKey,
  removeTrailingSlash,
} = require(`./src/utils/gatsby-node-helpers`);
const slugify = require(`slugify`);
const { compileMdx } = require(`./src/utils/compile-mdx`);
const { product: onlyProduct } = require(`./src/utils/product-filter`);

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // First delete the incoming page that was automatically created by Gatsby
  // So everything in src/pages/
  deletePage(page);

  // Grab the keys ('en' & 'pt') of locales and map over them
  Object.keys(locales).map(lang => {
    // Use the values defined in "locales" to construct the path
    const localizedPath = locales[lang].default
      ? page.path
      : `${locales[lang].path}${page.path}`;

    return createPage({
      // Pass on everything from the original page
      ...page,
      // Since page.path returns with a trailing slash (e.g. "/pt/")
      // We want to remove that (e.g. "pt/")
      path: removeTrailingSlash(localizedPath),
      // Pass in the locale as context to every page
      // This context also gets passed to the src/components/layout file
      // This should ensure that the locale is available on every page
      context: {
        ...page.context,
        locale: lang,
        dateFormat: locales[lang].dateFormat,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }

    type MdxFrontmatter {
	  image: String
	  description: String
	  display: String
	  
    }

  `);
};

// The templates query `publicURL` of the images, which copies each file to
// public/static on first use. Queries run in several worker processes, and two
// of them copying the same file at once fail on Windows (EBUSY). Copy all
// images once up front, in this single process, so the resolver finds them.
const IMAGE_EXTENSIONS = [`png`, `jpg`, `jpeg`, `gif`];
const isImage = file => IMAGE_EXTENSIONS.includes((file.extension || ``).toLowerCase());
// Same location as publicURL in gatsby-source-filesystem(-with-queue)
const staticPath = file => `static/${file.internal.contentDigest}/${file.base}`;

exports.onPostBootstrap = async ({ getNodesByType }) => {
  const fs = require(`fs-extra`);
  for (const file of getNodesByType(`File`).filter(isImage)) {
    const target = path.join(process.cwd(), `public`, staticPath(file));
    if (!fs.existsSync(target)) {
      await fs.copy(file.absolutePath, target, { dereference: true });
    }
  }
};

// The MDX content compiled to a function body, rendered by src/components/MdxBody.js
exports.createResolvers = ({ createResolvers, pathPrefix = `` }) => {
  // Images by absolute path (forward slashes), to resolve relative image links
  // like gatsby-remark-copy-linked-files did. Built once per worker.
  let imagesByPath;
  const loadImages = async nodeModel => {
    if (!imagesByPath) {
      const { entries } = await nodeModel.findAll({ type: `File` });
      imagesByPath = new Map();
      for (const file of entries) {
        if (isImage(file)) imagesByPath.set(file.absolutePath.replace(/\\/g, `/`), file);
      }
    }
    return imagesByPath;
  };

  createResolvers({
    // A one-product build (DOCS_PRODUCT) shows that product, see product-filter.js
    ...(onlyProduct && {
      VariablesJson: {
        productused: { resolve: () => onlyProduct },
      },
    }),
    Mdx: {
      compiledBody: {
        type: `String`,
        resolve: async (node, args, context) => {
          const images = await loadImages(context.nodeModel);
          return compileMdx(node.body, {
            filePath: node.internal.contentFilePath,
            fileUrl: absolutePath => {
              const file = images.get(absolutePath.replace(/\\/g, `/`));
              return file ? `${pathPrefix}/${staticPath(file)}` : null;
            },
          });
        },
      },
    },
  });
};

// Correcting language and slug to the frontmatter of each file
// A new node is created automatically with the filename
// It's necessary to do that to filter by language
// And the slug make sure the urls will be the same for all posts
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Check for "MarkdownRemark" type so that other files (e.g. images) are exluded
  if (node.internal.type === `Mdx`) {
    // Use path.basename
    // https://nodejs.org/api/path.html#path_path_basename_path_ext
    // It will return the file name without '.md' string (e.g. "file-name" or "file-name.lang")
    const name = path.basename(node.internal.contentFilePath, `.mdx`);

    // Find the key that has "default: true" set (in this case it returns "en")
    const defaultKey = findKey(locales, o => o.default === true);

    // Check if file.name.lang has the default lang type.
    // (in this case the default language is for files set with "en")
    const isDefault = name.split(`.`)[1] === defaultKey;

    // Files are defined with "name-with-dashes.lang.md"
    // So grab the lang from that string
    // If it's the default language, pass the locale for that
    const lang = isDefault ? defaultKey : name.split(`.`)[1];
	
	//const mainPath = path.resolve(`.`);
	//const relPath = (path.relative(mainPath, node.fileAbsolutePath));
	
    // Get the entire file name and remove the lang of it
    //const slugFileName = relPath.split(`.`)[0];

    // Adding the nodes on GraphQL for each post as "fields"
    createNodeField({ node, name: `locale`, value: lang });
    createNodeField({ node, name: `isDefault`, value: isDefault });
    createNodeField({ node, name: `slug`, value: mdxSlug(getNode(node.parent)) });
  }
};

// The `slug` that gatsby-plugin-mdx v1 provided: the path relative to the
// source folder, without extension (and without a trailing "index").
const mdxSlug = file => {
  if (!file || !file.relativePath) return null;
  const parsedPath = path.parse(file.relativePath);
  const relevantPath =
    parsedPath.name === `index`
      ? file.relativePath.replace(parsedPath.base, ``)
      : file.relativePath.replace(parsedPath.ext, ``);
  return slugify(relevantPath, {
    remove: /[^\w\s$*_+~.()'"!\-:@/]/g, // this is the set of allowable characters
  });
};

// Creating Posts and Pages for each node in AllMarkdownRemark
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Templates for Posts List and Single post
  //const postTemplate = path.resolve(`./src/templates/post.js`);
  //const postsListTemplate = path.resolve(
  //  `./src/templates/posts-list.js`,
  //);
  const pageTemplate = path.resolve(`./src/templates/page.js`);
  const defaultTemplate = path.resolve(`./src/templates/default.js`);
  const indexTemplate = path.resolve(`./src/templates/index-page.js`);
  const pdfTemplate = path.resolve(`./src/templates/pdf-page.js`);

  const result = await graphql(`
    {
      files: allMdx{
        edges {
          node {
            fields {
              locale
              isDefault
              slug
            }
            frontmatter {
              title
              page
              display
            }
			id
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error(result.errors);
    return;
  }

  // Pages created by markdown (from blog and pages directory)
  const contentMarkdown = result.data.files.edges;

  // Creating each page
  contentMarkdown.forEach(({ node: file }) => {
    // Getting Slug and Title
    const slug = file.fields.slug.split(`.`)[0];
    const title = file.frontmatter.title;
	const id = file.id;
	
	let relativeImageRegex = "/img/";
	let pathToSplit = file.fields.slug.split('/');
	if(pathToSplit.length > 1)
	{
		pathToSplit.pop();
		relativeImageRegex = pathToSplit.join('/');
		relativeImageRegex= "/"+relativeImageRegex+"/";
	}

    // Use the fields created in exports.onCreateNode
    let locale = file.fields.locale;
    const isDefault = file.fields.isDefault;
	
	if(!locale)
		locale = "de";

    // Check if it's page (to differentiate post and page)
    const isPage = file.frontmatter.page;

    // Setting a template for page or post depending on the content
    const template = isPage ? pageTemplate : defaultTemplate;

    createPage({
      path: localizedSlug({ isDefault, locale, slug }),
      component: template,
      context: {
        // Pass both the "title" and "locale" to find a unique file
        // Only the title would not have been sufficient as articles could have the same title
        // in different languages, e.g. because an english phrase is also common in german
        locale,
        title,
		id,
		relativeImageRegex,
      },
    });
  });

  // Start page and download page per language. They render the file with
  // frontmatter `display: index` / `display: pdf` (formerly src/pages/index.js
  // and src/pages/pdf.js; created here so the file id can be passed in).
  [
    { display: `index`, pagePath: `/`, template: indexTemplate },
    { display: `pdf`, pagePath: `/pdf/`, template: pdfTemplate },
  ].forEach(({ display, pagePath, template }) => {
    Object.keys(locales).forEach(lang => {
      const file = contentMarkdown
        .map(({ node }) => node)
        .filter(node => node.frontmatter.display === display && (node.fields.locale || `de`) === lang)
        .sort((a, b) => a.fields.slug.localeCompare(b.fields.slug))[0];
      if (!file) return;

      const localizedPath = locales[lang].default
        ? pagePath
        : `/${locales[lang].path}${pagePath}`;

      createPage({
        path: removeTrailingSlash(localizedPath),
        component: template,
        context: {
          locale: lang,
          dateFormat: locales[lang].dateFormat,
          id: file.id,
        },
      });
    });
  });
};
