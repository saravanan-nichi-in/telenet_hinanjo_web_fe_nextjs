import React from "react";
import { Dropdown } from 'primereact/dropdown';
export default function InputSelect(props) {

    return (
        <div className={`${props.parentClass}`}>
            <Dropdown value={props.value} onChange={props.onChange} options={props.options} optionLabel={props.optionLabel}
                editable placeholder={props.placeholder} className={`${props.inputSelectClass}`} />
        </div>
    )
}
