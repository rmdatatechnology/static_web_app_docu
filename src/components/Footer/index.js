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
				<div class="footer-nav"><ul class="footer-navi-ul"><li class="first"><a href="https://www.rmdatagroup.com/impressum/" title="Impressum">Impressum</a><span class="dividor">&#124;</span></li><li><a href="https://www.rmdatagroup.com/datenschutz/" title="Datenschutz">Datenschutz</a><span class="dividor">&#124;</span></li><li><a href="https://www.rmdatagroup.com/rechtliches/" title="Rechtliches">Rechtliches</a><span class="dividor">&#124;</span></li><li><a href="https://www.rmdatagroup.com/systemvoraussetzungen/" title="Systemvoraussetzungen">Systemvoraussetzungen</a><span class="dividor">&#124;</span></li><li><a href="https://portal.rmdatagroup.com/" title="rmDATA Kundenportal" target="_blank">rmDATA Kundenportal</a></li></ul></div>
			</div>
		</div>
		<div class="footer-inner-right">© Copyright 2022 rmDATA Gruppe</div>
    </div>
  );
};

export default Footer;
