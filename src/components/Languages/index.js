import React from 'react';
import { navigate } from "gatsby";
import { useLocale } from '../../hooks/locale';
import useLanguageMapping from '../useLanguageMapping';

import * as S from './styled';

const Languages = () => {
  // Grab the locale (passed through context) from the Locale Provider 
  // through useLocale() hook
  const { locale } = useLocale();

  const languageMapping = useLanguageMapping();

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
	
	function associatedUrl() 
	{
	  let newUrl = window.location.pathname.split("/");
	  if(newUrl[0] === "")
		  newUrl.shift();
	  let hasLang = newUrl[0];
	  if(hasLang === "en" || hasLang === "fr" || hasLang === "it"|| hasLang === "de")
		  newUrl.shift();
	  
		return newUrl.join("/");
	} 
	
	if(lang === "de")
		navigate(`/` + associatedUrl());
	else	
		navigate(`/${lang}/` + associatedUrl());
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
