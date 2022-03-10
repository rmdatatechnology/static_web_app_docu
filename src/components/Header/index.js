import React from 'react';
import useTranslations from '../useTranslations';
import Navigation from '../Navigation';
import Languages from '../Languages';
import Logo from '../Logo';
import LocalizedLink from '../LocalizedLink';

import { useMenu } from '../../hooks/menu';

import "../../styles/styles.scss";

const Header = () => {
    const { home } = useTranslations();
    const { openedMenu, toggleMenu } = useMenu();

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

                <div className='button-menu'>
                    <ButtonMenu handleClick={toggleMenu} isActive={openedMenu} />
                </div>

                <div className='nav-menu'>
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
