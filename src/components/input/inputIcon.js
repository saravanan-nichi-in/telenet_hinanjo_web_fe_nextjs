import { InputText } from 'primereact/inputtext';

const InputIcon = (props) => {
  const { parentClass, parentStyle, inputIconProps = {} } = props;
  const { iconPos, icon, inputClass, height, placeholder, id, style, keyfilter, value, name, onChange, onBlur, readOnly, disabled } = inputIconProps;

  return (
    <div className={`${parentClass}`} style={parentStyle}>
      <div className={`${iconPos}`}>
        <i className={`${icon}`} />
        <InputText className={`${inputClass} ${height || 'custom_input'}`}
          placeholder={placeholder}
          id={id}
          style={style}
          keyfilter={keyfilter}
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
export default InputIcon;