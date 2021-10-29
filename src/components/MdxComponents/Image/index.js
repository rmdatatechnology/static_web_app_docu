import React from "react"
import "./styles.scss"
import { useStaticQuery, graphql, withPrefix } from 'gatsby'

const Image = ({ children }) => {

  
  let child = children.toString();
  const alt = child ? child.split('$')[1] : false;
  child = child ? child.split('$')[0] : false;
  
  
  let pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  let newUrl = pathname.split("/");
  let isWithPrefix = false;

  if(newUrl[0] === "")
	newUrl.shift();
	   
  if("/documentation".toLowerCase().includes(newUrl[0].toLowerCase()))
	isWithPrefix=true;
  
 if(isWithPrefix)
	 child = "/documentation" + child;
  
  return (<span class="custom-image"><img src={child} alt={alt} /></span>);
}

export default Image
