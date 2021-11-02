import React, {useState} from 'react'
import TitlePage from '../components/TitlePage';
import { useFlexSearch } from 'react-use-flexsearch';
import { useStaticQuery } from 'gatsby'
import { useLocale } from '../hooks/locale';
import { useProduct } from '../hooks/products';
import { Link } from "gatsby";
import { graphql } from 'gatsby'
import "../styles/styles.scss";
const {
  getSidebarItems,
} = require(`../utils/pageHelper`);

const unflattenResults = (results) =>
	results.map(entry => {
        const { locale, title, slug } = entry;
        return { slug, frontmatter: { title }, fields: { locale } };
    });


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
const filterEntries = (entries, query, locale, items) => {
    
	if (!query) {
        return entries;
    }
	
	return entries.filter((entry) => 
	{
		let check = checkForValue(items, entry.slug.split(`.`)[0])
		if(check && entry.fields.locale === locale)
			return true;
		
		return false;
	});
};

const SearchContent  = () => {
  const queryData = useStaticQuery(graphql`
    query {
      localSearchPages {
        index
        store
      }
    }
  `)

  const { locale } = useLocale();
  const { product } = useProduct();
	 
  let urlMain = typeof window !== 'undefined' ? window.location.pathname : '';
  let isLocale = urlMain.includes(`/${locale}/`);
  
  function getSlug(slug) {
		if(isLocale === false && locale === "de")
			return `/${slug}`;
		else
			return `/${locale}/${slug}`;
  }
  
  let items = getSidebarItems(product);
  
  const index = queryData.localSearchPages.index
  const store = queryData.localSearchPages.store

  const [query, setQuery] = useState('')
  const results = useFlexSearch(query, index, store);
  const entries = unflattenResults(results);
  const filteredEntries = filterEntries(entries, query, locale, items);
  
  return (
  <>
      <div className="pagecontainer">
		<div className="sidebar" id="sidemenu" />
		<div className="content">
			<section className="main-content">
			<TitlePage text="Suche" />
			<div>	
				<input
				className="mySearch"
				placeholder="&#x1F50D; Search for.."
				name="query"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				/>
			<h1>Results</h1>
			{filteredEntries.length > 0 ? (
				<ul className="myUL">
				{filteredEntries.map((result) => (
					<Link to={getSlug(result.slug.split(`.`)[0])}> 
					<div className="list border-bottom">
					<span>{result.frontmatter.title}</span>
					<br />
					<small>{result.slug.split(`.`)[0]}</small>
					</div>
					</Link>
				))}
				</ul>
			) : (
				<p>No results!</p>
			)}
			</div>
			</section>
		</div>
		<div className="end"></div>
	</div>
	</>
  )
}

export default SearchContent