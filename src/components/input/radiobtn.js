import React from "react";
import { RadioButton } from "primereact/radiobutton";

export default function RadioBtn(props) {
    return (

        <div className="flex align-items-center">
            <RadioButton inputId={props.inputid} name={props.name} value={props.value} onChange={props.onChange} checked={props.checked} />
            <label htmlFor={props.inputid} className="ml-2">{props.value}</label>
        </div>

    );
}