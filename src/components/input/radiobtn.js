import React from "react";
import { RadioButton } from "primereact/radiobutton";
import Label from "./label";

export default function RadioBtn(props) {
    return (

        <div className={`${props.parentClass}`} >
            <RadioButton className={`${props.radioClass}`} inputId={props.inputId} name={props.name} value={props.value} onChange={props.onChange} checked={props.checked} />
            <Label htmlFor={props.inputId} className={`${props.labelClass}`} label={props.value} />
        </div>

    );
}