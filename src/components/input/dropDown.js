import React from "react";
import { Dropdown } from 'primereact/dropdown';
export default function InputSelect(props) {

    return (
        <div className={`${props.additionalClasses}`}>
            <Dropdown value={props.value} onChange={props.onChange} options={props.options} optionLabel={props.optionLabel}
                editable placeholder={props.placeholder} className={`${props.additionalClass}`} />
        </div>
    )
}
