import React from 'react';
import { graphql } from 'gatsby';
import PostItem from '../components/PostItem';
import TitlePage from '../components/TitlePage';
import useProducts from '../components/useProducts';
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
 let count = 0;
 function linebreak(){
	count = count + 1;
	if(count%3 === 0)
		return "<div><br />fdsfdsf<br /></div>)";
	else 
		return null;
  }

  return (
    <>
	<div className="pagecontainer">
		<div className="sidebar" id="sidemenu" />
		<div className="content">
			<div id="pageContent">
				<TitlePage text={data.mdx.frontmatter.title} />
				<section className="main-content">	 
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
				</section>
			</div>
			<br />
			<br />
			<section className="custom-section">
			<div className="productGrid">
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
					let useLB = linebreak();
					
					return (
						<div className="productGridItem">
						<PostItem
							slug={slug}
							title={fullname}
							description={description}
							key={name}
							imageName={img}
							count={count}
						/>
						</div>
					)
				}
				)}
				</div>
			</section>
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
