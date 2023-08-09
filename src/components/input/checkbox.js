import React from "react";
import { Checkbox } from "primereact/checkbox";
import Label from "./label";

export default function CheckBox(props) {
    return (
            <div className={`${props.additionalclass}`}>
                <Checkbox className={`${props.addclass}`}inputId={props.id} name={props.name} value={props.value} onChange={props.onChange} checked={props.checked} />
                <Label htmlFor={props.inputid} className={`${props.labelClass}`} label={props.value} />
            </div>
    )
}
        