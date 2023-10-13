import React from "react";
import { InputText } from "primereact/inputtext";

const InputLeftRightGroupFloat = (props) => {
    const {
        parentClass,
        parentStyle,
        inputLrGroupFloatProps = {}
    } = props;
    const {
        antLeftIcon,
        leftIcon,
        leftClass,
        leftStyle,
        inputClass,
        custom,
        placeholder,
        id,
        style,
        value,
        name,
        onChange,
        onBlur,
        type,
        keyfilter,
        ref,
        required,
        disabled,
        readOnly,
        rightClass,
        rightStyle,
        rightIcon,
        antdRightIcon,
        maxLength,
        minLength,
        text,
        spanClass,
        spanText,
        ...restProps
    } = inputLrGroupFloatProps;

    return (
        <div className={`p-inputgroup custom-align-label ${parentClass}`} style={parentStyle}>
            {antLeftIcon || leftIcon ? (
                <>
                    <span className={`p-inputgroup-addon ${leftClass} `} style={leftStyle}>
                        <i className={`${leftIcon} `}>{antLeftIcon}</i>
                    </span>
                    <span className="p-float-label">
                        <InputText
                            className={`${inputClass} ${custom || 'custom_input'}`}
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
                            required={required}
                            {...restProps}
                        />
                        <label htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
                    </span>
                </>
            ) : (
                <>
                    <span className="p-float-label">
                        <InputText
                            className={`${inputClass} ${custom || 'custom_input'}`}
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
                            {...restProps}
                        />
                        <label htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
                    </span>
                    <span className={`p-inputgroup-addon ${rightClass}`} style={rightStyle}>
                        <i className={`${rightIcon} `}>{antdRightIcon}</i>
                    </span>
                </>
            )}
        </div>
    );
}

export default InputLeftRightGroupFloat