import React, {useState} from 'react'
import TitlePage from '../components/TitlePage';
import SearchItem from '../components/SearchItem';
import { useFlexSearch } from 'react-use-flexsearch';
import { useStaticQuery } from 'gatsby'
import { useLocale } from '../hooks/locale';
import { Link, navigate } from "gatsby";
import "../styles/styles.scss";
import * as S from '../components/Content/styled';

const unflattenResults = (results) =>
	results.map(entry => {
        const { locale, title, body, slug } = entry;
        return { body, slug, frontmatter: { title }, fields: { locale } };
    });
	
const filterEntries = (entries, query, locale) => {
    if (!query) {
        return entries;
    }
	
    return entries.filter((entry) => entry.fields.locale === locale);
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
  let urlMain = typeof window !== 'undefined' ? window.location.pathname : '';
  let isLocale = urlMain.includes(`/${locale}/`);
  
  function getSlug(slug) {
		if(isLocale === false && locale === "de")
			return `/${slug}`;
		else
			return `/${locale}/${slug}`;
  }
  
  const index = queryData.localSearchPages.index
  const store = queryData.localSearchPages.store

  const [query, setQuery] = useState('')
  const results = useFlexSearch(query, index, store);
  const entries = unflattenResults(results);
  const filteredEntries = filterEntries(entries, query, locale);
  
  return (
  <>
      <div className="pagecontainer">
		<div className="sidebar" id="sidemenu" />
		<div className="content">
			<S.Content>
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
					<small>{result.slug}</small>
					</div>
					</Link>
				
				))}
				</ul>
			) : (
				<p>No results!</p>
			)}
			</div>
			</S.Content>
		</div>
		<div className="end"></div>
	</div>
	</>
  )
}

export default SearchContent