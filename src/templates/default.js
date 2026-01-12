import React from 'react';
import { graphql } from 'gatsby';
import TitlePage from '../components/TitlePage';
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
    DownloadLink,
    U,
    Border,
    Bold,
    Menu,
    Italic,
    MarkdownLink,
    Kommentar,
    IMButton,
    IMIconButton, IMPredefinedElement,
} from "../components/MdxComponents";

import "../styles/styles.scss";
import Icon from '../components/MdxComponents/Icon';

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
	   img: (props) => {
        return (
         <img className="mdxImage"  alt={props.alt} {...props} />
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
	  DownloadLink,
      U,
      Border,
      Bold,
      Menu,
      Italic,
	  Kommentar,
      Icon,
      IMButton,
      IMIconButton,
      IMPredefinedElement
    }


  return (

	<>
	<div className="pagecontainer">
		<div className="content">
			<Seo
				title={post.frontmatter.title}
				description={post.frontmatter.description}
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
  query Default($locale: String!, $id: String!) {
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


export default Default;
