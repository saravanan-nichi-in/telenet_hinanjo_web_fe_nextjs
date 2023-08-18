import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function TextArea(props) {
    const { parentClass, textAreaProps = {} } = props && props
    const { name, textAreaClass, value, onChange, row, cols } = textAreaProps && textAreaProps
    return (
        <div className={`${parentClass}`}>
            <InputTextarea name={name}
                className={`${textAreaClass} `}
                value={value}
                onChange={onChange}
                rows={row}
                cols={cols}
            />
        </div>
    )
}
