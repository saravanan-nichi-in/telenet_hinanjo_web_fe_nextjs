import { InputText } from 'primereact/inputtext';

const InputIcon = (props) => {
  const { parentClass, parentStyle, inputIconProps = {} } = props;
  const { iconPos, icon, inputClass, height, type, antdIcon, placeholder, id, style, keyfilter, value, name, onChange, onBlur, ref, required, readOnly, disabled, maxLength, minLength } = inputIconProps;

  return (
    <div className={`${parentClass}`} style={parentStyle}>
      <div className={`${iconPos}`}>
        <i className={`${icon}`} >{antdIcon}</i>
        <InputText className={`${inputClass} ${height || 'custom_input'}`}
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
        />
      </div>
    </div>
  );
}
export default InputIcon;