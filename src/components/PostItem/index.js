import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import useTranslations from '../useTranslations';
import { useLocale } from '../../hooks/locale';
import { GatsbyImage } from "gatsby-plugin-image"
import "../../styles/styles.scss";

const PostItem = ({
  slug,
  background,
  title,
  description,
  imageName,
}) => {
  const { toRead } = useTranslations();

  const { listImages } = useStaticQuery(
    graphql`
      query {
        listImages: allFile (filter: {ext: {eq: ".png"}}) {
          edges {
            node {
              childImageSharp {
                gatsbyImageData
              }
			  name
            }
          }
        }
      }
    `,
  );
	const { locale } = useLocale();
  const defaultImg = listImages.edges.find(img => {
    if(img.node.name === 'default')
		return img;
		
	return null;
  });
  
  const imageToUse = listImages.edges.find(img => {
    if(img.node.name === imageName.toString())
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
    <button onClick={onClick}>
      <section>
        {imageToUse && (
          <GatsbyImage
            image={imageToUse.node.childImageSharp.gatsbyImageData}
            alt={title}
          />
        )}
        {!imageToUse && defaultImg && (
          <GatsbyImage
            image={defaultImg.node.childImageSharp.gatsbyImageData}
            alt={title}
          />
        )}

        <div className="productItem">
          <span className="productInfo" />
          <h1 className="productTitle">{title}</h1>
          <p>{description}</p>
        </div>
      </section>
    </button>
  );
};

PostItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
};

export default PostItem;
