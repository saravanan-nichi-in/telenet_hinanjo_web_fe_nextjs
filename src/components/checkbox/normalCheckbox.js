import React from "react";
import { Checkbox } from "primereact/checkbox";
import NormalLabel from "../label/NormalLabel";

const NormalCheckBox = (props) => {
    const { parentClass, parentStyle, checkBoxProps = {} } = props;
    const { checkboxClass, id, name, value, onChange, checked, disabled, style, labelClass } = checkBoxProps;

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <Checkbox className={`${checkboxClass}`}
                inputId={id}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
                style={style}
            />
            <NormalLabel htmlFor={id}
                className={`${labelClass}`}
                text={value}
            />
        </div>
    )
}
export default NormalCheckBox;