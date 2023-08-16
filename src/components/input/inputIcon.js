import { InputText } from 'primereact/inputtext';

export default function InputIcon(props) {
  return (
    <div className={`${props.fontsize} ${props.width} ${props.height} ${props.textColor} ${props.px} ${props.py} ${props.mx} ${props.my} ${props.parentClass}`}>
      <div className={`${props.iconPos}`}>
        <i className={`${props.icon}`} />
        {props.readOnly ? (
          <InputText className={`${props.inputClass} ${props.height ? props.height : 'custom_input'}`}
            readOnly
            placeholder={props.placeholder}
            value={props.value}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        ) : (
          <InputText className={`${props.inputClass} ${props.height ? props.height : 'custom_input'}`}
            placeholder={props.placeholder}
            keyfilter={props.keyfilter}
            value={props.value}
            name={props.name}
            onChange={props.onChange}
            onBlur={props.onBlur}
          />
        )}
      </div>
    </div>
  );
}
