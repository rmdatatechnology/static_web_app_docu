import React from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { ReactiveBase, DataSearch, ReactiveList, ResultList } from '@appbaseio/reactivesearch';
import TitlePage from '../components/TitlePage';
import { useLocale } from '../hooks/locale';
import { useProduct } from '../hooks/products';
import useProducts from '../components/useProducts';
import useTranslations from '../components/useTranslations';

const { ResultListWrapper } = ReactiveList;

const {
    getProcuctImage,
    getSidebarItems,
} = require(`../utils/pageHelper`);

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


const SearchContent = () => {


    const {
        search,
    } = useTranslations();

    let searchText = null;
	const { product } = useProduct();
    const productItems = useProducts();
	let opt = productItems.find(
        k => k.name.toString().toLowerCase() === product.toString().toLowerCase()
    );

    return (
  <>
            <div className="pagecontainer">
                <div className="sidebar" id="sidemenu" />
                <div className="content">
                    <section className="main-content">
                        <TitlePage text={opt.fullname + ": " + search} />
                        <ReactiveBase
                            app="rmdata_docu_dev_test"
                            credentials="rmdata_docu_dev_test_readonly:TXKBvUiJwvL2yyE"
                            url="https://portal.rmdatacloud-test.com/elasticsearchendpoint/"><div>
                                <DataSearch
                                    componentId="searchbox"
                                    dataField={['title', 'rawbody', 'slug', 'locale']}
                                    autosuggest={false}
                                    showClear={true}
                                    placeholder="Search"
                                    queryFormat="and"
                                    noInitialQuery={true}
                                    onValueChange={(value) => {
                                        if (value === '') {
                                            searchText = null;
                                        }
                                        else {
                                            searchText = value.value;
                                        }
                                    }}
                                />
                            </div>
                            <ReactiveList
                                componentId="SearchResult"
                                pagination={false}
                                size={50}
                                showResultStats={false}
                                react={{
                                    "and": ["searchbox"]
                                }}
                                defaultQuery={() => {
                                    if (searchText !== null) {
                                        return {
                                        }
                                    }
                                    else {
                                        return {
                                            query: {
                                                match_none: {}
                                            }
                                        }
                                    }
                                }}
                                renderItem={
                                    function (res) {
                                        return (<SearchResultItem res={res} />);
                                    } 
								}
								/>
			</ReactiveBase>
			</section>
		</div>
                    <div className="end"></div>
                </div>
	</>
            )
}

            export default SearchContent
