import React from 'react';
import { navigate, useStaticQuery, graphql, Link } from "gatsby";
import { useLocale } from '../../hooks/locale';
import "../../styles/styles.scss";


const {
  getNewUrlWithoutPrefix,
} = require(`../../utils/pageHelper`);


const Languages = () => {
  // Grab the locale (passed through context) from the Locale Provider 
  // through useLocale() hook
  const { locale } = useLocale();

const prefix = useStaticQuery(graphql`
    query {
      site {
        pathPrefix
        }
      }
  `)

  function handleClickLanguage(e, lang) {
    e.preventDefault();
    if (locale === lang) return;

    const url = window.location.pathname.split("/").pop();
	 if(!url || url === "en" || url === "fr" ||url === "it") 
	 {
		return lang === "de" ?
			navigate(`/`) :
			navigate(`/${lang}`);
	 }
	
	if(lang === "de")
		navigate(`/` + getNewUrlWithoutPrefix(false, prefix.site.pathPrefix));
	else	
		navigate(`/${lang}/` + getNewUrlWithoutPrefix(false, prefix.site.pathPrefix));
  }
  
  function getLang() {
    
    if (locale === "de") return "DE";
	else if (locale === "it") return "IT";
	else if (locale === "fr") return "FR";

    return "DE";
  }


  return (
  <div className="language_dropdown">
  <button  className='language-button is-active'>{getLang()}</button>
  <div className="language_dropdown_content">
    <ul className="language_dropdown_list">
      <li className="language-link"	onClick={(e) => handleClickLanguage(e, "de")}>DE</li>
      <li className="language-link"	onClick={(e) => handleClickLanguage(e, "it")}>IT</li>
	  <li className="language-link"	onClick={(e) => handleClickLanguage(e, "fr")}>FR</li>
    </ul>
	</div>
	</div>
  );
};

export default Languages;
