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
			<li>
			<div  className="searchResContainer" onClick={event => onClick()}>
			<table className="customTable"><tr  className="customTr"><td className="customTd" width="250px">
			<img src={imageToUse.publicURL} alt={title} width="200px"/></td>
            <td  className="customTd"><h3 className="searchheader"><span>{title}</span></h3>
            <span>{description}</span></td>
			</tr>
			</table>
            </div>
			<hr className="customSeperator" />
			</li>
			</>
		);
};

PdfItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
};

export default PdfItem;
