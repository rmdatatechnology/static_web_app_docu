import React from 'react';
import useTranslations from '../useTranslations';
import Navigation from '../Navigation';
import Languages from '../Languages';
import ButtonMenu from '../ButtonMenu';
import Logo from '../Logo';
import LocalizedLink from '../LocalizedLink';

import { useMenu } from '../../hooks/menu';

import "../../styles/styles.scss";

const Header = () => {
  const { home } = useTranslations();
  const { openedMenu, toggleMenu } = useMenu();

  return (
    <div className="header-wrapper" id="headermenu">
      <div className="header-container">
        <LocalizedLink className="logo-link" to="/" title={home} aria-label={home}>
          <Logo />
		  
        </LocalizedLink>
		<LocalizedLink className="title-link" to="/"> rmDATA Documentation</LocalizedLink>
		
        <div className={openedMenu ? 'button-menu is-active' : 'button-menu'}>
          <ButtonMenu handleClick={toggleMenu} isActive={openedMenu} />
        </div>

        <div className={openedMenu ? 'nav-menu is-active' : 'nav-menu'}>
          <Navigation />
        </div>
		
		<div className="nav-languages">
          <Languages />
        </div>
      </div>
    </div>
  );
}

export default Header;
