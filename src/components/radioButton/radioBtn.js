import React from "react";
import { RadioButton } from "primereact/radiobutton";
import { NormalLabel } from "../label";

export default function RadioBtn(props) {
    const { parentClass, parentStyle, radioBtnProps = {} } = props;
    const { radioClass, inputId, name, value, style, onChange, checked, disabled, labelClass } = radioBtnProps;

    return (
        <div className={`${parentClass}`} style={parentStyle} >
            <RadioButton className={`${radioClass}`}
                inputId={inputId}
                name={name}
                value={value}
                style={style}
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