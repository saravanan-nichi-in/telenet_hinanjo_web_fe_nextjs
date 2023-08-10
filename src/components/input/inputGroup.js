import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputGroup(props) {
    return (

        <div className={`p-inputgroup ${props.additionalClass}`}>
            < span className={`p-inputgroup-addon ${props.additionalLeftClass}`}>
                <i className={`${props.leftIcon} `} onClick={props.onclick}>{props.antLeftIcon}</i>
            </span>
            <InputText type={props.type ? props.type:"text"} className={`${props.additionalInputClass}`} value={props.value} name={props.name} placeholder={props.placeholder} onChange={props.onChange} onBlur={props.onBlur} />
            < span className={`p-inputgroup-addon ${props.additionalRightClass}`}>
                <i className={`${props.rightIcon} `} onClick={props.onClk}>{props.antdRightIcon}</i>
            </span> 
        </div>


    )
}
