import { useStaticQuery, graphql } from 'gatsby';

function useVariables() {
  // Query the JSON files in <rootDir>/i18n/translations
  const { rawData } = useStaticQuery(query);
  return rawData.nodes[0].variables;
}

export default useVariables;

const query = graphql`
  query useVariables {
    rawData: allFile(
      filter: { sourceInstanceName: { eq: "variables" } }
    ) {
        nodes {
          name
          variables:  childVariablesJson {
			  productused
			  version
			  elasticurl
			  elasticindex
			  elasticcredentials
			  elasticapikey
			  useindex
			}	
        }
    }
  }
`;
