import React from "react"
import { useStaticQuery, graphql } from 'gatsby';

const Video = ({path, linkText, children, ...rest  }) => {

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
    
	  if(img.name === 'youtube_preview')
		 return img;
	return null;
  });
  
 return (
  <div>
	{defaultImg && (
	<a href={path}>
          <img
            src={defaultImg.publicURL}
            alt={linkText}
			width="700px"
          />
		  </a>
        )}
        {!defaultImg && (
         <a href={path}>
		 <img
            src=""
            alt={linkText}
			width="700px"
          />
		  </a>
        )}
  </div>
  );
};

export default Video
