import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Seo from '../components/seo';

import "../styles/styles.scss";

const NotFound = () => {

   const pathname = typeof window !== 'undefined' ? window.location.pathname : "de";
   
   const { rawData } = useStaticQuery(
    graphql`
      query{
        rawData: allFile(filter: { sourceInstanceName: { eq: "translations" } }) {
		  edges {
			node {
			  name
			  translations: childTranslationsJson {
				errorTitle
				errorText
			  }
			}
		  }
		}
	  }
    `,
  );

  // Simplify the response from GraphQL
  const simplified = rawData.edges.map(item => {
    return {
      name: item.node.name,
      translations: item.node.translations,
    };
  });
  let newUrl = pathname.split("/");
  if(newUrl[0] === "")
	newUrl.shift();
 
 if(newUrl[0].includes("documentation"))
	  newUrl.shift();

    // Only return translations for the current locale
    const {
        translations
    } = simplified.filter(
            lang => newUrl[0].includes(lang.name))[0];

    const {
        errorText,
        errorTitle,
    } = translations;

    return ( <  >
         < div className = "page" >
            < div className = "content" >
            < Seo title = "404" /  >
            < br /  >
			< h2 > {pathname}<  / h2 >
			< br /  >
			< h1 > 404: Not Found <  / h1 >
			< br /  >
			< h2 > {errorTitle}<  / h2 >
			< br /  >
			< p > {errorText}
			< a href = "mailto:office@rmdatagroup.com" className = "contact-info-link" title = "E-Mail senden" >  < i className = "fa-envelope fa-lg far" >  <  / i > < span className = "mail" >office@rmdatagroup.com</span >  <  / a >
             <  / p >
             <  / div >
             < div className = "end" >  <  / div >
             <  / div >
             <  /  > );
}

export default NotFound;
