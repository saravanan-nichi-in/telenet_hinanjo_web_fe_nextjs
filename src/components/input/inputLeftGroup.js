import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'antd';

export default function InputLeftGroup(props) {
    return (

        <div className={`p-inputgroup ${props.additionalclass}`}>
            < span className={`p-inputgroup-addon ${props.additionalclasses}`}>
                <i className={`${props.icon} `}>{props.ico}</i>
            </span>
            <InputText placeholder={props.placeholder} value={props.value} name={props.name} onChange={props.onChange} onBlur={props.onBlur}/>

        </div>


    )
}
