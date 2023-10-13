import React from "react";
import { Dropdown } from 'primereact/dropdown';

const InputSelectFloatLabel = (props) => {
    const {
        parentClass,
        custom,
        parentStyle,
        dropdownFloatLabelProps = {}
    } = props;
    const {
        value,
        onChange,
        id,
        inputId,
        style,
        options,
        onBlur,
        name,
        optionLabel,
        readOnly,
        placeholder,
        inputSelectClass,
        disabled,
        text,
        spanClass,
        spanText,
        ...restProps
    } = dropdownFloatLabelProps;

    return (
        <div className="custom-align-label">
            <div className={`p-float-label ${parentClass} ${custom || 'custom-select'}`} style={parentStyle}>
                <Dropdown value={value}
                    onChange={onChange}
                    id={id}
                    inputId={inputId}
                    style={style}
                    options={options}
                    optionLabel={optionLabel}
                    editable={false}
                    name={name}
                    onBlur={onBlur}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${inputSelectClass}`}
                    {...restProps}
                />
                <label htmlFor={inputId}>{text}<span className={spanClass}>{spanText}</span></label>
            </div>
        </div>
    )
}

export default InputSelectFloatLabel;