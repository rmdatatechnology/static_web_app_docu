import React from "react"
import { useStaticQuery, graphql } from 'gatsby';

const Image = ({name, path, children, ...rest  }) => {

const nameWithoutExt = name.split('.');
const nameToUse = nameWithoutExt[0];
if(nameWithoutExt.lenght > 2)
	nameToUse = nameToUse + "." + nameWithoutExt[1];

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
    if( nameToUse === img.name && path.includes(img.relativeDirectory))
		return img;
		
	return null;
  });
  if(imageToUse)
	return (<img className="mdxImage" src={imageToUse.publicURL} alt="" />);
  else
	return (<></>)
}

export default Image
