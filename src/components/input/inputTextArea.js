import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function TextArea(props) {
    return (
        <div className={`${props.additionalClasses}`}>
            <InputTextarea name={props.name} className={`${props.additionalClass}`} value={props.value} onChange={props.onChange} rows={props.row} cols={props.cols} />
        </div>
    )
}
