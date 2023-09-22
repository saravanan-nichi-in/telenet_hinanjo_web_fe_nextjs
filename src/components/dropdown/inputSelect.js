import React from "react";
import { Dropdown } from 'primereact/dropdown';

const InputSelect = (props) => {
    const { parentClass, custom, parentStyle, dropdownProps = {} } = props
    const { value, onChange, id, style, options, onBlur, name, optionLabel, readOnly, placeholder, inputSelectClass, disabled, ...restProps } = dropdownProps

    return (
        <div className={`${parentClass}  ${custom || 'custom-select'}`} style={parentStyle}>
            <Dropdown value={value}
                onChange={onChange}
                id={id}
                style={style}
                options={options}
                optionLabel={optionLabel}
                editable
                name={name}
                onBlur={onBlur}
                readOnly={readOnly}
                placeholder={placeholder}
                disabled={disabled}
                className={`${inputSelectClass}`}
                {...restProps}
            />
        </div>
    )
}
export default InputSelect