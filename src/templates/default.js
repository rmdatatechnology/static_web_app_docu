import React from 'react';
import { graphql } from 'gatsby';
import TitlePage from '../components/TitlePage';
import Sidebar from "../components/Sidebar";
import SEO from '../components/seo';
import Hr from "../components/Hr";
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

import "../styles/styles.scss";


const Default = ({ data }) => {
	
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
	 "table": ({ children }) => {
        return (
          <table className="mdxTable" >
            {children}
          </table>
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
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description}
				image={post.frontmatter.image}
			/>
			<div id="pageContent">
				<TitlePage text={post.frontmatter.title} />
				<section className="main-content">	 
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
				</section>
			</div>
		</div>
		<div />
		<div className="end"></div>
	 </div>
    </>
  );
};

export const query = graphql`
  query Default($locale: String!, $title: String!) {
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


export default Default;