import React from "react"
import { useProduct } from '../../../hooks/products';
import "../../../styles/styles.scss";

const MarkdownLink = ({href,children, ...rest  }) => {
  
  const { product } = useProduct();
  let hrefname = href;
  if (hrefname) {
	  
	if(href.startsWith(".."))
		hrefname = "../" + hrefname;
	else if(href.startsWith("/"))
		hrefname = ".." + hrefname;
	else if(href.startsWith("."))
		hrefname = "." + hrefname;
	else 
		hrefname = "../" + hrefname;
  }
   let newLink = hrefname + "?product=" + product;
   
  if(href.startsWith("http:") || href.startsWith("https:"))
	newLink =href;
 
  
  return (
   <a href={newLink} {...rest}>{children}</a>
  )
}

export default MarkdownLink
