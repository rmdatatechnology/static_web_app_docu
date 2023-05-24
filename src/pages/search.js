import React from 'react';
import { ReactiveBase, DataSearch, ReactiveList } from '@appbaseio/reactivesearch';
import useTranslations from '../components/useTranslations';
import Seo from '../components/seo';
import SearchResultItem from '../components/Search';
import { useSearchQuery } from '../hooks/search';
import useVariables from '../components/useVariables';

const SearchContent = () => {

	const {
        search,
    } = useTranslations();
	
	const {
		elasticsearchurl,
		elasticcredentials,
		elasticindex,
    } = useVariables();
	
	const { searchQuery, setSearchQuery } = useSearchQuery();
	
	const element = (<><span className="search_before">{search}</span></>);

    return (
  <>
            <div className="page">
			<Seo
				title={search}
				description={search}
			/>
                <div className="content">
				<section className="main-content">
				<br/>
				<br/>
                       <ReactiveBase
                            app={elasticindex}
                            credentials={elasticcredentials}
                            url={elasticsearchurl}><div>
                                <DataSearch
                                    componentId="searchbox"
									innerClass={{
										title: 'title-wrapper',
										input: 'search-input',
									}}
									className="search-field"
                                    dataField={['heading', 'rawbody', 'slug', 'locale']}
									fuzziness="2"
                                    autosuggest={false}
                                    showClear={true}
                                    queryFormat="or"
									addonBefore={element}
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
                                    if (searchQuery !== null && searchQuery.trim() !== "" && searchQuery.trim() !== 0) {
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
