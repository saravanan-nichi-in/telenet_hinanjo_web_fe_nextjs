import React from "react";
import { Dropdown } from 'primereact/dropdown';
export default function InputSelect(props) {

    return (
        <div className={`${props.additionalclasses}`}>
            <Dropdown value={props.value} onChange={props.onChange} options={props.options} optionLabel={props.optionlabel}
                editable placeholder={props.placeholder} className={`${props.additionalclass}`} />
        </div>
    )
}
