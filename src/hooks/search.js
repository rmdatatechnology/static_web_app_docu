import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const SearchContext = createContext('');

const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const useSearchQuery = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useProduct must be used within an ProductProvider');
  }
  return context;
};

export { SearchProvider, useSearchQuery };