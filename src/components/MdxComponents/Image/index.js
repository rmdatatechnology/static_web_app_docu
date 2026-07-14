import React, { useState } from 'react';

const Image = ({data, name, path, children, src, alt, ...rest  }) => {

const [toggle, setToggle] = useState(true);
const tooltip = !alt || alt.trim === "" ? "" : alt;

if(!data)
	return (<></>)

let imageToUse;
let nameToUse;

if(src)
{
	let nameWithout = src.split('/');
	name = nameWithout[nameWithout.length - 1];
	let nameWithoutExt = name.split('.');
	nameWithoutExt.pop();
	nameToUse = nameWithoutExt.join('.');
}
else{
	let nameWithoutExt = name.split('.');
	nameWithoutExt.pop();
	nameToUse = nameWithoutExt.join('.');
}


imageToUse = data.nodes.find(img => {
    if( nameToUse === img.name)
		return img;

	return null;
  });
  if(imageToUse)
	src = imageToUse.publicURL;

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

