import React from 'react';
import GlobalStyles from '../styles/global';
import Header from '../components/Header';
import { useLocale } from '../hooks/locale';
import "../styles/styles.scss";

const BaseLayout = ({ children, pageContext: { locale } }) => {
  // Using the useLocale() hook to define the correct locale 
  // that will be available in all components of the tree thought its context
  const { changeLocale } = useLocale();
  changeLocale(locale);
  
  return (
    <>
      <GlobalStyles />
      <div className="maincontainer">
        <div>
		<Header />
		</div>
        <div role="main">
          <div>{children}</div>
        </div>
        
      </div>
    </>
  )
};

export { BaseLayout };
