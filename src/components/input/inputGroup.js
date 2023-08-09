import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputGroup(props) {
    return (

        <div className={`p-inputgroup ${props.additionalclass}`}>
            < span className={`p-inputgroup-addon ${props.additionalLeftClass}`}>
                <i className={`${props.lefticon} `} onClick={props.onclick}>{props.leftico}</i>
            </span>
            <InputText className={`${props.additionalInputClass}`} value={props.value} name={props.name} placeholder={props.placeholder} onChange={props.onChange} onBlur={props.onBlur} />
            < span className={`p-inputgroup-addon ${props.additionalRightClass}`}>
                <i className={`${props.righticon} `} onClick={props.onclk}>{props.rightico}</i>
            </span> 
        </div>


    )
}
