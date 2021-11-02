import React, { useState, useContext } from 'react';
import useMenu from '../useMenu';
import useProducts from '../useProducts';
import useTranslations from '../useTranslations';
import { useStaticQuery, graphql } from 'gatsby';
import ProductDropDown from '../DropDown';
import LocalizedLink from '../LocalizedLink';

import "../../styles/styles.scss";

const Navigation = ({ isActive, handleToggleMenu }) => {
  const menuItems = useMenu();
  
  return (
    <>
      <nav className="navigation">
        {menuItems.map((menu, index) => (
          <LocalizedLink className="navigation-link"
            to={menu.link}
            aria-label={menu.name}
            activeClassName="active"
            key={`${menu.link}${index}`}
            >
            {menu.name}
          </LocalizedLink>
        ))}
		<ProductDropDown />
      </nav>
    </>
  );
};

export default Navigation;
