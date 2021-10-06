import React, {useState} from 'react'
import TitlePage from '../components/TitlePage';
import SearchItem from '../components/SearchItem';
import { useFlexSearch } from 'react-use-flexsearch';
import { useStaticQuery } from 'gatsby'
import { useLocale } from '../hooks/locale';
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
			<TitlePage text="Suche" />
			<S.Content>	 
			<label>
				<span>Search query</span>
				<input
				name="query"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				/>
			</label>
			<h2>Results</h2>
			{filteredEntries.length > 0 ? (
				<ul>
				{filteredEntries.map((result) => (
					<SearchItem
						slug={result.slug.split(`.`)[0]}              
						category="Test"
						title={result.frontmatter.title}
						//description={result.body}
					/>
				))}
				</ul>
			) : (
				<p>No results!</p>
			)}
			</S.Content>
		</div>
		<div className="end"></div>
	</div>
	</>
  )
}

export default SearchContent