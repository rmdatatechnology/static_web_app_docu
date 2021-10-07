import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import PostItem from '../components/PostItem';
import TitlePage from '../components/TitlePage';
import LocalizedLink from '../components/LocalizedLink';
import Hr from "../components/Hr";
import useProducts from '../components/useProducts';
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import {
  Example,
  Danger,
  Warning,
  Success,
  Info,
  Collapsable,
  GeoDesigner,
  GeoMapper,
  GeoDesktop,
  Placeholder,
  U,
  Border,
  Bold,
  Menu,
  Italic,
  Image,
} from "../components/MdxComponents";


import * as S from '../components/ListWrapper/styled';
import * as St from '../components/Content/styled'
import "../styles/styles.scss";

const Index = ({ data }) => {
  
  const productItems = useProducts();
  
  if (!data || !data.mdx) {
    return (
		<div className="pagecontainer">
			<div className="sidebar" id="sidemenu" />
			<div className="content">
				<div id="pageContent">
					<TitlePage text={data.mdx.frontmatter.title} />
				</div>
				<br />
				<br />
			</div>
			<div className="end"></div>
		</div>
	);
  }
  
  

  
  // Customize markdown component
    const mdxComponents = {
      "ul.li": ({ children }) => {
        return (
          <li>
            <span className="ul-children">{children}</span>
          </li>
        )
      },
      "ol.li": ({ children }) => {
        return (
          <li>
            <span>{children}</span>
          </li>
        )
      },
      hr: () => <Hr widthInPercent="100" verticalMargin="0.8rem" />,
      // Use the below components without having to import in *.mdx
      Example,
      Danger,
      Warning,
      Success,
      Info,
      Collapsable,
	  GeoDesigner,
	  GeoMapper,
	  GeoDesktop,
	  Placeholder,
      U,
      Border,
      Bold,
      Menu,
      Italic,
      Image,
    }

  return (
    <>
	<div className="pagecontainer">
		<div className="sidebar" id="sidemenu" />
		<div className="content">
			<div id="pageContent">
				<TitlePage text={data.mdx.frontmatter.title} />
				<St.Content>	 
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
				</St.Content>
			</div>
			<br />
			<br />
			<S.ListWrapper>
				{productItems.map(
				({
					name,
					title,
					slug,
					img,
          }) => (
              <PostItem
                slug={slug}
                title={name}
                key={name}
				imageName={img}
              />
            ),
        )}
      </S.ListWrapper>
		</div>
		<div className="end"></div>
	</div>
	</>
  );
};

export default Index;

export const query = graphql`
  query Index($locale: String!) {
    mdx(
        fields: { locale: { eq: $locale } }
        frontmatter: {description: {eq: "index"}}
    ) {
	frontmatter {
      title
    }
    body
    fields {
      locale
    }
	}
  }
`;
