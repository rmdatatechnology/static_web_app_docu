import React from 'react';
import { navigate, withPrefix  } from 'gatsby';
import { useLocale } from '../../hooks/locale';
import { useProduct } from '../../hooks/products';
import useProducts from '../useProducts';
import { useSidebar } from '../../hooks/sidebar';

const {
    getSidebarItems,
} = require(`../../utils/pageHelper`);

const SearchResultItem = ({res}) => {
    const { locale } = useLocale();
    const { product } = useProduct();
    const productItems = useProducts();
	const { setClicked } = useSidebar();
	
	let img = withPrefix("/pages.gif");
	
 
    let items = getSidebarItems(product);
    let opt = productItems.find(
        k => k.name.toString().toLowerCase() === product.toString().toLowerCase()
    );
   
    function getNagigateTo(link) {

        let urlMain = typeof window !== 'undefined' ? window.location.pathname : '';
        let isLocale = urlMain.includes(`/${locale}/`);
        let slug = `/${locale}/${link}`;
        if (isLocale === false || locale === "de")
            slug = `/${link}`;

        let newProd = opt ? ("?product=" + opt.product) : "";

        let newLink = slug + newProd;
        return newLink;
    };

    function checkForValue(items, value) {

        if (!items)
            return false;

        return items.some(function (element) {
            if (element.items)
                return checkForValue(element.items, value);
            else
                return value === element.url;

        });
    }

    function useItem(entry, locale, items, slug) {
		if(!res || !slug)
			return false;
		
        let check = checkForValue(items, slug.split(`.`)[0])
        if (check && entry.locale === locale)
            return true;

        return false;

    }
	
	function onClick() {
		setClicked(null);
		
		return navigate(getNagigateTo(res.slug.split(`.`)[0]));
	}
	
	let url = typeof window !== 'undefined' ? window.location.origin : '';

    if (useItem(res, locale, items, res.slug)) {
        return (
            <>
			<div className="searchResContainer" role='presentation' onClick={event => onClick()}>
            <h3 className="searchheader">
				<span>
					<img src={img} alt={res.title} className="custom-image"/>
                </span>
				<span>   {res.title}</span></h3>
                <span className="searchresulttext">{url + getNagigateTo(res.slug.split(`.`)[0])}</span>
				
            </div>
			<hr className="customSeperator" />
			</>
        );

    }
    else
        return (<></>);

}

export default SearchResultItem