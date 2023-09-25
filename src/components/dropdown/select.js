import React from "react";
import { Dropdown } from 'primereact/dropdown';

export default function Select(props) {
    const {
        parentClass,
        parentStyle,
        selectProps = {}
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
        ...restProps
    } = selectProps;

    return (
        <div className={`${parentClass}  ${custom || 'custom-select'} `} style={parentStyle}>
            <Dropdown className={`${selectClass}  `}
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
        </div>
    )
}