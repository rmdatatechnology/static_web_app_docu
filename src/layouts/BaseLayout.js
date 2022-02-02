import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocale } from '../hooks/locale';
import "../styles/styles.scss";

const BaseLayout = ({ children, pageContext: { locale } }) => {
  // Using the useLocale() hook to define the correct locale 
  // that will be available in all components of the tree thought its context
  const { changeLocale } = useLocale();
  changeLocale(locale);
  
  return (
    <>
      <div className="maincontainer">
        <div>
		<Header />
		</div>
        <div role="main">
          <div>{children}</div>
        </div>
		<div>
		<Footer />
		</div>
      </div>
    </>
  )
};

export { BaseLayout };
