import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Logo = () => {
	
	const { listImages } = useStaticQuery(
    graphql`
      query {
        listImages: allFile (filter: {ext: {eq: ".png"}, relativeDirectory: {eq: ""}}) {
          
			 nodes {
				name
				publicURL
				absolutePath
				}
            }
          }
    `,
  );
  

  const defaultImg = listImages.nodes.find(img => {
    if(img.name === 'logo')
		return img;
		
	return null;
  });
	
  return (
  <div>
	{defaultImg && (
          <img
            src={defaultImg.publicURL}
            alt={defaultImg.name}
			height="75px"
          />
        )}
        {!defaultImg && (
         <img
            src=""
            alt="Logo"
			height="75px"
          />
        )}
  </div>
  );
};

export default Logo;
