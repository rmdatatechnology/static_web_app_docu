import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { useLocale } from '../../hooks/locale';
import "../../styles/styles.scss";


const {
  getProcuctImage,
} = require(`../../utils/pageHelper`);



const PostItem = ({
  slug,
  background,
  title,
  description,
  imageName,
}) => {
const { locale } = useLocale();
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
	e.preventDefault();
   
		const urlM = window.location.pathname;
		const isLocale = urlM.includes(`/${locale}/`);

		if(isLocale === false && locale === "de")
			return navigate(`${slug}`);
		else
			return navigate(`/${locale}${slug}`);
   
  }
  
 
  return (
	<div onClick={onClick} className="productButton">
        <div>
		<h1 className="productTitle">{title}</h1>
		</div>
		<div>
		{imageToUse && (
          <img
		    className="productImg"
            src={imageToUse.publicURL}
            alt={title}
			
          />
        )}
		</div>
        <div>{description}</div>
    </div>
  );
};

PostItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
};

export default PostItem;
