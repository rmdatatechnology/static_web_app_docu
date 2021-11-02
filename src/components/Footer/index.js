import React from 'react';
import useTranslations from '../useTranslations';
import "../../styles/styles.scss";

const Footer = () => {
  const {
    aboutProject,
    seeMorePWA,
    maintainedBy,
    contributeMessage,
  } = useTranslations();

  return (
    <div className="footer-wrapper" id="footer">
      <div className="footer-container">
       
        <p>
          {maintainedBy}{' '}
        </p>
      </div>
    </div>
  );
};

export default Footer;
