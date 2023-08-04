import { InputText } from 'primereact/inputtext';


export default function InputIcon(props) {
  return (
       <span className={`${props.iconpos} ${props.fontsize} ${props.width} ${props.height} ${props.textcolor} ${props.px} ${props.py} ${props.mx} ${props.my} `}>
    <i className={`${props.icon}`} />
    <InputText placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
</span>

  );
}
