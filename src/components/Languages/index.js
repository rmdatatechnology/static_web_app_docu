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

  return (
    <ul className="language-wrapper">
      <li className="language-item">
        <Link
          to="/" 
          onClick={(e) => handleClickLanguage(e, "de")}
          className={locale === 'de' ? 'language-link is-active' : 'language-link'}
        >
          DE
        </Link>
      </li>
      <li className="language-item">
        <Link 
          to="/" 
          onClick={(e) => handleClickLanguage(e, "it")}
          className={locale === 'it' ? 'language-link is-active' : 'language-link'}
        >
          IT
        </Link>
      </li>
	   <li className="language-item">
        <Link 
          to="/" 
          onClick={(e) => handleClickLanguage(e, "fr")}
          className={locale === 'fr' ? 'language-link is-active' : 'language-link'}
        >
          FR
        </Link>
      </li>
    </ul>
  );
};

export default Languages;
