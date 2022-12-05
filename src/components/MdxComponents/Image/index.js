import React from "react"
import { useStaticQuery, graphql } from 'gatsby';

const Image = ({name, path, children, ...rest  }) => {

let nameWithoutExt = name.split('.');
nameWithoutExt.pop();
const nameToUse = nameWithoutExt.join('.');

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
    if( nameToUse === img.name && img.relativeDirectory.includes(path))
		return img;
		
	return null;
  });
  if(imageToUse)
	return (<img className="mdxImage" src={imageToUse.publicURL} alt="" />);
  else
	return (<></>)
}

export default Image
