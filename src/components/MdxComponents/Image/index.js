import React from "react"
import "./styles.scss"

const Image = ({ children }) => {

  
  let child = children.toString();
  const alt = child ? child.split('$')[1] : false;
  child = child ? child.split('$')[0] : false;
  
  return (<span class="custom-image"><img src={child} alt={alt} /></span>);
}

export default Image
