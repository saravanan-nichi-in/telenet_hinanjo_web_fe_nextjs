import { InputText } from 'primereact/inputtext';

const InputIcon = (props) => {

  const { parentClass, inputIconProps = {} } = props && props
  const { iconPos, icon, inputClass, height, placeholder, keyfilter, value, name, onChange, onBlur, readOnly } = inputIconProps && inputIconProps
  return (
    <div className={`${parentClass}`}>
      <div className={`${iconPos}`}>
        <i className={`${icon}`} />

        <InputText className={`${inputClass} ${height || 'custom_input'}`}
          placeholder={placeholder}
          keyfilter={keyfilter}
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
        />

      </div>
    </div>
  );
}
export default InputIcon;