import { useStaticQuery, graphql } from 'gatsby';
import { useProduct } from '../hooks/products';

function usePlaceholder() {
  
  const { product } = useProduct();
  const { rawData } = useStaticQuery(query);

  // Simplify the response from GraphQL
  const simplified = rawData.edges.map(item => {
    return {
      name: item.node.name,
      placeholder: item.node.placeholder,
    };
  });

  // Only return placeholder for the current product
  const { placeholder } = simplified.filter(
    pro => pro.name.toString().toLowerCase() === product.toString().toLowerCase(),
  )[0];

  return placeholder;
}

export default usePlaceholder;

const query = graphql`
  query usePlaceholder {
    rawData:  allFile (filter: {sourceInstanceName: {eq: "placeholder"}}){
      edges {
        node {
          id
          name
          placeholder: childPlaceholderJson {
            Alternative
            AutoCAD
            CmdHeader
            MenuHeader
            StatusleisteLink
            dtmAssignDataAutocadHint
            dtmModelComputePrecondition1
            fullproduct
            geodgm
            geoprojectfullproduct
            geoprojectgeoprojectfullproduct_
            geoprojectgeoprojectproduct
            geoprojectproduct
            product
            productcrssettingspath
            productsuffix
			productpath
            rmMAP
          }
        }
      }
    }
  }
`;
