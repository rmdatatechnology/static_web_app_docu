const fs = require('fs');
const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);


const config = require('./config/variables/variables.json')
const { ignorePage } = require('./src/utils/product-filter')

    const myQuery = `{
  allMdx {
              nodes {
                id
                frontmatter {
                  title
                }
				fields {
				  locale
				  slug
				}
                body
              }
            }
}`;

const queries = [{
        query: myQuery,
        transformer: ({
            data
        }) => data.allMdx.nodes.map((node) => ({
                id: node.id,
                heading: node.frontmatter.title,
                rawbody: node.body,
                locale: node.fields.locale,
                slug: node.fields.slug,
            })), // optional
        indexName: config.elasticindex,
    },
];

function getPrefix() {
    if (config.version && config.version !== "" && config.version !== "main")
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
        `gatsby-plugin-remove-serviceworker`, 
        `gatsby-transformer-json`, 
		`gatsby-transformer-yaml`,
		{
			resolve: `gatsby-plugin-sass`,
			options: {
			sassOptions: {
				api: "modern",
				silenceDeprecations: ['legacy-js-api'],
				},
			},
		},
        // It needs to be the first one to work with gatsby-remark-images
        {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/src/images`,
                name: `images`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/config/variables`,
                name: `variables`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/documentation/settings/translations`,
                name: `translations`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/config/menu`,
                name: `menu`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/documentation/settings/products`,
                name: `products`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/documentation/settings/placeholder`,
                name: `placeholder`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/config/language-mapping`,
                name: `language-mapping`,
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/documentation/pages`,
                name: `pages`,
                // ignore readme; with DOCS_PRODUCT set only that product's pages
                ignore: [`README.md`, ignorePage],
            },
        }, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/documentation/toc`,
                name: `toc`,
            },
		}, {
            resolve: `gatsby-source-filesystem-with-queue`,
            options: {
                path: `${__dirname}/documentation/static`,
                name: `dokumentation_images`,
            },	
        }, 	
        // mdx support: provides the Mdx nodes. The content is compiled in
        // gatsby-node.js (Mdx.compiledBody), see src/utils/compile-mdx.js.
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`.mdx`, `.md`],
            },
        }, {
            resolve: `gatsby-plugin-elasticsearch`,
            options: {
                node: config.elasticurl,
                apiKey: config.elasticapikey, // optional
                useindex: config.useindex,
                queries
            },
        }, 
    ],
};
