import React from 'react';
import { graphql } from 'gatsby';
import Sidebar from "../components/Sidebar";
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
    InventoryManager,
    SmartArea,
    SmartNetworx,
    SmartInfra,
    GeoWeb,
    Mobile,
    Kommassierung,
    Geomatik,
    InfoWeb,
    GeoMapperOnly,
    Placeholder,
    U,
    Border,
    Bold,
    Menu,
    Italic,
    MarkdownLink,
    DownloadLink,
    Image,
    Kommentar,
    Video,
    ReleaseNote,
    IMIconButton,
    IMButton,
    Icon,
    IMPredefinedElement,
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
         <Image alt={props.alt} {...props} />
        )
      },
	  a: (props) => {

		return (
		<MarkdownLink {...props} />
        )
      },
	  h1: ({ children }) => {
        return (
          <h1 className="customH1" >
            {children}
          </h1>
        )
      },
	  h3: ({ children }) => {
        return (
		<h3 className="customH3" >
            {children}
          </h3>
        )
      },
	  h4: ({ children }) => {
       return (
		<h4 className="customH4" >
            {children}
          </h4>
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
	  InventoryManager,
	  SmartArea,
	  SmartNetworx,
      SmartInfra,
      GeoWeb,
	  Mobile,
	  Kommassierung,
	  Geomatik,
	  GeoMapperOnly,
	  Placeholder,
      U,
      Border,
      Bold,
      Menu,
      Italic,
	  Image,
	  MarkdownLink,
	  DownloadLink,
	  Kommentar,
	  Video,
	  ReleaseNote,
      Icon,
      IMButton,
      IMIconButton,
        IMPredefinedElement
    }


  return (

	<>
	<div className="pagecontainer">
		<div className="sidebar" id="sidemenu">
			<Sidebar />
		</div>
		<div className="content">
			<Seo
				title={post.frontmatter.title}
				description={post.frontmatter.description}
			/>
			<div id="pageContent">
				<h1  className="customH1" > {post.frontmatter.title} </h1>
				<section className="main-content">
					<MDXProvider components={mdxComponents}>
						<MDXRenderer height="100%">{data.mdx.body}</MDXRenderer>
					</MDXProvider>
				</section>

			</div>
		</div>
		<div className="end">

		</div>
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
