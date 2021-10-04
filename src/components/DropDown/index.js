import React, { useState, useContext } from 'react';
import useProducts from '../useProducts';
import { useStaticQuery, graphql } from 'gatsby';
import LocalizedLink from '../LocalizedLink';
import { useProduct } from '../../hooks/products';

import * as S from './styled';

const ProductDropDown = () => {
  const productItems = useProducts();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const { product, changeProduct } = useProduct();
  let url = typeof window !== 'undefined' ? window.location.search : '';
  let params = new URLSearchParams(url); // product=GeoMapper
  let pro = params.get('product'); // product 
  if(pro)
   {
	  changeProduct(pro.toString().toLowerCase());
	  params.delete('product');
	  pro=null;
   }
  
  const toggling = () => 
  {
	  setIsOpen(!isOpen);
  } 
  
  const onOptionClicked = value => () => {
	pro=null;
	changeProduct(value.toString().toLowerCase());
    setIsOpen(false);
  };
  
  const getProduct = () => 
  {
	let opt = productItems.find(
		k => k.name.toString().toLowerCase() === product.toString().toLowerCase()
		);
		
	return opt ? opt.name : "Products";
	  
  }

	const arrowClosed = (
	<span className="arrow-closed" />
	)
	const arrowOpen = (
	<span className="arrow-open" />
	)
  
  return (
	 <>
	 <S.Dropdown>
				<S.Button onClick={toggling}>
					<div>
					<span>{getProduct()}</span>
					{isOpen ?
					<S.ArrowOpen /> :
					<S.ArrowClosed />
					}
					</div>
					</S.Button>
			{isOpen && (
				<S.DropDownList>
					{productItems.map(option => (
						<S.ListItem onClick={onOptionClicked(option.name)}>
							<S.DropDownLink to={option.link}>{option.name}</S.DropDownLink>
						</S.ListItem>
              ))}
			</S.DropDownList>
			)}
      </S.Dropdown>
	  </>
  );
};

export default ProductDropDown;
