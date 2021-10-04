import React from 'react';
import GlobalStyles from '../styles/global';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { useLocale } from '../hooks/locale';

import * as S from './styled';
import Sidebar from "../components/Sidebar";

const BaseLayout = ({ children, pageContext: { locale } }) => {
  // Using the useLocale() hook to define the correct locale 
  // that will be available in all components of the tree thought its context
  const { changeLocale } = useLocale();
  changeLocale(locale);
  
  return (
    <>
      <GlobalStyles />
      <S.Wrapper>
        <Header />
        <S.SiteContent role="main">
		<S.ContainerMenu id="sidemenu">
          <Sidebar  />
		  </ S.ContainerMenu>
          <S.Container>{children}</S.Container>
        </S.SiteContent>
        <Footer />
      </S.Wrapper>
    </>
  )
};

export { BaseLayout };
