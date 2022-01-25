import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { useLocale } from '../../hooks/locale';
import "../../styles/styles.scss";

const PostItem = ({
  slug,
  background,
  title,
  description,
  imageName,
  count,
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

  const defaultImg = listImages.nodes.find(img => {
    if(img.name === 'default')
		return img;
		
	return null;
  });
  
  const imageToUse = listImages.nodes.find(img => {
    if(img.name === imageName.toString())
		return img;
		
	return null;
  });

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
		<br />
        <h1 className="productTitle">{title}</h1>
		{imageToUse && (
          <img
		    className="productImg"
            src={imageToUse.publicURL}
            alt={title}
			
          />
        )}
        {!imageToUse && defaultImg && (
         <img
            src={imageToUse.publicURL}
            alt={title}
			className="productImg"
          />
        )}
		<br />
        <div>{description}</div>
		<br />
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
