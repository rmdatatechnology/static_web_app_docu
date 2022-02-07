import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import useVariables from '../components/useVariables';

const ProductContext = createContext('');



const ProductProvider = ({ children }) => {
	
  const {
		productused,
  } = useVariables();
  
  let prod = 'geomapper';
  if(productused && productused !== "")
	  prod = productused;
  
  const [ product, setProduct] = useState(prod);

  function changeProduct(product) {
    setProduct(product);
  }

  return (
    <ProductContext.Provider value={{ product, changeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within an ProductProvider');
  }
  return context;
};

export { ProductProvider, useProduct };