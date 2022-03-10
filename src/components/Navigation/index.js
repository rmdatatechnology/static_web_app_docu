import React from 'react';
import useMenu from '../useMenu';
import ProductDropDown from '../DropDown';
import LocalizedLink from '../LocalizedLink';


import "../../styles/styles.scss";

const Navigation = ({ opened, handleToggleMenu }) => {
  const menuItems = useMenu();
  
  return (
    <>
      <div className="navigation" >
	    {menuItems.map((menu, index) => (
		<span>
          <LocalizedLink 
		    className={opened === menu.id.toString().toLowerCase() ? 'navigation-link is-active' : 'navigation-link'} 
			onClick={(e) => handleToggleMenu(menu.id.toString().toLowerCase())}
            to={menu.link}
            aria-label={menu.name}
            key={`${menu.link}${index}`}
            >
            {menu.name}
          </LocalizedLink>
		  </span>
		 
        ))}
		<span>
		<ProductDropDown />
		</span>
      </div>
    </>
  );
};

export default Navigation;
