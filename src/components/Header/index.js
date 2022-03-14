import React from 'react';
import useTranslations from '../useTranslations';
import Navigation from '../Navigation';
import Logo from '../Logo';
import LocalizedLink from '../LocalizedLink';
import { useStaticQuery, graphql } from "gatsby";

import { useMenu } from '../../hooks/menu';

import "../../styles/styles.scss";

const Header = () => {
    const { home } = useTranslations();
    const { openedMenu, toggleMenu } = useMenu();
	
	const prefix = useStaticQuery(graphql`
    query {
      site {
        pathPrefix
        }
      }
  `)
  

  const getActiveNav = (usedprefix) => {
	
	  let pathname = typeof window !== 'undefined' ? window.location.pathname : null;
	  
	  if(!pathname)
		  return "";
	  
	  let newUrl = pathname.split("/");

	  if(newUrl[0] === "")
		  newUrl.shift();
	   
	  if(prefix && prefix.toString().toLowerCase().includes(newUrl[0].toLowerCase()))
		   newUrl.shift();

	  let hasLang = newUrl[0];
	  if(hasLang === "en" || hasLang === "fr" || hasLang === "it"|| hasLang === "de")
		newUrl.shift();
	  
		return newUrl[0];
	} 
  
	let activeNav = getActiveNav(prefix);
	if(!activeNav || activeNav === "")
		toggleMenu("home");
	else if(activeNav === "search")
	  toggleMenu("search");
	else
		toggleMenu("products");

    return (
        <div className="header-wrapper" id="headermenu">
            <div className="contact-info">
                <div className="contact-inner">
                    <div className="contact-inner-left">
                        <Logo imageName="mailicon" sizeOverride="20px" classOverride="flag-mail" /><a href="mailto:office@rmdatagroup.com" className="contact-info-link" title="E-Mail senden"><i className="fa-envelope fa-lg far"></i>&nbsp;<span className="mail">office@rmdatagroup.com</span></a>
                    </div>
                    <div className="contact-inner-right">
                        <Logo imageName="flag-at" sizeOverride="18px" classOverride="flag" /><a className="contact-info-link" href="tel:+43335743333">+43 3357 43 333</a>
                        <Logo imageName="flag-de" sizeOverride="18px" classOverride="flag" /><a className="contact-info-link" href="tel:+4924054066917">+49 2405 4066 917</a>
                        <Logo imageName="flag-ch" sizeOverride="18px" classOverride="flag" /><a className="contact-info-link" href="tel:+41415112131">+41 41 51121 31</a>
                    </div>
                </div>
            </div>
            <div className="header-container">
                <LocalizedLink className="logo-link" to="/" title={home} aria-label={home}>
                    <Logo />

                </LocalizedLink>

                <div className='nav-menu'>
                    <Navigation opened={openedMenu}/>
                </div>
            </div>
        </div>
    );
}

export default Header;
