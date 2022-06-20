import React from 'react';
import { graphql } from 'gatsby';
import PostItem from '../components/PostItem';
import useProducts from '../components/useProducts';
import { useLocale } from '../hooks/locale';
import Seo from '../components/seo';
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
  const { locale } = useLocale();
  
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
	    h2: ({ children }) => {
		return (
		<h2 className="h2main1" >
            {children}
          </h2>
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
	
	let count = 0;
 
  return (
    <>
	<div className="page">
		<div className="content">
			<div id="pageContent">
			<Seo
				title={data.mdx.frontmatter.title}
				description={data.mdx.frontmatter.title}
			/>
				<h1>{data.mdx.frontmatter.title}</h1>
				<section className="main-content">	 
				<div>
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
					</div>
				</section>
			</div>
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
					de,
					it,
					fr,
					en,
				})
				{
					let des = description;
					if(locale === "it")
						des = it;
					if(locale === "fr")
						des = fr;
					
					
					if(count === 3)
						count = 0;
						
					count++;
					
					return (
						
						<PostItem
							slug={slug}
							title={fullname}
							description={des}
							key={name}
							imageName={img}
							count={count}
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
