import React from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { useLocale } from '../../hooks/locale';
import { useProduct } from '../../hooks/products';
import useProducts from '../useProducts';
import useTranslations from '../useTranslations';

const {
    getProcuctImage,
    getSidebarItems,
} = require(`../../utils/pageHelper`);

const SearchResultItem = ({res}) => {
    const { locale } = useLocale();
    const { product } = useProduct();
    const productItems = useProducts();
  
    const { listImages } = useStaticQuery(
        graphql`
      query {
        listImages: allFile (filter: {ext: {eq: ".png"}, relativeDirectory: {eq: ""}}) {
          
			 nodes {
				name
				publicURL
				absolutePath
				}
            }
          }
    `,
    );
    let items = getSidebarItems(product);
    let opt = productItems.find(
        k => k.name.toString().toLowerCase() === product.toString().toLowerCase()
    );
    const imageToUse = getProcuctImage(listImages, opt.img);

    function getNagigateTo(link) {

        let urlMain = typeof window !== 'undefined' ? window.location.pathname : '';
        let isLocale = urlMain.includes(`/${locale}/`);
        let slug = `${locale}/${link}`;
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

    if (useItem(res, locale, items, res.slug)) {
        return (
            <>
			<div className="searchResContainer" onClick={event => {
                navigate(getNagigateTo(res.slug.split(`.`)[0]))
            }}>
               
                        <div>
                            {imageToUse && (
                                <img
                                    src={imageToUse.publicURL}
                                    alt={res.title}
                                    className="searchResImg"
                                />
                            )}
                        </div>
                        <div>
                            <div><h2>{res.title}</h2></div>
                            <div><h4>{opt.fullname}</h4></div>
                            <div><h6>{res.slug.split(`.`)[0]}</h6></div>
                  </div>
            </div>
			<hr className="customSeperator" />
			</>
        );

    }
    else
        return (<></>);

}

export default SearchResultItem