import React from 'react';
import Seo from '../components/seo';
import useTranslations from '../components/useTranslations';

import "../styles/styles.scss";

const NotFound = () => {
  const {
        errorText,
		errorTitle,
    } = useTranslations();

  
  return (<>
   <div className="page">
		<div className="content">
			<Seo title="404" />
			<br />
			<br />
			<h1>404: Not Found</h1>
			<br />
			<h2>{errorTitle}</h2>  
			<br />
			<p>{errorText}<a href="mailto:office@rmdatagroup.com" className="contact-info-link" title="E-Mail senden"><i className="fa-envelope fa-lg far"></i>&nbsp;<span className="mail">office@rmdatagroup.com</span></a>
			</p> 
		</div>
		<div className="end"></div>
	</div>
  </>);
}

export default NotFound;
