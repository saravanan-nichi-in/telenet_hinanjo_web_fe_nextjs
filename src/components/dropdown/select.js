import React from "react";
import { Dropdown } from 'primereact/dropdown';

export default function Select(props) {
    const { parentClass, selectProps = {} } = props && props
    const { selectClass, value, id, options, onChange, placeholder, style, readOnly, disabled } = selectProps && selectProps

    return (
        <div className={`${parentClass}`}>
            <Dropdown className={`${selectClass}`}
                value={value}
                id={id}
                options={options}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    )
}