const config = require('./config/variables/variables.json')
  
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
    indexName: config.elasticindex, 
	indexConfig: {
     
    },
  },
];

function getPrefix()
{
  if(config.version && config.version !== ""&& config.version !== "main")
	  return "/documentation/" + version;
  
  return "/documentation";
}


module.exports = {
   pathPrefix: getPrefix(),
   siteMetadata: {
    title: `Produktinformation`,
    description: `rmData Produktdokumentation`,
	author: `Doris Koenigshofer`,
	image: "/logo.png", // Path to the image placed in the 'static' folder, in the project's root directory.
	version: config.version,
	product: config.productused, 
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
        path: `${__dirname}/config/variables`,
        name: `variables`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/documentation/settings/translations`,
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
        node: config.elasticurl,
		apiKey: config.elasticapikey, // optional
		useindex: config.useindex,
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
  ],
};
