
import React from "react";
export default function Label(props) {

    return (

        
        <label htmlFor={props.htmlFor} className={props.additionalclass}>
            {props.label}<span className={props.spanclass}>{props.spantext}</span>
        </label>

    )
}
