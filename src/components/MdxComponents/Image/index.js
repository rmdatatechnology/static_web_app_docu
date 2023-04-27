import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Image = ({name, path, children, src, alt, ...rest  }) => {

const [toggle, setToggle] = useState(true);
const tooltip = !alt || alt.trim === "" ? "" : alt;

const { listImages } = useStaticQuery(
    graphql`
      query{
        listImages: allFile (filter: {ext: {eq: ".png"}}) {
          
			 nodes {
				name
				publicURL
				relativeDirectory
				}
            }
          }
    `,
  );

if(src)
{
	let nameWithout = src.split('/');
	name = nameWithout[nameWithout.length - 1];
	path = "img";
}


let nameWithoutExt = name.split('.');
nameWithoutExt.pop();
const nameToUse = nameWithoutExt.join('.');
 
 const imageToUse = listImages.nodes.find(img => {
    if( nameToUse === img.name && img.relativeDirectory.includes(path))
		return img;
		
	return null;
  });
  
	 function handleClick(e) {
		
		var modal = document.getElementById("myModal_" + imageToUse.name);
		var modalImg = document.getElementById("img_"  + imageToUse.name);
		if(modal && modalImg)
		{
			 if(toggle)
			 {
				setToggle(false);
				modal.style.display = "block";
				modalImg.src = imageToUse.publicURL;
			 }
			else
			{
				setToggle(true);
				modal.style.display = "none";
			}
		}
	}	
  if(imageToUse)
  {
	return (
		<>
		<div id={"myModal_" + imageToUse.name} className="modal" onClick={handleClick}>
			<img class="modal-content" id={"img_" + imageToUse.name} alt={tooltip} title={tooltip} />
		</div>
		<img id={imageToUse.name} onClick={handleClick} className="mdxImage" src={imageToUse.publicURL} alt={tooltip} title={tooltip} />
		</>
		);
  }
  else
	return (<></>)
}

export default Image
