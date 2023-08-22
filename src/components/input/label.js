import React from "react";

export default function Label(props) {
    const { htmlFor, labelClass, text, spanClass, spanText } = props && props
    return (
        <label htmlFor={htmlFor} className={labelClass}>
            {text}<span className={spanClass}>{spanText}</span>
        </label>
    )
}
