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
        ...restProps
    } = inputFloatLabelProps;

    return (
        <div className='custom-align-label'>
        <div className={`${custom || 'custom_input'} p-float-label`}>
            <InputText className={inputClass}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
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