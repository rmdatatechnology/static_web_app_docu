import React from "react"
import {IMButton, IMIconButton} from '../../index';
import {useLocale} from '../../../../hooks/locale';

let buttons
try {
    buttons = require('../../../../../documentation/pages/web/buttons.json');
} catch (error) {
    buttons = [];
}
let iconButtons
try {
    iconButtons = require('../../../../../documentation/pages/web/iconButtons.json');
} catch (error) {
    iconButtons = [];
}
const IMPredefinedElement = ({name}) => {
    const { locale } = useLocale();
    if(!name)
        return <IMButton iconName={"alert"} color={"red"}>parameter name required</IMButton>

    const b = buttons.find(x => x.name === name);
    if(b){
        if(!b.lang[locale]){
            return <IMButton iconName={"alert"} color={"red"}>Missing language definition</IMButton>
        }
        return <IMButton iconName={b.icon} color={b.color}>{b.lang[locale]}</IMButton>
    }
    const iB = iconButtons.find(x => x.name === name);
    if(iB){
        return <IMIconButton name={iB.icon}/>
    }

    return <IMButton iconName={"alert"} color={"red"}>unrecognised element</IMButton>
}

export default IMPredefinedElement
