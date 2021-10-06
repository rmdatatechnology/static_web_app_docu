import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import useTranslations from '../useTranslations';

import * as S from './styled';

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
                fluid(maxWidth: 600, maxHeight: 350) {
                  src
                  ...GatsbyImageSharpFluid
                }
              }
			  name
            }
          }
        }
      }
    `,
  );

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

  
	
  return (
    <S.PostItemLink to={slug}>
      <S.PostItemWrapper>
        {imageToUse && (
          <S.PostItemImg
            fluid={imageToUse.node.childImageSharp.fluid}
            alt={title}
          />
        )}
        {!imageToUse && defaultImg && (
          <S.PostItemImg
            fluid={defaultImg.node.childImageSharp.fluid}
            alt={title}
          />
        )}

        <S.PostItemInfo>
          <S.PostItemTag background={background} />
          <S.PostItemTitle>{title}</S.PostItemTitle>
          <S.PostItemDescription>{imageName}</S.PostItemDescription>
        </S.PostItemInfo>
      </S.PostItemWrapper>
    </S.PostItemLink>
  );
};

PostItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
};

export default PostItem;
