import { InputText } from 'primereact/inputtext';   

const InputFloatLabel = (props) => {
    const {
        inputFloatLabelProps = {}
    } = props;
    const {
        inputClass,
        custom,
        type,
        placeholder,
        id,
        style,
        keyfilter,
        value,
        name,
        onChange,
        onBlur,
        ref,
        required,
        readOnly,
        disabled,
        maxLength,
        minLength,
        htmlFor,
        inputId,
        labelClass,
        text,
        spanClass,
        spanText,
        isLoading,
        hasIcon,
        ...restProps
    } = inputFloatLabelProps;

    return (
        <div className='custom-align-label'>
        <div className={`${custom || 'custom_input'} p-float-label ${hasIcon?'p-input-icon-right':""}`}>
        {isLoading &&<i className="pi pi-spin pi-spinner" /> }
            <InputText className={inputClass}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
                keyfilter={keyfilter}
                name={name}
                type={type}
                onBlur={onBlur}
                ref={ref}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                maxLength={maxLength}
                minLength={minLength}
                {...restProps} />
            <label className='custom-align-label' htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
        </div>
        </div>
    );
}

export default InputFloatLabel;