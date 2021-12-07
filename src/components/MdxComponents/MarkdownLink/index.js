import React from "react"
import { useProduct } from '../../../hooks/products';
import "../../../styles/styles.scss";

const MarkdownLink = ({href,children, ...rest  }) => {
  
  const { product } = useProduct();
  
  const newLink = href + "?product=" + product;
  
  return (
   <a href={newLink} {...rest}>{children}</a>
  )
}

export default MarkdownLink
