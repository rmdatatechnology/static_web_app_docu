import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Image = ({name, path, children, src, alt, kind, ...rest  }) => {

const [toggle, setToggle] = useState(true);
const tooltip = !alt || alt.trim === "" ? "" : alt;

const { listImages } = useStaticQuery(
    graphql`
      query{
        listImages: allFile (filter: {ext: {in: [".png", ".jpg", ".jpeg", ".gif"]}}) {
          
			 nodes {
				name
				publicURL
				relativeDirectory
				}
            }
          }
    `,
  );


let imageToUse;
let nameToUse;
let searchImage = false;
if(src)
{
	let nameWithout = src.split('/');
	name = nameWithout[nameWithout.length - 1];
	let nameWithoutExt = name.split('.');
	nameWithoutExt.pop();
	nameToUse = nameWithoutExt.join('.');
	
	if(kind === "releaseNote") //if it is a release note
	{
		searchImage = true;
		path = "img";
	}
	else
	{
		searchImage = false;
		imageToUse = null;
	}
}
else{
	let nameWithoutExt = name.split('.');
	nameWithoutExt.pop();
	nameToUse = nameWithoutExt.join('.');
	searchImage = true;
}

if(searchImage === true)
{
imageToUse = listImages.nodes.find(img => {
    if( nameToUse === img.name && img.relativeDirectory.includes(path))
		return img;

	return null;
  });
  if(imageToUse)
	src = imageToUse.publicURL;
}


	 function handleClick(e) {

		var modal = document.getElementById("myModal_" + nameToUse);
		var modalImg = document.getElementById("img_"  + nameToUse);
		if(modal && modalImg)
		{
			 if(toggle)
			 {
				setToggle(false);
				modal.style.display = "block";
				modalImg.src = src;
			 }
			else
			{
				setToggle(true);
				modal.style.display = "none";
			}
		}
	}
  if(nameToUse)
  {
	return (
		<>
		<div id={"myModal_" + nameToUse} className="modal" onClick={handleClick}>
			<img class="modal-content" id={"img_" + nameToUse} alt={tooltip} title={tooltip} />
		</div>
		<img id={nameToUse} onClick={handleClick} className="mdxImage" src={src} alt={tooltip} title={tooltip} />
		</>
		);
  }
  else
	return (<></>)
}

export default Image
