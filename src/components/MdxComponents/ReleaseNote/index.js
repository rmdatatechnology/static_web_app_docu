import React from "react"
import { useStaticQuery, graphql } from 'gatsby';
import Image from "../Image"

const ReleaseNote = ({children, imgArray, valign, width, ...rest  }) => {
	
const imagesWithAlt = imgArray.split(';');;
const valignTable = valign !== null ? valign : "top";
const widthTable = width !== null ? width : "60%";

function getImages()
{
	if(imgArray !== null && imgArray.trim() !== "")
				{
			   return (
			   <td>
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
	<div className="myReleaseNotes">
		<table>
			<tr>
				<td valign={valignTable} width={widthTable}>{children}</td>
					{getImages()}
				
				</tr>
		</table>
	</div>
  )
}

export default ReleaseNote
