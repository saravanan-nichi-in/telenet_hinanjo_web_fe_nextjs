import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export default function TextArea(props) {
    return (
        <div>
            <InputTextarea name={props.name} className={`${props.additionalclass}`} value={props.value} onChange={props.onChange} rows={props.row} cols={props.cols} />
        </div>
    )
}
