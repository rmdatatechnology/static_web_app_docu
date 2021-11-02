import React from "react"
import { useProduct } from '../../../hooks/products';

const Product = ({ currentproduct, children}) => {
const { product } = useProduct();

  return product===currentproduct ?
    (<span currentproduct={currentproduct}>
      {children}
    </span>) :
	(<span />)

}

export default Product
