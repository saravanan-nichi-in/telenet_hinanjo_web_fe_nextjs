import React, { useState } from "react";
import { Checkbox } from "primereact/checkbox";

export default function CheckBox(props) {
    return (
            <div className={`${props.additionalclass}`}>
                <Checkbox className={`${props.addclass}`}inputId={props.id} name={props.name} value={props.value} onChange={props.onChange} checked={props.checked} />
                <label className={`${props.additional}`} htmlFor={props.id} >{props.value}</label>
            </div>
    )
}
        