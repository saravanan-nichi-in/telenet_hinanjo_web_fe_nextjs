import React from "react";
import { InputText } from "primereact/inputtext";

export default function InputLeftRightGroup(props) {
  return (
    <div className={`p-inputgroup ${props.additionalClass}`}>
      {props.antLeftIcon || props.leftIcon ? (
        <>
          <span className={`p-inputgroup-addon ${props.additionalClasses}`}>
            <i className={`${props.leftIcon} `}>{props.antLeftIcon}</i>
          </span>
          <InputText
            placeholder={props.placeholder}
            value={props.value}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
            type={props.type ? props.type:"text"}
          />
        </>
      ) : (
        <>
          <InputText
            placeholder={props.placeholder}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            type={props.type ? props.type:"text"}
          />
          <span className={`p-inputgroup-addon ${props.additionalClasses}`}>
            <i className={`${props.rightIcon} `}>{props.antdRightIcon}</i>
          </span>
        </>
      )}
    </div>
  );
}
