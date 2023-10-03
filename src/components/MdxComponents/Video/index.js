import React from "react"
import { useStaticQuery, graphql } from 'gatsby';

const Video = ({path, linkText, placeholder, target, children, ...rest  }) => {


let nameWithoutExt = 'youtube_preview';
let useTarget = "_self";

if(placeholder)
	nameWithoutExt = placeholder;

if(target)
	useTarget = target;


 const { listImages, defaultImages } = useStaticQuery(
    graphql`
      query {
        listImages: allFile (filter: {ext: {eq: ".png"}}) {
          
			 nodes {
				name
				publicURL
				absolutePath
				}
            }
			defaultImages: allFile (filter: {ext: {eq: ".png"}, name: {eq: "youtube_preview"} }) {
          
			 nodes {
				name
				publicURL
				absolutePath
				}
            }
          }
    `,
  );
  
  
  const usedImg = listImages.nodes.find(img => {    
    
	  if(img.name === nameWithoutExt)
		 return img;
	return null;
  });
  
  const defaultImg = defaultImages.nodes.find(img => {    
    
	  if(img.name === "youtube_preview")
		 return img;
	return null;
  });
  
 return (
  <div>
	{usedImg && (
	<a href={path} target={useTarget}>
          <img
            src={usedImg.publicURL}
            alt={linkText}
			width="700px"
			title={linkText}
          />
		  </a>
        )}
        {!usedImg && (
         <a href={path} target={useTarget}>
		 <img
            src={defaultImg.publicURL}
            alt={linkText}
			title={linkText}
			width="700px"
          />
		  </a>
        )}
  </div>
  );
};

export default Video
