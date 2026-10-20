import React from 'react';
import { graphql } from 'gatsby';
import SidebarDrawer from "../components/SidebarDrawer";
import Seo from '../components/seo';
import { MDXProvider } from "@mdx-js/react";
import MdxBody from "../components/MdxBody";
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
    withV1Mapping,
} from "../components/MdxComponents";

import "../styles/styles.scss";

const Page = ({ data, pageContext }) => {

	if (!data) {
    return null;
  }
  const post = data.mdx;
  
  // Customize markdown component
    const mdxComponents = withV1Mapping({
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
      Icon,
      IMButton,
      IMIconButton,
      IMPredefinedElement
    })


  return (

	<>
	<div className="pagecontainer">
		<SidebarDrawer pageId={pageContext && pageContext.id} />
		<div className="content">
			<div id="pageContent">
				<h1  className="customH1" > {post.frontmatter.title} </h1>
				<section className="main-content">
					<MDXProvider components={mdxComponents}>
						<MdxBody code={data.mdx.compiledBody} />
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

export const Head  = ({data}) => (
  <Seo title={data.mdx.frontmatter.title} description={data.mdx.frontmatter.description} image={data.mdx.frontmatter.image}/>
)

export const query = graphql`
  query Page($locale: String!, $id: String!, $relativeImageRegex : String!) {
    mdx(
      fields: { locale: { eq: $locale } }
	  id: {eq: $id}
    ) {
      compiledBody
      frontmatter {
        title
		image
		description
      }
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


export default Page;
