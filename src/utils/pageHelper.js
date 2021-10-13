import geodesigner from '../../documentation/toc/geodesigner.json';
import geomapper from '../../documentation/toc/geomapper.json';
import geodesktop from '../../documentation/toc/geodesktop.json';
import scripting from '../../documentation/toc/scripting.json';
import configuration from '../../documentation/toc/configuration.json';
import inventorymanager from '../../documentation/toc/inventorymanager.json';

// Sets variables for light and dark theme
export const getSidebarItems = (product) => {
{

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
	 else
	 {
		 return geomapper;
	 }
}
}
