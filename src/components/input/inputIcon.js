import { InputText } from 'primereact/inputtext';


export default function InputIcon(props) {
  return (
    <span className={`${props.iconpos} ${props.fontsize} ${props.width} ${props.height} ${props.textcolor} ${props.px} ${props.py} ${props.mx} ${props.my} ${props.additionalclass} `}>
      <i className={`${props.icon}`} />
      {props.readOnly ? (
        <InputText readOnly placeholder={props.placeholder} value={props.value} name={props.name} onChange={props.onChange} onBlur={props.onBlur}/>
      ) : (
        <InputText placeholder={props.placeholder} value={props.value} name={props.name} onChange={props.onChange} onBlur={props.onBlur} />
      )}
    </span>

  );
}
