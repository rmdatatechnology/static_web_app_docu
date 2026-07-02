import React from 'react';
import { graphql } from 'gatsby';
import TitlePage from '../components/TitlePage';
import Seo from '../components/seo';
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx-v1";
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
    IMPredefinedElement,
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
         <Image data={data.allFile} alt={props.alt} {...props} />
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
	  InfoWeb,
	  Placeholder,
      U,
      Border,
      Bold,
      Menu,
      Italic,
	  Image: (props)=> {
        return (
         <Image data={data.allFile} {...props} />
        )
      },
	  MarkdownLink,
	  DownloadLink,
	  Kommentar,
	  Video,
	  ReleaseNote : (props)=> {
        return (
         <ReleaseNote data={data.allFile} {...props} />
        )
      },
      IMButton,
      IMIconButton,
      IMPredefinedElement
    }


  return (

	<>
	<div className="pagecontainer">
		<div className="content">
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

export const Head  = ({data}) => (
  <Seo title={data.mdx.frontmatter.title} description={data.mdx.frontmatter.description} image={data.mdx.frontmatter.image}/>
)

export const query = graphql`
  query Default($locale: String!, $id: String!, $relativeImageRegex : String!) {
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
  allFile(
    filter: {extension: {in: ["png", "jpg", "jpeg", "gif"]}, 
    relativeDirectory: {regex: $relativeImageRegex}}
  ) {
       nodes {
			name
			publicURL
			relativeDirectory
		}
    }
  }
`;


export default Default;
