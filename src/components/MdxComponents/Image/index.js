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
        pathPrefix
        }
      }
  `)
  
  let pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  let newUrl = pathname.split("/");
  let isWithPrefix = false;

  if(newUrl[0] === "")
	newUrl.shift();
	   
  if(data.site.pathPrefix.toLower().includes(newUrl[0].toLower()))
	isWithPrefix=true;
  
  if(isWithPrefix)
	  child = data.site.pathPrefix + child;
  
  return (<span class="custom-image"><img src={child} alt={alt} /></span>);
}

export default Image
