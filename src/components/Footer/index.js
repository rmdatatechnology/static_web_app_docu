import React from 'react';
import useTranslations from '../useTranslations';
import "../../styles/styles.scss";

const Footer = () => {
  const {
    maintainedBy,
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
