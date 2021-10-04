import React from 'react';
import { graphql } from 'gatsby';
import TitlePage from '../components/TitlePage';
import SEO from '../components/seo';
import Hr from "../components/Hr";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import {
  Primary,
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

import * as S from '../components/Content/styled';



const Page = ({ data }) => {
	
	if (!data) {
    return null;
  }
	
  const post = data.mdx;
  
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
      Primary,
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
	  
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={post.frontmatter.image}
      />
	  <div id="pageContent">
      <TitlePage text={post.frontmatter.title} />
	  <S.Content>	 
	   <MDXProvider components={mdxComponents}>
			<MDXRenderer>{data.mdx.body}</MDXRenderer>
	    </MDXProvider>
      </S.Content>
	  </div>
    </>
  );
};

export const query = graphql`
  query Page($locale: String!, $title: String!) {
    mdx(
      frontmatter: { title: { eq: $title } }
      fields: { locale: { eq: $locale } }
    ) {
      frontmatter {
        title
		image
		description
      }
      body
    }
  }
`;


export default Page;