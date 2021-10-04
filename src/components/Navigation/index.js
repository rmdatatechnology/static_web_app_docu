import React, { useState, useContext } from 'react';
import useMenu from '../useMenu';
import useProducts from '../useProducts';
import useTranslations from '../useTranslations';
import { useStaticQuery, graphql } from 'gatsby';
import ProductDropDown from '../DropDown';

import * as S from './styled';

const Navigation = ({ isActive, handleToggleMenu }) => {
  const menuItems = useMenu();
  
  return (
    <>
      <S.Navigation>
        {menuItems.map((menu, index) => (
          <S.NavigationLink
            to={menu.link}
            aria-label={menu.name}
            activeClassName="active"
            key={`${menu.link}${index}`}
            >
            {menu.name}
          </S.NavigationLink>
        ))}
		<ProductDropDown />
      </S.Navigation>
    </>
  );
};

export default Navigation;
