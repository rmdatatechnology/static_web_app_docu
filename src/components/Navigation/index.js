import React from 'react';
import useMenu from '../useMenu';
import ProductDropDown from '../DropDown';
import LocalizedLink from '../LocalizedLink';

import "../../styles/styles.scss";

const Navigation = ({ isActive, handleToggleMenu }) => {
  const menuItems = useMenu();
  
  return (
    <>
      <div className="navigation">
        {menuItems.map((menu, index) => (
          <LocalizedLink className="navigation-link"
            to={menu.link}
            aria-label={menu.name}
            key={`${menu.link}${index}`}
            >
            {menu.name}
          </LocalizedLink>
        ))}
		<ProductDropDown />
      </div>
    </>
  );
};

export default Navigation;
