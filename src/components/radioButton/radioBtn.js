import React from "react";
import { RadioButton } from "primereact/radiobutton";
import { NormalLabel } from "../label";

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
            <NormalLabel htmlFor={inputId}
                className={`${labelClass}`}
                text={value}
            />
        </div>
    );
}