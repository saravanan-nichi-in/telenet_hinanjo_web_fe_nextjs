import React from "react";

export default function Label(props) {

    return (
        <label htmlFor={props.htmlFor} className={props.labelClass}>
            {props.text}<span className={props.spanClass}>{props.spanText}</span>
        </label>
    )
}
