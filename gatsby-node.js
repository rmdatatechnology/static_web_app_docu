const path = require(`path`);
const locales = require(`./config/i18n`);
const {
  localizedSlug,
  findKey,
  removeTrailingSlash,
} = require(`./src/utils/gatsby-node-helpers`);
const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
   resolve: {
      fallback: {
        assert: require.resolve('assert'),
		buffer: require.resolve('buffer/'),
		console: require.resolve('console-browserify'),
		constants: require.resolve('constants-browserify'),
		crypto: require.resolve('crypto-browserify'),
		domain: require.resolve('domain-browser'),
		events: require.resolve('events'),
		http: require.resolve('stream-http'),
		https: require.resolve('https-browserify'),
		os: require.resolve('os-browserify/browser'),
		path: require.resolve('path-browserify'),
		punycode: require.resolve('punycode'),
		process: require.resolve('process/browser'),
		querystring: require.resolve('querystring-es3'),
		stream: require.resolve('stream-browserify'),
		string_decoder: require.resolve('string_decoder'),
		sys: require.resolve('util'),
		timers: require.resolve('timers-browserify'),
		tty: require.resolve('tty-browserify'),
		url: require.resolve('url'),
		util: require.resolve('util'),
		vm: require.resolve('vm-browserify'),
		zlib: require.resolve('browserify-zlib'),
		fs: false,
		},
    },
	plugins: [
      new webpack.ProvidePlugin({
           process: 'process/browser',  
      }),
	  new webpack.ProvidePlugin({
           Buffer: ['buffer', 'Buffer'],
      }),
  ],
  })
}

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

// Correcting language and slug to the frontmatter of each file
// A new node is created automatically with the filename
// It's necessary to do that to filter by language
// And the slug make sure the urls will be the same for all posts
exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  // Check for "MarkdownRemark" type so that other files (e.g. images) are exluded
  if (node.internal.type === `Mdx`) {
    // Use path.basename
    // https://nodejs.org/api/path.html#path_path_basename_path_ext
    // It will return the file name without '.md' string (e.g. "file-name" or "file-name.lang")
    const name = path.basename(node.fileAbsolutePath, `.mdx`);

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
  }
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

  const result = await graphql(`
    {
      files: allMdx{
        edges {
          node {
            fields {
              locale
              isDefault
            }
            frontmatter {
              title
              page
            }
			slug
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
    const slug = file.slug.split(`.`)[0];
    const title = file.frontmatter.title;
	const id = file.id;

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
      },
    });
  });
};
