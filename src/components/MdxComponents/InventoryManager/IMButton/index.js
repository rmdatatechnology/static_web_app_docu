import React from "react"
import Icon from '../../Icon';

import "../../../../styles/im-styles.scss";

const IMButton = ({iconName,color,children}) => {
    let icon = <></>
    if(iconName){
        icon = <Icon name={iconName}/>
    }
    let className = "button-default";
    if (color == "green"){
        className += " button-green";
    }
    if (color == "red"){
        className += " button-red";
    }
    return (
        <span className={className} >{icon} {children}</span>
    )
}

export default IMButton
