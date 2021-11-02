import React from 'react';
import "../../styles/styles.scss";

export const ButtonMenu = props => {
  let className = props.isActive ? 'btn-menu active' : 'btn-menu';
  return (
    < button 
      onClick={props.handleClick}
      className={className}
    >
      <span className="span-menu"></span>
    </button>
  );
};

export default ButtonMenu;
