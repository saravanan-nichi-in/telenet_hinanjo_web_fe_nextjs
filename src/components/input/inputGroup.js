import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputGroup(props) {
    return (

        <div className={`p-inputgroup ${props.parentClass}`}>
            < span className={`p-inputgroup-addon ${props.leftClass}`}>
                <i className={`${props.leftIcon} `} onClick={props.onLeftClick}>{props.antLeftIcon}</i>
            </span>
            <InputText type={props.type ? props.type:"text"} className={`${props.inputClass}`} value={props.value} name={props.name} keyfilter={props.keyfilter} placeholder={props.placeholder} onChange={props.onChange} onBlur={props.onBlur} />
            < span className={`p-inputgroup-addon ${props.rightClass}`}>
                <i className={`${props.rightIcon} `} onClick={props.onRightClick}>{props.antdRightIcon}</i>
            </span> 
        </div>


    )
}
