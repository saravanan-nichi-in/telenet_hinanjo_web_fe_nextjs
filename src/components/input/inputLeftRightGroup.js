import React from "react";
import { InputText } from "primereact/inputtext";

const InputLeftRightGroup = (props) => {
  const { parentClass, inputLrGroupProps = {} } = props && props
  const { antLeftIcon, leftIcon, leftClass, inputClass, height,
    placeholder, value, name, onChange, onBlur, type,
    keyfilter, rightClass, rightIcon, antdRightIcon,disabled } = inputLrGroupProps && inputLrGroupProps

  return (
    <div className={`p-inputgroup ${parentClass}`}>
      {antLeftIcon || leftIcon ? (
        <>
          <span className={`p-inputgroup-addon ${leftClass} `}>
            <i className={`${leftIcon} `}>{antLeftIcon}</i>
          </span>
          <InputText
            className={`${inputClass} ${height || 'custom_input'}`}
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            type={type || "text"}
            keyfilter={keyfilter}
            disabled={disabled}
          />
        </>
      ) : (
        <>
          <InputText
            className={`${inputClass} ${height || 'custom_input'}`}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            type={type || "text"}
            keyfilter={keyfilter}
          />
          <span className={`p-inputgroup-addon ${rightClass}`}>
            <i className={`${rightIcon} `}>{antdRightIcon}</i>
          </span>
        </>
      )}
    </div>
  );
}
export default InputLeftRightGroup