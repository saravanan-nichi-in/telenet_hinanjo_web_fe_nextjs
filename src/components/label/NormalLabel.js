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
        custom,
        ...restProps
    } = props;

    return (
        <label htmlFor={htmlFor} className={`${labelClass} ${custom || 'custom-label'}`} style={style} id={id} {...restProps}>
            {text}<span className={spanClass}>{spanText}</span>
        </label>
    )
}