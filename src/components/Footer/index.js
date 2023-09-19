import React, { useEffect, useRef } from 'react';
import "../../styles/styles.scss";
import { useSidebar } from '../../hooks/sidebar';

const Footer = () => {
	
  const footerRef = useRef();
  const { height, setHeight } = useSidebar();
  
  useEffect(() => {
    if(!height)
		setHeight(footerRef.current.clientHeight);
      
	function handleResize() {
      setHeight(footerRef.current.clientHeight);
	}
	
	window.addEventListener('resize', handleResize);
  });
 
  
  return (
    <div className="footer-wrapper" id="footer" ref={footerRef}>
		  <div className="footer-container" />
			<div className="footer-inner">
			<div class="footer-inner-left">
				<div class="footer-nav">E-Mail <a href="mailto:office@rmdatagroup.com"><strong>office@rmdatagroup.com</strong></a></div>
				<div class="footer-nav"><a href="https://www.rmdatagroup.com/impressum/" title="Impressum">Impressum</a><span class="dividor"> &#124; </span><a href="https://www.rmdatagroup.com/datenschutz/" title="Datenschutz">Datenschutz</a><span class="dividor"> &#124; </span><a href="https://www.rmdatagroup.com/rechtliches/" title="Rechtliches">Rechtliches</a><span class="dividor"> &#124; </span><a href="https://www.rmdatagroup.com/systemvoraussetzungen/" title="Systemvoraussetzungen">Systemvoraussetzungen</a><span class="dividor"> &#124; </span><a href="https://portal.rmdatagroup.com/" title="rmDATA Kundenportal">rmDATA Kundenportal</a></div>
				<div class="footer-infos" id="footer_infos_left">
					<div>
						<p>© Copyright 2022 rmDATA Gruppe</p>
					</div>
				</div>
			</div>
				<div class="footer-inner-right">
					<div class="footer-nav" id="footer_infos_right"><div><p><strong>rmDATA GmbH</strong>, Technologiezentrum Pinkafeld, Industriestraße 6, 7423 Pinkafeld, Österreich, Tel <a href="tel:+43335743333" title="Rufen Sie uns an"><strong>+43 3357 43 333</strong></a><br /><strong>rmDATA GmbH</strong>, Merzbrück 212, 52146 Würselen, Deutschland, Tel <a href="tel:+4924054066917" title="Rufen Sie uns an"><strong>+49 2405 4066917</strong></a><br /><strong>rmDATA AG</strong>, Täfernstrasse 26, 5405 Baden-Dättwil, Schweiz, Tel <a href="tel:+41415112131" title="Rufen Sie uns an"><strong>+41 41 51121 31</strong></a></p></div></div>
				</div>
			</div>
    </div>
  );
};

export default Footer;
