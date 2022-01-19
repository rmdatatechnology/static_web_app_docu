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
    indexName: 'rmdata_docu_dev_test', 
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
	{
      resolve: `gatsby-plugin-elasticsearch`,
      options: {
        node: 'https://rmdataporal-elastic-dev-test.es.westeurope.azure.elastic-cloud.com:9243',
		apiKey: 'Uy1jMmNYNEJBU1BLM0xzdTc0Y3c6STdnYUotUU9ROW1zc1ZDcm5SN2RTUQ==', // optional
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
  ],
};
