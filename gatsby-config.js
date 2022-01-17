const myQuery = `{
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
}`;
 
const queries = [
  {
    query: myQuery,
    transformer: ({ data }) => data.allMdx.nodes.map((node) => ({
            id: node.id,
            title: node.frontmatter.title,
            rawbody: node.rawBody,
			locale: node.fields.locale,
			slug: node.slug,
          })), // optional
    indexName: 'pagestest', 
	indexConfig: {
     
    },
  },
];

module.exports = {
   pathPrefix: `/documentation`,
   siteMetadata: {
    title: `Produktinformation`,
    description: `rmData Produktdokumentation`,
	author: `Doris Koenigshofer`,
    siteUrl: `https://portal.rmdatacloud-test.com/documentation/`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
	`gatsby-plugin-remove-serviceworker`,	
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
		ignore: [`README.md, **/img/**`], // ignore readme
      },
    },
	 {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/toc`,
        name: `toc`,
      },
    },
	 {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/static`,
        name: `static`,
      },
    },
	// mdx support
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
		plugins: [`gatsby-remark-copy-linked-files`],
        gatsbyRemarkPlugins: [
         {
          resolve: "gatsby-remark-copy-linked-files",
          options: {
            destinationDir: "static/mdximg",
			ignoreFileExtensions: [],
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
			fastupdate: true,
			minlength: 3,
			cache: 100,
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
        store: ['id', 'title', 'locale', 'slug'],

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
	{
      resolve: `gatsby-plugin-elasticsearch`,
      options: {
        node: 'https://produktdokumentation.es.centralus.azure.elastic-cloud.com:9243',
		auth: {
			username: 'elastic',
			password: 'adFUF0DlTV8wJxWJOdlWOWqc'
		},
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
  ],
};
