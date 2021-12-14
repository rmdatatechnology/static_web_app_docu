import React from 'react';
import { graphql } from 'gatsby';
import TitlePage from '../components/TitlePage';
import Sidebar from "../components/Sidebar";
import SEO from '../components/seo';
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import {
  Example,
  Danger,
  Warning,
  Success,
  Info,
  GeoDesigner,
  GeoMapper,
  GeoDesktop,
  Placeholder,
  U,
  Border,
  Bold,
  Menu,
  Italic,
  MarkdownLink,
} from "../components/MdxComponents";

import "../styles/styles.scss";


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
	   "table": ({ children }) => {
        return (
          <table className="mdxTable" >
            {children}
          </table>
        )
      },
	  img: (props) => {
        return (
         <img className="mdxImage" {...props} />
        )
      },
	  a: (props) => {
        
		return (
		<MarkdownLink {...props} />
        )
      },
      // Use the below components without having to import in *.mdx
      Example,
      Danger,
      Warning,
      Success,
      Info, 
	  GeoDesigner,
	  GeoMapper,
	  GeoDesktop,
	  Placeholder,
      U,
      Border,
      Bold,
      Menu,
      Italic,
    }
	

  return (
   
	<>
	<div className="pagecontainer">
		<div className="sidebar" id="sidemenu">
			<Sidebar />
		</div>
		<div className="contentpage">
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description}
				image={post.frontmatter.image}
			/>
			<div className="page-content" id="pageContent">
				<TitlePage text={post.frontmatter.title} />
				<section className="main-content">	 
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
				</section>
			</div>
		</div>
		<div className="end"></div>
	 </div>
    </>
  );
};

export const query = graphql`
  query Page($locale: String!, $id: String!) {
    mdx(
      fields: { locale: { eq: $locale } }
	  id: {eq: $id}
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