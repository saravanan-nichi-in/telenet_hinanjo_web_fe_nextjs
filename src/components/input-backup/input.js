import { InputText } from 'primereact/inputtext';
import { AiOutlineAudio } from 'react-icons/ai';

const Input = (props) => {
    const {
        parentClass,
        parentStyle,
        inputProps = {}
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
        text,
        spanClass,
        spanText,
        spanStyle,
        labelStyle,
        onChange,
        onBlur,
        ref,
        required,
        readOnly,
        disabled,
        maxLength,
        minLength,
        subLabelText,
        subLabelStyle,
        inputIcon,
        ...restProps
    } = inputProps;

    return (
        <div className={`${parentClass || ''} ${custom || 'custom_input'} `} style={parentStyle}>
            <label className='custom-align-label pb-2' htmlFor={id} style={labelStyle}>{text}<span className={spanClass} style={spanStyle}>{spanText}</span></label>
            <label className='custom-align-label pb-2' style={subLabelStyle}>{subLabelText}</label>

            <InputText className={`${inputClass} `}
                placeholder={placeholder}
                id={id}
                style={style}
                keyfilter={keyfilter}
                value={value}
                name={name}
                type={type}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                maxLength={maxLength}
                minLength={minLength}
                {...restProps}
            />
            {inputIcon && <span className="p-input-icon-right pb-3">
                <AiOutlineAudio />
            </span>}

        </div>
    );
}

export default Input;