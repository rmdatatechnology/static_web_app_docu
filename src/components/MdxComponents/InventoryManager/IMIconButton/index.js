import React from "react"
import Icon from '../../Icon';

import "../../../../styles/im-styles.scss";

const IMIconButton = ({name}) => {
    return (
        <div className={"icon-button"} ><Icon name={name}/></div>
    )
}

export default IMIconButton
