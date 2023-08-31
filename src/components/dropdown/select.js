import React from "react";
import { Dropdown } from 'primereact/dropdown';

export default function Select(props) {
    const { parentClass, parentStyle, selectProps = {} } = props;
    const { selectClass, value, id, options, onChange, placeholder, style, readOnly, disabled, onBlur } = selectProps;

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <Dropdown className={`${selectClass}`}
                value={value}
                id={id}
                options={options}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
                onBlur={onBlur}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    )
}