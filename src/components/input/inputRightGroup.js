import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputRightGroup(props) {
    return (

        <div className={`p-inputgroup ${props.additionalclass}`}>

            <InputText placeholder={props.placeholder} name={props.name} value={props.value} onChange={props.onChange} onBlur={props.onBlur}/>
            < span className={`p-inputgroup-addon ${props.additionalclasses}`}>
                <i className={`${props.icon} `}>{props.ico}</i>
            </span>
        </div>


    )
}
