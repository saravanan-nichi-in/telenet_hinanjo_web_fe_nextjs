import React from "react";
import { Dropdown } from 'primereact/dropdown';

export default function SelectFloatLabel(props) {
    const {
        parentClass,
        parentStyle,
        selectFloatLabelProps = {}
    } = props;
    const {
        selectClass,
        custom,
        value,
        name,
        inputId,
        id,
        options,
        optionLabel,
        onChange,
        placeholder,
        style,
        readOnly,
        disabled,
        onBlur,
        text,
        spanClass,
        spanText,
        ...restProps
    } = selectFloatLabelProps;
    const isFloating = value || value === ""; // Check if value is provided
    return (
        <div className="custom-align-label">
        <div className={`p-float-label ${parentClass} ${custom || 'custom-select'}`} style={parentStyle}>
            <Dropdown className={`${selectClass} ${isFloating ? 'p-inputwrapper-filled' : ''} `}
                value={value}
                name={name}
                inputId={inputId}
                id={id}
                options={options}
                optionLabel={optionLabel}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
                onBlur={onBlur}
                readOnly={readOnly}
                disabled={disabled}
                {...restProps}
            />
            <label htmlFor={inputId}>{text}<span className={spanClass}>{spanText}</span></label>
        </div>
        </div>
    )
}