import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputGroup(props) {
    const { height, parentClass, inputGroupProps = {} } = props && props
    const { leftClass, leftIcon, onLeftClick, antdLeftIcon, type, inputClass, value, name, keyfilter,
        placeholder, onChange, onBlur, rightClass, rightIcon, onRightClick, antdRightIcon } = inputGroupProps && inputGroupProps

    return (
        <div className={`p-inputgroup ${height || 'custom_input'} ${parentClass} `}>
            < span className={`p-inputgroup-addon ${leftClass}`}>
                <i className={`${leftIcon} `} onClick={onLeftClick}>{antdLeftIcon}</i>
            </span>
            <InputText type={type || "text"}
                className={`${inputClass}`}
                value={value}
                name={name}
                keyfilter={keyfilter}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
            />
            < span className={`p-inputgroup-addon ${rightClass}`}>
                <i className={`${rightIcon} `} onClick={onRightClick}>{antdRightIcon}</i>
            </span>
        </div>
    )
}
