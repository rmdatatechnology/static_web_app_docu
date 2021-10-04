import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import PostItem from '../components/PostItem';
import TitlePage from '../components/TitlePage';
import LocalizedLink from '../components/LocalizedLink';
import useTranslations from '../components/useTranslations';

import * as S from '../components/ListWrapper/styled';

const Index = ({ data: { allMdx } }) => {
  // useTranslations is aware of the global context (and therefore also "locale")
  // so it'll automatically give back the right translations
  const {
    hello,
    subline,
    category,
    products,
  } = useTranslations();

  const postList = allMdx.edges;

  return (
    <div className="homepage">
      <SEO title="Home" />
      <TitlePage text={hello} />
      <p>{subline}</p>
      <hr style={{ margin: `2rem 0` }} />
      <h2>
        <strong>{products}</strong>
      </h2>

      <br />

      <S.ListWrapper>
        {postList.map(
          ({
            node: {
              frontmatter: {
                background,
                category,
                title,
              },
              slug,
            },
          }) => (
              <PostItem
                slug={`/${slug}`}
                background={background}
                category={category}
                title={title}
                key={slug}
              />
            ),
        )}
      </S.ListWrapper>

      <br />

     
    </div>
  );
};

export default Index;

export const query = graphql`
  query Index($locale: String!, ) {
    allMdx(
      filter: {
        fields: { locale: { eq: $locale } }
        fileAbsolutePath: {regex: "/(products.)..(.md)/"}
      }
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          timeToRead
          fields {
            locale
          }
		  slug
        }
      }
    }
  }
`;
