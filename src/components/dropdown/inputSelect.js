import React from "react";
import { Dropdown } from 'primereact/dropdown';

const InputSelect = (props) => {
    const { parentClass, dropdownProps = {} } = props && props
    const { value, onChange, options, optionLabel, placeholder, inputSelectClass,disabled } = dropdownProps && dropdownProps

    return (
        <div className={`${parentClass}`}>
            <Dropdown value={value}
                onChange={onChange}
                options={options}
                optionLabel={optionLabel}
                editable
                placeholder={placeholder}
                disabled={disabled}
                className={`${inputSelectClass}`}
            />
        </div>
    )
}
export default InputSelect
