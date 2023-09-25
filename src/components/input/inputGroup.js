import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputGroup(props) {
    const {
        custom,
        parentClass,
        parentStyle,
        inputGroupProps = {}
    } = props;
    const {
        leftClass,
        leftStyle,
        leftIcon,
        onLeftClick,
        antdLeftIcon,
        type,
        inputClass,
        value,
        id,
        name,
        style,
        keyfilter,
        placeholder,
        onChange,
        onBlur,
        ref,
        required,
        readOnly,
        disabled,
        rightClass,
        rightStyle,
        rightIcon,
        onRightClick,
        antdRightIcon,
        maxLength,
        minLength,
        ...restProps
    } = inputGroupProps;

    return (
        <div className={`p-inputgroup ${custom || 'custom_input'} ${parentClass} `} style={parentStyle}>
            < span className={`p-inputgroup-addon ${leftClass}`} style={leftStyle} onClick={onLeftClick}>
                <i className={`${leftIcon} `} >{antdLeftIcon}</i>
            </span>
            <InputText type={type || "text"}
                className={`${inputClass}`}
                value={value}
                id={id}
                name={name}
                style={style}
                keyfilter={keyfilter}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                maxLength={maxLength}
                minLength={minLength}
                {...restProps}
            />
            < span className={`p-inputgroup-addon ${rightClass}`} style={rightStyle} onClick={onRightClick}>
                <i className={`${rightIcon} `} >{antdRightIcon}</i>
            </span>
        </div>
    )
}