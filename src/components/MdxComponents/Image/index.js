import React from "react"
import "./styles.scss"
import { useStaticQuery, graphql, withPrefix } from 'gatsby'

const Image = ({ children }) => {

  
  let child = children.toString();
  const alt = child ? child.split('$')[1] : false;
  child = child ? child.split('$')[0] : false;
  
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)
  
  let pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  let isWithPrefix = pathname === withPrefix("/");
  
  if(isWithPrefix)
	  child = data.site.siteMetadata.siteUrl + child;
  
  return (<span class="custom-image"><img src={child} alt={alt} /></span>);
}

export default Image
