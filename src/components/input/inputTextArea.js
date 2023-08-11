import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function TextArea(props) {
    return (
        <div className={`${props.parentClass}`}>
            <InputTextarea name={props.name} className={`${props.textAreaClass}`} value={props.value} onChange={props.onChange} rows={props.row} cols={props.cols} />
        </div>
    )
}
