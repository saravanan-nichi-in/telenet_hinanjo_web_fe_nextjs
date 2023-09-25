import React from "react";

export default function NormalLabel(props) {
    const {
        htmlFor,
        labelClass,
        text,
        spanClass,
        spanText,
        style,
        id,
        ...restProps
    } = props;

    return (
        <label htmlFor={htmlFor} className={labelClass} style={style} id={id} {...restProps}>
            {text}<span className={spanClass}>{spanText}</span>
        </label>
    )
}