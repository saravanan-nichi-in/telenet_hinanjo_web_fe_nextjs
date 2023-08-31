import React from "react";

export default function NormalLabel(props) {
    const { htmlFor, labelClass, text, spanClass, spanText, style, id } = props;

    return (
        <label htmlFor={htmlFor} className={labelClass} style={style} id={id}>
            {text}<span className={spanClass}>{spanText}</span>
        </label>
    )
}