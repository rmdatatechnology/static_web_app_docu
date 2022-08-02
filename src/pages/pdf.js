import React from 'react';
import { graphql } from 'gatsby';
import PdfItem from '../components/PdfItem';
import useProducts from '../components/useProducts';
import Seo from '../components/seo';
import { useLocale } from '../hooks/locale';
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
  Kommentar,
} from "../components/MdxComponents";

import "../styles/styles.scss";

const Pdf = ({ data }) => {
	
  const productItems = useProducts();
  const { locale } = useLocale();
  
  if (!data || !data.mdx || !data.allFile) {
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
  
  let availablePdf = [];
  data.allFile.edges.forEach(function(e){
	  
	let languagePrefix = "de_";
	if(locale === "it")
		languagePrefix = "it_";
	if(locale === "fr")
		languagePrefix = "fr_";
	if(e.node.name.toLowerCase().includes(languagePrefix))
		availablePdf.push(e.node);
});

  
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
	  Kommentar,
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
				<h3 className="productHeader">{data.mdx.frontmatter.description}</h3>
				<section className="main-content">	 
				<div>
					<MDXProvider components={mdxComponents}>
						<MDXRenderer>{data.mdx.body}</MDXRenderer>
					</MDXProvider>
					</div>
				</section>
			</div>
			<div className="product-grid">
			{productItems.map(
				function({
					name,
					fullname,
					title,
					description,
					slug,
					img,
					en,
					it,
					fr,
				})
				{
					let des = description;
					if(locale === "it")
						des = it;
					if(locale === "fr")
						des = fr;
					
					let node = availablePdf.find(e => e.name.toLowerCase().includes(name.toLowerCase()));
					if(node)
					{
						return (
							
							<PdfItem
								slug={slug}
								title={fullname}
								description={des}
								key={name}
								imageName={img}
								count={count}
								url={node.publicURL}
							/>
						)
					}
					
					return (
					<></>
					)
				}
				)}
				</div>
			</div>
		<div className="end">
		</div>
	</div>
	</>
  );
};

export default Pdf;

export const query = graphql`
  query Pdf($locale: String!) {
    mdx(
        fields: { locale: { eq: $locale } }
        frontmatter: {display: {eq: "pdf"}}
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
	allFile(filter: {ext: {}, extension: {eq: "pdf"}}) {
    edges {
      node {
        name
		publicURL
      }
    }
  }
  }
`;
