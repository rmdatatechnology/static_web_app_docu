import geodesigner from '../../documentation/toc/geodesigner.json';
import geomapper from '../../documentation/toc/geomapper.json';
import geodesktop from '../../documentation/toc/geodesktop.json';
import scripting from '../../documentation/toc/scripting.json';
import configuration from '../../documentation/toc/configuration.json';
import inventorymanager from '../../documentation/toc/inventorymanager.json';
import geodiscoverer from '../../documentation/toc/geodiscoverer.json';
import rmgeo from '../../documentation/toc/rmgeo.json';
import tdworx from '../../documentation/toc/tdworx.json';
import smartarea from '../../documentation/toc/smartarea.json';
import smartinfra from '../../documentation/toc/smartinfra.json';
import smartnetworx from '../../documentation/toc/smartnetworx.json';
import geoweb from '../../documentation/toc/geoweb.json';
import rmkatoffice from '../../documentation/toc/rmkatoffice.json';
import rmproject from '../../documentation/toc/rmproject.json';
import mobile from '../../documentation/toc/mobile.json';
import allgemein from '../../documentation/toc/allgemein.json';
import kommassierung from '../../documentation/toc/kommassierung.json';
import geomatik from '../../documentation/toc/geomatik.json';



// Sets variables for light and dark theme
export const getSidebarItems = (product) => {

	 if(product.toString().toLowerCase() === "geodesigner")
	 {
		 return geodesigner;
	 }
	 else if(product.toString().toLowerCase() === "geomapper")
	 {
		 return geomapper;
	 }
	 else if(product.toString().toLowerCase() === "geodesktop")
	 {
		 return geodesktop;
	 }
	  else if(product.toString().toLowerCase() === "scripting")
	 {
		 return scripting;
	 }
	  else if(product.toString().toLowerCase() === "configuration")
	 {
		 return configuration;
	 }
	  else if(product.toString().toLowerCase() === "inventorymanager")
	 {
		 return inventorymanager;
	 }
	  else if(product.toString().toLowerCase() === "geoweb")
	 {
		 return geoweb;
	 }
	  else if(product.toString().toLowerCase() === "smartarea")
	 {
		 return smartarea;
	 }
	  else if(product.toString().toLowerCase() === "smartnetworx")
	 {
		 return smartnetworx;
	 }
	  else if(product.toString().toLowerCase() === "smartinfra")
	 {
		 return smartinfra;
	 }
	 else if(product.toString().toLowerCase() === "geodiscoverer")
	 {
		 return geodiscoverer;
	 }
	 else if(product.toString().toLowerCase() === "rmgeo")
	 {
		 return rmgeo;
	 }
	 else if(product.toString().toLowerCase() === "tdworx")
	 {
		 return tdworx;
	 }
	 else if(product.toString().toLowerCase() === "rmkatoffice")
	 {
		 return rmkatoffice;
	 }
	 else if(product.toString().toLowerCase() === "rmproject")
	 {
		 return rmproject;
	 }
	 else if(product.toString().toLowerCase() === "mobile")
	 {
		 return mobile;
	 }
	 else if(product.toString().toLowerCase() === "allgemein")
	 {
		 return allgemein;
	 }
	  else if(product.toString().toLowerCase() === "kommassierung")
	 {
		 return kommassierung;
	 }
	 else if(product.toString().toLowerCase() === "geomatik")
	 {
		 return geomatik;
	 }
	 else
	 {
		 return geomapper;
	 }
}

export const getNewUrlWithoutPrefix = (withLocale, prefix) => {
	
	  let pathname = typeof window !== 'undefined' ? window.location.pathname : null;
	  
	  if(!pathname)
		  return "";
	  
	  let newUrl = pathname.split("/");

	  if(newUrl[0] === "")
		  newUrl.shift();
	   
	  if(prefix && prefix.toString().toLowerCase().includes(newUrl[0].toLowerCase()))
		   newUrl.shift();

	  if(withLocale === false)
	  {
		let hasLang = newUrl[0];
		if(hasLang === "en" || hasLang === "fr" || hasLang === "it"|| hasLang === "de")
		  newUrl.shift();
	  }
	  
		return newUrl.join("/");
	} 
	
export const getProcuctImage = (listImages, imageName) => {
	 const defaultImg = listImages.nodes.find(img => {
    if(img.name === 'default')
		return img;
		
	return null;
  });
  
  const imageToUse = listImages.nodes.find(img => {
    if(img.name === imageName.toString())
		return img;
		
	return null;
  });
  
  if(imageToUse)
	  return imageToUse;
  else
	  return defaultImg;
}