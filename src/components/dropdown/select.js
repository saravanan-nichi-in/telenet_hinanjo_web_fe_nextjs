import React from "react";
import { Dropdown } from 'primereact/dropdown';
export default function Select(props) {
    const { parentClass, selectProps = {} } = props && props
    const { selectClass, value, options, onChange, placeholder } = selectProps && selectProps

    return (
        <div className={`${parentClass}`}>
            <Dropdown className={`${selectClass}`}
                value={value}
                options={options}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}
