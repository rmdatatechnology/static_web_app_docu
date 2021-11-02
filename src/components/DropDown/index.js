import React, { useState, useContext } from 'react';
import useProducts from '../useProducts';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import LocalizedLink from '../LocalizedLink';
import { useProduct } from '../../hooks/products';
import "../../styles/styles.scss";

const {
  getNewUrlWithoutPrefix,
} = require(`../../utils/pageHelper`);


const ProductDropDown = () => {
  const prefix = useStaticQuery(graphql`
    query {
      site {
        pathPrefix
        }
      }
  `)
  
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
		  
	  changeProduct(prod.toString().toLowerCase());
	  params.delete('product');
	  pro=null;
	  let newUrl = getNewUrlWithoutPrefix(true, prefix.site.pathPrefix);
	  if(newUrl)
		navigate("/" + newUrl);
   }
  
  const toggling = () => 
  {
	  setIsOpen(!isOpen);
  } 
  
  const onOptionClicked = value => () => {
	pro=null;
	
	let opt = productItems.find(
		k => k.name.toString().toLowerCase() === value.toString().toLowerCase()
		);
	changeProduct(opt.product);
    setIsOpen(false);
  };
  
  const getProductName = () => 
  {
	let opt = productItems.find(
		k => k.product.toString().toLowerCase() === product.toString().toLowerCase()
		);
		
	return opt ? opt.name : "Products";
	  
  }

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
						<li className="dropdown-listitem" onClick={onOptionClicked(option.name)}>
							<LocalizedLink className="dropdown-link" to={option.link}>{option.name}</LocalizedLink>
						</li>
              ))}
			</ul>
			)}
      </div>
	  </>
  );
};

export default ProductDropDown;
