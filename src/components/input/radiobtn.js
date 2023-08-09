import React from "react";
import { RadioButton } from "primereact/radiobutton";
import Label from "./label";

export default function RadioBtn(props) {
    return (

        <div >
            <RadioButton className={`${props.radioClass}`} inputId={props.inputid} name={props.name} value={props.value} onChange={props.onChange} checked={props.checked} />
            <Label htmlFor={props.inputid} className={`${props.labelClass}`} label={props.value} />
        </div>

    );
}