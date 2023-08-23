import React from "react";
import { Checkbox } from "primereact/checkbox";
import NormalLabel from "../label/NormalLabel";


const NormalCheckBox = (props) => {
    const { parentClass, checkBoxProps = {} } = props && props
    const { checkboxClass, id, name, value, onChange, checked, disabled, labelClass } = checkBoxProps && checkBoxProps
    return (
        <div className={`${parentClass}`}>
            <Checkbox className={`${checkboxClass}`}
                inputId={id}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
            />
            <NormalLabel htmlFor={id}
                className={`${labelClass}`}
                text={value}
            />
        </div>
    )
}
export default NormalCheckBox;