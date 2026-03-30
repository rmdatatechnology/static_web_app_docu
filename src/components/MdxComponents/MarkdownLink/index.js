import React from "react"
import { useProduct } from '../../../hooks/products';
import "../../../styles/styles.scss";

const MarkdownLink = ({href,children, ...rest  }) => {
  
  const { product } = useProduct();
  if (href) {
	  
	if(href.startsWith(".."))
		href = "../" + href;
	else if(href.startsWith("/"))
		href = ".." + href;
	else if(href.startsWith("."))
		href = "." + href;
	else 
		href = "../" + href;
  }
  const newLink = href + "?product=" + product;
  
  return (
   <a href={newLink} {...rest}>{children}</a>
  )
}

export default MarkdownLink
