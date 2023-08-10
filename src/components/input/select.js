import React from "react";
import { Dropdown } from 'primereact/dropdown';
export default function Select(props) {

    return (
        <div className={`${props.additionalClasses}`}>
            <Dropdown className={`${props.additionalClass}`} value={props.value} options={props.options} onChange={props.onChange} placeholder={props.placeholder} />
        </div>
    )
}
