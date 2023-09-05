import React from "react";
import { InputText } from "primereact/inputtext";

const InputLeftRightGroup = (props) => {
  const { parentClass, parentStyle, inputLrGroupProps = {} } = props;
  const { antLeftIcon, leftIcon, leftClass, leftStyle, inputClass, height,
    placeholder, id, style, value, name, onChange, onBlur, type,
    keyfilter, ref, required, disabled, readOnly, rightClass, rightStyle, rightIcon, antdRightIcon, maxLength, minLength } = inputLrGroupProps;

  return (
    <div className={`p-inputgroup ${parentClass}`} style={parentStyle}>
      {antLeftIcon || leftIcon ? (
        <>
          <span className={`p-inputgroup-addon ${leftClass} `} style={leftStyle}>
            <i className={`${leftIcon} `}>{antLeftIcon}</i>
          </span>
          <InputText
            className={`${inputClass} ${height || 'custom_input'}`}
            placeholder={placeholder}
            id={id}
            style={style}
            value={value}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            type={type || "text"}
            keyfilter={keyfilter}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            minLength={minLength}
          />
        </>
      ) : (
        <>
          <InputText
            className={`${inputClass} ${height || 'custom_input'}`}
            placeholder={placeholder}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            type={type || "text"}
            keyfilter={keyfilter}
            ref={ref}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            minLength={minLength}
          />
          <span className={`p-inputgroup-addon ${rightClass}`} style={rightStyle}>
            <i className={`${rightIcon} `}>{antdRightIcon}</i>
          </span>
        </>
      )}
    </div>
  );
}
export default InputLeftRightGroup