import React from 'react';

import "../../styles/styles.scss";

const TitlePage = props => {
  const { text } = props;

  return <h1 className="title-wrapper">{text}</h1>;
};

export default TitlePage;
