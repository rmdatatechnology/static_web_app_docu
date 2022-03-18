import React, { useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocale } from '../hooks/locale';
import "../styles/styles.scss";

const BaseLayout = ({ children, pageContext: { locale } }) => {
  // Using the useLocale() hook to define the correct locale 
  // that will be available in all components of the tree thought its context
  const { changeLocale } = useLocale();
  const footer = useRef();
  changeLocale(locale);
  let newheight = "20vh";

   useEffect(() => {
    if(footer)
	{
		newheight ="73vh";
		if(footer.current)
			newheight ="53vh";
		else
			newheight ="23vh";
	}
	
  });
  
  return (
    <>
      <div className="maincontainer">
        <div className="header">
		<Header/>
		</div>
        <div className="overall_content" role="main">
          <div>{React.cloneElement(children, {newheight: newheight})}</div>
        </div>
		 <div className="footer">
		<Footer ref={footer}/>
		</div>
      </div>
    </>
  )
};

export { BaseLayout };
