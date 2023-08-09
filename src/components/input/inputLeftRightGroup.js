import React from 'react';
import { InputText } from 'primereact/inputtext';

export default function InputLeftRightGroup(props) {
    return (

        <div className={`p-inputgroup ${props.additionalclass}`}>
            {props.leftico || props.lefticon ?(<>
            < span className={`p-inputgroup-addon ${props.additionalclasses}`}>
                <i className={`${props.lefticon} `}>{props.leftico}</i>
            </span>
            <InputText placeholder={props.placeholder} value={props.value} name={props.name} onChange={props.onChange} onBlur={props.onBlur}/>
                </>
            ):(
                <>
                <InputText placeholder={props.placeholder} name={props.name} value={props.value} onChange={props.onChange} onBlur={props.onBlur}/>
                < span className={`p-inputgroup-addon ${props.additionalclasses}`}>
                    <i className={`${props.righticon} `}>{props.rightico}</i>
                </span>
                </>
            )}
        </div>


    )
}
