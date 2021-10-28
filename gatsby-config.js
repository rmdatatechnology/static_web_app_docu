module.exports = {
   siteMetadata: {
    title: `Produktinformation`,
    description: `Test`,
	author: `Me`,
    siteUrl: `http://localhost:8000/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    `gatsby-remark-emoji`, // Emoji list: https://emojipedia.org/joypixels/
    `gatsby-transformer-json`,
	`gatsby-transformer-yaml`,
    // It needs to be the first one to work with gatsby-remark-images
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/config/translations`,
        name: `translations`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/config/menu`,
        name: `menu`,
      },
    },
	{
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/settings/products`,
        name: `products`,
      },
    },
	{
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/settings/placeholder`,
        name: `placeholder`,
      },
    },
	{
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/config/language-mapping`,
        name: `language-mapping`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/pages`,
        name: `pages`,
		ignore: [`README.md`], // ignore readme
      },
    },
	 {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/toc`,
        name: `toc`,
      },
    },
	// mdx support
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          // Adding title to code blocks. Usage: ```js:title=example.js
          {
            resolve: "gatsby-remark-code-titles",
            options: {
              className: "code-title-custom",
            },
          },
        ],
      },
    },

	// Using svg as component
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/,
		  include: /icons/,
        },
      },
    },
	'gatsby-plugin-image',
    'gatsby-plugin-sharp',
	 {
      resolve: `gatsby-transformer-sharp`,
      options: {
        // Removes warnings trying to use non-gatsby image in markdown
        checkSupportedExtensions: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `rmDATA Produkt-Dokumentation`,
        start_url: `/`,
        display: `minimal-ui`,
        icon: `src/images/logo_square.png`, // This path is relative to the root of the site.
      },
    },
	// You can have multiple instances of this plugin to create indexes with
    // different names or engines. For example, multi-lingual sites could create
    // an index for each language.
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        // A unique name for the search index. This should be descriptive of
        // what the index contains. This is required.
        name: 'pages',

        // Set the search engine to create the index. This is required.
        // The following engines are supported: flexsearch, lunr
        engine: 'flexsearch',

        // Provide options to the engine. This is optional and only recommended
        // for advanced users.
        //
        engineOptions: {
			tokenize: "forward",
			},

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
          {
            allMdx {
              nodes {
                id
                frontmatter {
                  title
                }
				fields {
				  locale
				}
				slug
                rawBody
              }
            }
          }
        `,

        // Field used as the reference value for each document.
        // Default: 'id'.
        ref: 'id',

        // List of keys to index. The values of the keys are taken from the
        // normalizer function below.
        // Default: all fields
        index: ['title', 'body'],

        // List of keys to store and make available in your UI. The values of
        // the keys are taken from the normalizer function below.
        // Default: all fields
        store: ['id', 'title', 'locale', 'slug', 'body'],

        // Function used to map the result from the GraphQL query. This should
        // return an array of items to index in the form of flat objects
        // containing properties to index. The objects must contain the `ref`
        // field above (default: 'id'). This is required.
        normalizer: ({ data }) =>
          data.allMdx.nodes.map((node) => ({
            id: node.id,
            title: node.frontmatter.title,
            body: node.rawBody,
			locale: node.fields.locale,
			slug: node.slug,
          })),
      },
    },
	
  ],
};
