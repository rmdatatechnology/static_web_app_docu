import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { useProduct } from '../../../hooks/products';
import { useLocale } from '../../../hooks/locale';

const Product = ({ currentproduct, children}) => {
const { product } = useProduct();
const { locale } = useLocale();

  return product===currentproduct ?
    (<span currentproduct={currentproduct}>
      {children}
    </span>) :
	(<span />)

}

export default Product
