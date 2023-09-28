import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function TextArea(props) {
    const {
        parentClass,
        parentStyle,
        textAreaProps = {}
    } = props;
    const {
        name,
        textAreaClass,
        custom,
        value,
        id,
        style,
        onChange,
        rows,
        cols,
        readOnly,
        disabled,
        ...restProps
    } = textAreaProps;

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <InputTextarea name={name}
                className={`${textAreaClass} ${custom || 'custom-textArea'}`}
                value={value}
                id={id}
                style={style}
                onChange={onChange}
                rows={rows}
                cols={cols}
                readOnly={readOnly}
                disabled={disabled}
                {...restProps}
            />
        </div>
    )
}