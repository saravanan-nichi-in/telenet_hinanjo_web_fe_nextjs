import React from "react";

export default function NormalLabel(props) {
    const { htmlFor, labelClass, text, spanClass, spanText,style } = props && props

    return (
        <label htmlFor={htmlFor} className={labelClass} style={style}>
            {text}<span className={spanClass}>{spanText}</span>
        </label>
    )
}
