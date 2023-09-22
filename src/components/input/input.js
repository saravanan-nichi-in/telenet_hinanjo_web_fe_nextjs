import { InputText } from 'primereact/inputtext';

const Input = (props) => {
    const { parentClass, parentStyle, inputProps = {} } = props;
    const { inputClass, custom, type, placeholder, id, style, keyfilter, value,
        name, onChange, onBlur, ref, required, readOnly, disabled, maxLength, minLength, ...restProps } = inputProps;

    return (
        <div className={`${parentClass || ''}  `} style={parentStyle}>
            <InputText className={`${inputClass} ${custom || 'custom_input'}`}
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
        </div>
    );
}
export default Input;