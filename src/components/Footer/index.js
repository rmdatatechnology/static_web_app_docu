import React from 'react';
import useTranslations from '../useTranslations';
import SocialLinks from '../SocialLinks';

import * as S from './styled';

const Footer = () => {
  const {
    aboutProject,
    seeMorePWA,
    maintainedBy,
    contributeMessage,
  } = useTranslations();

  return (
    <S.FooterWrapper id="footer">
      <S.FooterContainer>
       
        <p>
          {maintainedBy}{' '}
        </p>
      </S.FooterContainer>
    </S.FooterWrapper>
  );
};

export default Footer;
