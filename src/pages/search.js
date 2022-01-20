import React from 'react';
import { navigate } from "gatsby";
import { ReactiveBase, DataSearch, ReactiveList, ResultList } from '@appbaseio/reactivesearch';
import TitlePage from '../components/TitlePage';
import { useLocale } from '../hooks/locale';
import { useProduct } from '../hooks/products';
import useProducts from '../components/useProducts';

const {
  getSidebarItems,
} = require(`../utils/pageHelper`);


const SearchContent  = () => {
	
  const { locale } = useLocale();
  const { product } = useProduct();
  const productItems = useProducts();
  
  let searchText =  null;
  
  const { ResultListWrapper } = ReactiveList;
  
  let items = getSidebarItems(product);

  function getNagigateTo(link){
		
		let urlMain = typeof window !== 'undefined' ? window.location.pathname : '';
		let isLocale = urlMain.includes(`/${locale}/`);
		let slug =  `${locale}/${link}`;
		if(isLocale === false || locale === "de")
			slug = `/${link}`;
		
		let opt = productItems.find(
		k => k.name.toString().toLowerCase() === product.toString().toLowerCase()
		);
		
		let newProd = opt ? ("?product=" + opt.product) : "";
		
		let newLink = slug + newProd ;
		return newLink;
	};
	
  function checkForValue(items, value) {
    
	if(!items)
		return false;

	return items.some(function(element) 
	{ 
		if(element.items)
			return checkForValue(element.items, value);
		else
			return value === element.url;
		
	});
}

const filterEntries = (entries, locale, items) => {
	return entries.filter((entry) => 
	{
		let check = checkForValue(items, entry.slug.split(`.`)[0])
		if(check && entry.locale === locale)
			return true;
		
		return false;
	});
};

  return (
  <>
      <div className="pagecontainer">
		<div className="sidebar" id="sidemenu" />
		<div className="content">
			<section className="main-content">
			<TitlePage text="Suche" />
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
							if(value === ''){
							searchText = null;
							}
						else{
							searchText = value.value;
						}
						}}
					/>
				</div>
				<ReactiveList
					componentId="SearchResult"
					pagination={false}
					size={50}
					showResultStats ={false}
					react={{
					"and": ["searchbox"]
					}}
					defaultQuery={()=> {
						if(searchText !== null){
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
					render={({ data }) => (
								<ReactiveList.ResultListWrapper>
							{filterEntries(data, locale, items).map(item => (
							<div onClick={ event => {
								navigate(getNagigateTo(item.slug.split(`.`)[0]))
							}}>
								<ResultList key={item._id}>
									<ResultList.Content>
										<ResultList.Title>
											<div
												dangerouslySetInnerHTML={{
													__html: item.title,
												}}
											/>
										</ResultList.Title>
										<ResultList.Description>
											<div>
												<span>
													Slug: {getNagigateTo(item.slug.split(`.`)[0])}
												</span>
											</div>
										</ResultList.Description>
									</ResultList.Content>
								</ResultList>
								</div>
							))}
						</ReactiveList.ResultListWrapper>
					)}
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
