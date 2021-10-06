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
	 if(!url || url === "en" || url === "fr" ||url === "it" || url === "de") 
	 {
		return url === "de" ?
			navigate(`/`) :
			navigate(`/${lang}`);
	 }
	

    const associatedUrls = languageMapping.find(item => {
      let hasUrl = false;

      Object.entries(item).forEach(([key, value]) => {
        let last = value.split("/").pop();
		if (last === url) return hasUrl = true;
      });

      return hasUrl
    });

    if (!associatedUrls) return navigate("/");

    return lang === "de" ?
      navigate(`/`) :
      navigate(`/${lang}${associatedUrls[lang]}`);
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
