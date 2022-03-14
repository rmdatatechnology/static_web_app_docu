import React from 'react';
import { graphql } from 'gatsby';
import PostItem from '../components/PostItem';
import TitlePage from '../components/TitlePage';
import useProducts from '../components/useProducts';
import SEO from '../components/seo';
import Footer from '../components/Footer';
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
} from "../components/MdxComponents";

import "../styles/styles.scss";

const Index = ({ data }) => {
	
  const productItems = useProducts();
  
  if (!data || !data.mdx) {
    return (
		<div className="pagecontainer">
			<div className="sidebar" id="sidemenu" />
			<div className="content">
				<div id="pageContent">
					<h1>{data.mdx.frontmatter.title}</h1>
					<h2>{data.mdx.frontmatter.description}</h2>
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
	  "table": ({ children }) => {
        return (
          <table className="mdxTable" >
            {children}
          </table>
        )
      },
      img: (props) => {
        return (
         <img className="mdxImage" alt="" {...props} />
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
	<div className="page">
		<div className="content">
			<div id="pageContent">
			<SEO
				title={data.mdx.frontmatter.title}
				description={data.mdx.frontmatter.title}
			/>
				<div className="top-section">
				<div className="center"><img alt="Produkte" src="csm_produkte_header_98c200bfaa.jpg" /></div>
				<div className="top-section-header">
				<h1>{data.mdx.frontmatter.title}</h1>
				<div className="hl_border"></div>
				<h2>{data.mdx.frontmatter.description}</h2>
				</div>
				</div>
				<br/>
				<section className="main-content">	 
				<div className="center">
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
					</div>
				</section>
			</div>
			<br />
			<br />
			<section className="custom-section">
			<div className="product-grid">
			{productItems.map(
				function({
					name,
					fullname,
					title,
					description,
					slug,
					img,
				})
				{
					return (
						
						<PostItem
							slug={slug}
							title={fullname}
							description={description}
							key={name}
							imageName={img}
						/>
					)
				}
				)}
				</div>
			</section>
			</div>
		<div className="end">
		</div>
	</div>
	</>
  );
};

export default Index;

export const query = graphql`
  query Index($locale: String!) {
    mdx(
        fields: { locale: { eq: $locale } }
        frontmatter: {display: {eq: "index"}}
    ) {
	frontmatter {
      title
	  description
    }
    body
    fields {
      locale
    }
	}
  }
`;
