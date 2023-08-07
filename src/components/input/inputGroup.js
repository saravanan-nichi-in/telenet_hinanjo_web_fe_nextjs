import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputGroup(props) {
    return (

        <div className={`p-inputgroup ${props.additionalclass}`}>
            < span className={`p-inputgroup-addon ${props.additionalclasses}`}>
                <i className={`${props.lefticon} `} onClick={props.onclick}></i>
            </span>
            <InputText value={props.value} name={props.name} placeholder={props.placeholder} onChange={props.onChange} onBlur={props.onBlur} />
            < span className={`p-inputgroup-addon ${props.additionalclasse}`}>
                <i className={`${props.righticon} `} onClick={props.onclk}></i>
            </span>
        </div>


    )
}
