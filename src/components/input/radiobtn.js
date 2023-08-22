import React from "react";
import { RadioButton } from "primereact/radiobutton";
import Label from "./label";

export default function RadioBtn(props) {
    const { parentClass, radioBtnProps = {} } = props && props
    const { radioClass, inputId, name, value, onChange, checked, disabled, labelClass } = radioBtnProps && radioBtnProps

    return (

        <div className={`${parentClass}`} >
            <RadioButton className={`${radioClass}`}
                inputId={inputId}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />
            <Label htmlFor={inputId}
                className={`${labelClass}`}
                text={value}
            />
        </div>

    );
}