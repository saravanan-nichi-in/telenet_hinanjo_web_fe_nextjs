import React from "react";
import { Checkbox } from "primereact/checkbox";
import Label from "../label/";


const CheckBox=(props)=> {
    const{parentClass,checkBoxProps={}}=props && props
    const {checkboxClass,id, name,value,onChange,checked,disabled,labelClass}=checkBoxProps && checkBoxProps
    return (
        <div className={`${parentClass}`}>
            <Checkbox className={`${checkboxClass}`}
                inputId={id}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />
            <Label htmlFor={id}
                className={`${labelClass}`}
                text={value}
            />
        </div>
    )
}
export default CheckBox;