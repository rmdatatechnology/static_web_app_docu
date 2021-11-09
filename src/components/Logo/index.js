import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Logo = ({imageName, sizeOverride, classOverride}) => {
	
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
  
  const imageSize = sizeOverride === null || sizeOverride === undefined ? "75px" : sizeOverride;
  const classInfo = classOverride == null || classOverride === undefined ? "contact-logo" : classOverride;
  

  const defaultImg = listImages.nodes.find(img => {    
    if(imageName === null || imageName === undefined) {
	  if(img.name === 'logo')
		 return img;
    }
	else
		if(img.name == imageName)
			return img;
	return null;
  });
	
  return (
  <div className="inlines">
	{defaultImg && (
          <img
            src={defaultImg.publicURL}
            alt={defaultImg.name}
			className={classInfo}
			width={imageSize}
          />
        )}
        {!defaultImg && (
         <img
            src=""
            alt="Logo"
			className={classInfo}
			width={imageSize}
          />
        )}
  </div>
  );
};

export default Logo;




