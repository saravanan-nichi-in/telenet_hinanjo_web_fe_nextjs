
import React from "react";
export default function Label(props) {

    return (

        
        <label htmlFor={props.htmlFor} className={props.additionalClass}>
            {props.label}<span className={props.spanClass}>{props.spanText}</span>
        </label>

    )
}
