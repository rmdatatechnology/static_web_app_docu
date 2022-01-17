import React, { useState } from 'react';
import { navigate } from "gatsby";
import useProducts from '../useProducts';
import { useProduct } from '../../hooks/products';
import "../../styles/styles.scss";

const ProductDropDown = () => {
 
  const productItems = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  
  const { product, changeProduct } = useProduct();
  let url = typeof window !== 'undefined' ? window.location.search : '';
  let params = new URLSearchParams(url); // product=GeoMapper
  let pro = params.get('product'); // product 
  if(pro)
   {
	  let prod = pro.toString().toLowerCase();
	  if(prod.toString().toLowerCase() === "geomapperse")
		  prod = "geomapper";
	
	  if(prod.toString().toLowerCase() !== product.toString().toLowerCase()) 
		changeProduct(prod.toString().toLowerCase());
	 
   }
  
  const toggling = () => 
  {
	  setIsOpen(!isOpen);
  } 
  
  const onOptionClicked = value => () => {
    setIsOpen(false);
  };
  
  const getProductName = () => 
  {
	let opt = productItems.find(
		k => k.product.toString().toLowerCase() === product.toString().toLowerCase()
		);
		
	return opt ? opt.name : "Products";
	  
  }
	function getNagigateTo(link, prod){
		
		let opt = productItems.find(
		k => k.name.toString().toLowerCase() === prod.toString().toLowerCase()
		);
		
		let newProd = opt ? ("?product=" + opt.product) : "";
		
		let newLink = link + newProd ;
		return newLink;
	};
  return (
	 <>
	 <div className="dropdown">
				<button className="dropdown-button" onClick={toggling}>
					<div>
					<span>{getProductName()}</span>
					{isOpen ?
					<span className="arrow-open" /> :
					<span className="arrow-closed" />
					}
					</div>
					</button>
			{isOpen && (
				<ul className="dropdown-list">
					{productItems.map(option => (
						<li className="dropdown-listitem" onClick={ event => {
							
							setIsOpen(false);
							navigate(getNagigateTo(option.link, option.name))
						}}>
						{option.name}
						</li>
              ))}
			</ul>
			)}
      </div>
	  </>
  );
};

export default ProductDropDown;
