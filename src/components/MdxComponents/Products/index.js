import React from "react"
import { useProduct } from '../../../hooks/products';

const Product = ({ currentproduct, children}) => {
const { product } = useProduct();

if(product===currentproduct)
	return (<span currentproduct={currentproduct}>
			{children}
			</span>)
else if (product==="geomatik" && currentproduct === "geomapper")
	return (<span currentproduct="geomapper">
			{children}
			</span>)
else
  return (<span />)

}

export default Product
