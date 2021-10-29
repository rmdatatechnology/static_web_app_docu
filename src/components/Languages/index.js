import React from 'react';
import { navigate, useStaticQuery, graphql } from "gatsby";
import { useLocale } from '../../hooks/locale';
import useLanguageMapping from '../useLanguageMapping';
import * as S from './styled';


const {
  getNewUrlWithoutPrefix,
} = require(`../../utils/pageHelper`);


const Languages = () => {
  // Grab the locale (passed through context) from the Locale Provider 
  // through useLocale() hook
  const { locale } = useLocale();

  const languageMapping = useLanguageMapping();

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
    <S.LanguageWrapper>
      <S.LanguageItem>
        <S.LanguageLink 
          to="/" 
          onClick={(e) => handleClickLanguage(e, "de")}
          className={locale === 'de' ? 'is-active' : ''}
        >
          DE
        </S.LanguageLink>
      </S.LanguageItem>
      <S.LanguageItem>
        <S.LanguageLink 
          to="/" 
          onClick={(e) => handleClickLanguage(e, "it")}
          className={locale === 'it' ? 'is-active' : ''}
        >
          IT
        </S.LanguageLink>
      </S.LanguageItem>
	   <S.LanguageItem>
        <S.LanguageLink 
          to="/" 
          onClick={(e) => handleClickLanguage(e, "fr")}
          className={locale === 'fr' ? 'is-active' : ''}
        >
          FR
        </S.LanguageLink>
      </S.LanguageItem>
    </S.LanguageWrapper>
  );
};

export default Languages;
