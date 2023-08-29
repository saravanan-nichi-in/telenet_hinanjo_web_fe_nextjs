import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function TextArea(props) {
    const { parentClass, textAreaProps = {} } = props && props
    const { name, textAreaClass, value, id, onChange, rows, cols, readOnly, disabled } = textAreaProps && textAreaProps

    return (
        <div className={`${parentClass}`}>
            <InputTextarea name={name}
                className={`${textAreaClass} `}
                value={value}
                id={id}
                onChange={onChange}
                rows={rows}
                cols={cols}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    )
}