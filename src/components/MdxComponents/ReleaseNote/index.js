import React from "react"
import { useStaticQuery, graphql } from 'gatsby';
import Image from "../Image"

const ReleaseNote = ({children, imgArray, valign, width, border, background, ...rest  }) => {
	
const imagesWithAlt = imgArray.split(';');;
const valignTable = valign !== null ? valign : "top";
const widthTable = width !== null ? width : "60%";
const tabeBackground = background !== null ? background  : "transparent";

 const mystyle = {
      'border-collapse': 'collapse',
      'border': border + ' solid lightgrey',
	  'background-color' : tabeBackground
	  
    };
	
const mystyleNone = {
      'border': 'none',
	  'background-color' : tabeBackground
    };
	
const divStyle = {
	'background-color' : tabeBackground
};

const styToUse = border !== null && border !== "none"  ?  mystyle : mystyleNone;


function getImages()
{
	if(imgArray !== null && imgArray.trim() !== "")
				{
			   return (
			   <td valign={valignTable} width={widthTable} style={styToUse}>
					  {imagesWithAlt.map(n => (  
						<div>
							{getImage(n)}  
						</div>
						))}  
				</td>
				);
				}
				else
				{
					return (<></>);
				}
					
}

function getImage(name)
{
	if(name === null || name.trim() === "")
		return (<div />)
	
	let imagesName = name.split(':');
	
	return (
	<div>
	<Image src={imagesName[0]} alt={imagesName[imagesName.length - 1]}/>
	<p align="center">{imagesName[imagesName.length - 1]}</p>
	</div>)
}

return (
	<div className="myReleaseNotes" style={divStyle}>
		<table style={styToUse}>
			<tr style={styToUse}>
				<td valign={valignTable} width={widthTable} style={styToUse}>{children}</td>
				{getImages()} 
				
				</tr>
		</table>
	</div>
  )
}

export default ReleaseNote
