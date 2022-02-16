import React from "react"
import { useStaticQuery, graphql } from 'gatsby';

const Image = ({name, path, children, ...rest  }) => {

const nameWithoutExt = name.split('.');

 const { listImages } = useStaticQuery(
    graphql`
      query{
        listImages: allFile (filter: {ext: {eq: ".png"}, relativeDirectory: {regex: "\/img\/"}}) {
          
			 nodes {
				name
				publicURL
				relativeDirectory
				}
            }
          }
    `,
  );
 
 const imageToUse = listImages.nodes.find(img => {
    if(nameWithoutExt[0] === img.name && path.includes(img.relativeDirectory))
		return img;
		
	return null;
  });
  if(imageToUse)
	return (<img className="mdxImage" src={imageToUse.publicURL} alt="" />);
  else
	return (<></>)
}

export default Image
