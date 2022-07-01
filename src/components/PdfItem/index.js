import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import "../../styles/styles.scss";

const {
  getProcuctImage,
} = require(`../../utils/pageHelper`);



const PdfItem = ({
  slug,
  background,
  title,
  description,
  imageName,
  count,
  url
}) => {

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
  
  const imageToUse = getProcuctImage(listImages,imageName);
  
  function onClick(e) {
	
   
  }
  
 
  return (
            <>
			<div onClick={onClick}>
			<a className="downloadLink" href={url}>
				<table className="productTable">
				<tr>
				<td width="80vw" className="productTableCell">
				{imageToUse && (
				<img
					src={imageToUse.publicURL}
					alt={title}
				/>
				)}
			</td>
		    <td className="productTableCell">
			<h3 className="productHeader" >{title}</h3>
			<span className="productText">{description}</span>
			</td>
			</tr>
			</table>
		</a>
			</div>
			</>
		);
};

PdfItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default PdfItem;
