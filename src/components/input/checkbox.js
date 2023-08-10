import React from "react";
import { Checkbox } from "primereact/checkbox";
import Label from "./label";

export default function CheckBox(props) {
    return (
            <div className={`${props.additionalClass}`}>
                <Checkbox className={`${props.addClass}`}inputId={props.id} name={props.name} value={props.value} onChange={props.onChange} checked={props.checked} />
                <Label htmlFor={props.inputId} className={`${props.labelClass}`} label={props.value} />
            </div>
    )
}
        