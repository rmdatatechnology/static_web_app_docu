import React, { useState } from 'react';
import { ReactiveBase, DataSearch, ReactiveList } from '@appbaseio/reactivesearch';
import TitlePage from '../components/TitlePage';
import { useProduct } from '../hooks/products';
import useProducts from '../components/useProducts';
import useTranslations from '../components/useTranslations';
import SEO from '../components/seo';
import SearchResultItem from '../components/Search';
import { useSearchQuery } from '../hooks/search';

const SearchContent = () => {

	const {
        search,
    } = useTranslations();
	
	
	const { product } = useProduct();
	const { searchQuery, setSearchQuery } = useSearchQuery();
    const productItems = useProducts();
	let opt = productItems.find(
        k => k.name.toString().toLowerCase() === product.toString().toLowerCase()
    );

    return (
  <>
            <div className="pagecontainer">
			<SEO
				title={search}
				description={opt.fullname + ": " + search}
			/>
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
									innerClass={{
										title: 'search-title',
										input: 'search-input'
									}}
									className="search-field"
                                    dataField={['title', 'rawbody', 'slug', 'locale']}
									fuzziness="2"
                                    autosuggest={false}
                                    showClear={true}
                                    placeholder="Search"
                                    queryFormat="or"
                                    noInitialQuery={true}
                                    value={searchQuery}
									onChange={(value, triggerQuery, event) => {
										setSearchQuery(value);
										triggerQuery();
									}}
                                />
                            </div>
                            <ReactiveList
                                componentId="SearchResult"
                                pagination={false}
                                size={50}
                                showResultStats={false}
                                react={{
                                    "or": ["searchbox"]
                                }}
                                defaultQuery={() => {
                                    if (searchQuery !== null) {
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
