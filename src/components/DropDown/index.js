import React from 'react';
import { navigate } from 'gatsby';
import useProducts from '../useProducts';
import { useProduct } from '../../hooks/products';
import "../../styles/styles.scss";
import { useMenu } from '../../hooks/menu';


  
const ProductDropDown = () => {
 
  const productItems = useProducts();
  const { openedMenu, toggleMenu } = useMenu();
  
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
  
  
  const getProductName = () => 
  {
	let opt = productItems.find(
		k => k.product.toString().toLowerCase() === product.toString().toLowerCase()
		);
		
	return opt ? opt.fullname : "Products";
	  
  }
	function getNagigateTo(link, prod){
		
		let pathname = typeof window !== 'undefined' ? window.location.pathname : null;
		if(pathname.includes('/search')) // we are already on the search side and we only want to change the product
		{
			toggleMenu('search');
			link = "";
		}
		else
			toggleMenu('products');
		
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
				<button  className={openedMenu === 'products' ? 'dropdown-button is-active' : 'dropdown-button'}>Produkte - {getProductName()}</button>
				<div className="dropdown-content">
				<span className="dropdown-arrow" />
				<ul className="dropdown-list">
					{productItems.map(option => (
						<li className="dropdown-listitem" role='presentation' onClick={ event => {
							navigate(getNagigateTo(option.link, option.name))
						}}>
						{option.fullname}
						</li>
              ))}
			</ul>
			</div>
      </div>
	  </>
  );
};

export default ProductDropDown;
