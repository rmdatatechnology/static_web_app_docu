import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { useLocale } from '../hooks/locale';

function useProducts() {
  // Grab the locale (passed through context) from the Locale Provider 
  // through useLocale() hook
  const { locale } = useLocale();
  // Query the JSON files in <rootDir>/i18n/translations
  const { rawData } = useStaticQuery(query);

  // Simplify the response from GraphQL
  const simplified = rawData.edges.map(item => {
    return {
      name: item.node.name,
      productItems: item.node.productsTo.productItems,
    };
  });

  // Only return menu for the current locale
  const { productItems } = simplified.filter(
    lang => lang.name === "index",
  )[0];

  return productItems;
}

export default useProducts;

const query = graphql`
 query useProducts {
    rawData: allFile(filter: {sourceInstanceName: {eq: "products"}}) {
    edges {
      node {
		name
        productsTo: childProductsJson {
          productItems {
			link
            name
			product
          }
        }
      }
    }
  }
  }
`;
