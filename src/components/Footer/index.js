import React from 'react';
import useTranslations from '../useTranslations';
import "../../styles/styles.scss";

const Footer = () => {
  const {
    maintainedBy,
  } = useTranslations();

  return (
    <div className="footer-wrapper" id="footer">		
		  <div className="footer-container" />
			<div className="footer-inner">
			<div class="footer-inner-left">
				<div class="footer-email">E-Mail <a href="mailto:office@rmdatagroup.com">office@rmdatagroup.com</a></div>
					<div class="footer-nav" id="footer_nav"><ul class="footer-navi-ul"><li><a href="https://www.rmdatagroup.com/impressum/" title="Impressum">Impressum</a><span class="dividor">&#124;</span></li><li><a href="https://www.rmdatagroup.com/datenschutz/" title="Datenschutz">Datenschutz</a><span class="dividor">&#124;</span></li><li><a href="https://www.rmdatagroup.com/rechtliches/" title="Rechtliches">Rechtliches</a><span class="dividor">&#124;</span></li><li><a href="https://www.rmdatagroup.com/systemvoraussetzungen/" title="Systemvoraussetzungen">Systemvoraussetzungen</a><span class="dividor">&#124;</span></li><li><a href="https://portal.rmdatagroup.com/" title="rmDATA Kundenportal" target="_blank">rmDATA Kundenportal</a></li></ul></div>
					<br/>
					<div class="footer-infos" id="footer_infos_left"><div><p>© Copyright 2022 rmDATA Gruppe</p></div></div>
				</div>
				<div class="footer-inner-right">
					<div class="footer-infos" id="footer_infos_right"><div><p class="text-right"><strong>rmDATA GmbH</strong>, Technologiezentrum Pinkafeld, Industriestraße 6, 7423 Pinkafeld, Österreich, Tel <a href="tel:+43335743333" title="Rufen Sie uns an">+43 3357 43 333</a><br /><strong>rmDATA GmbH</strong>, Merzbrück 212, 52146 Würselen, Deutschland, Tel <a href="tel:+4924054066917" title="Rufen Sie uns an">+49 2405 4066917</a><br /><strong>rmDATA AG</strong>, Tägerhardring 8, 5436 Würenlos, Schweiz, Tel <a href="tel:+41415112131" title="Rufen Sie uns an">+41 41 51121 31</a></p></div></div>
				</div>
			</div>
    </div>
  );
};

export default Footer;
