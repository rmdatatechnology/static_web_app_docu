import React from 'react';
import useMenu from '../useMenu';
import ProductDropDown from '../DropDown';
import LocalizedLink from '../LocalizedLink';
import Languages from '../Languages';

import "../../styles/styles.scss";

const Navigation = ({ opened }) => {
  const menuItems = useMenu();
  
  return (
    <>
      <div className="navigation" >
	    {menuItems.map((menu, index) => (
		  <LocalizedLink 
		    className={opened === menu.id.toString().toLowerCase() ? 'navigation-link is-active' : 'navigation-link'} 
            to={menu.link}
            aria-label={menu.name}
            key={`${menu.link}${index}`}
            >
            {menu.name}
          </LocalizedLink>
        ))}
		<ProductDropDown className="navigation-link"/>
		<Languages className="navigation-link"/>
      </div>
    </>
  );
};

export default Navigation;
