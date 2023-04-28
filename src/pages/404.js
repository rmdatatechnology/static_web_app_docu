import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Seo from '../components/seo';

import "../styles/styles.scss";

const NotFound = () => {
    return ( <  >
         < div className = "page" >
            < div className = "content" >
            < Seo title = "404" /  >
            < br /  >
			< br /  >
			< h1 > 404: Not Found <  / h1 >
			< br /  >
			< h2 > Diese Komponente ist nicht für den Einsatz in der gewählten Sprache nicht vorgesehen.<  / h2 >
			< br /  >
			< h2 > Ce composant n'est pas destiné à être utilisé dans la langue sélectionnée.<  / h2 >
			< br /  >
			< h2 > Questo componente non è destinato all'uso nella lingua selezionata.<  / h2 >
			< br /  >
			< p > You can report the 404 error to:
			< a href = "mailto:office@rmdatagroup.com" className = "contact-info-link" title = "E-Mail senden" >  < i className = "fa-envelope fa-lg far" >  <  / i > < span className = "mail" >office@rmdatagroup.com</span >  <  / a >
             <  / p >
             <  / div >
             < div className = "end" >  <  / div >
             <  / div >
             <  /  > );
}

export default NotFound;
