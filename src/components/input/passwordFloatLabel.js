import React, { useState } from "react";
import { Password } from 'primereact/password';

export default function PasswordFloatLabel(props) {
    const {
        parentClass,
        passwordFloatLabelProps = {}
    } = props;
    const {
        passwordClass,
        custom,
        type,
        id,
        style,
        value,
        name,
        onChange,
        onBlur,
        htmlFor,
        inputId,
        labelClass,
        text,
        spanClass,
        spanText,
        isLoading,
        hasIcon,
        ...restProps
    } = passwordFloatLabelProps;

    return (
        <div className={`${parentClass} custom-align-label `}>
            <div className={`  ${custom || 'custom_input_password'} p-float-label ${hasIcon ? 'p-input-icon-right' : ""}`}>
            {isLoading && <i className="pi pi-spin pi-spinner" />}
            <Password 
            value={value} 
            name={name}
            style={{width:"100%"}}
            id={id}
            className={passwordClass}
            onChange={onChange} 
            onBlur={onBlur}
            feedback={false} 
            toggleMask 
            {...restProps} />
            <label className='custom-align-label' htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
        </div>
        </div>
    )
}
