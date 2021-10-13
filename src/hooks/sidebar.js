import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useProduct } from './products';
const {
  getSidebarItems,
} = require(`../utils/pageHelper`);


const SidebarContext = createContext('');

const SidebarProvider = ({ children }) => {
  
  const [opened, setOpened] = useState({});

  const toggle = url => {
    setOpened({
      ...opened,
      [url]: !opened[url],
    });
  };
  
  return (
    <SidebarContext.Provider value={{ opened, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within an SidebarProvider');
  }
  return context;
};

export { SidebarProvider, useSidebar };