import { Button } from "primereact/button";

export default function RoundedBtn(props) {
  return (
    <div className={`${props.additionalClass}`}>
        {props.severity ? (
                <Button className={`${props.hoverBg} ${props.width} ${props.height} ${props?.textColor} ${props?.fontsize} ${props.border} ${props.borderColor}  ${props.borderWidth} ${props.radius} ${props.fontWeight ? props.fontWeight : "font-bold"} ${props.px} ${props.py} ${props.mx} ${props.my} ${props.additionalClasses} `} label={props.text} severity={props.severity} iconPos={props.iconPos} icon={props.icon} rounded onClick={props.onClick} />
        ):(
      <Button className={`${props.bg} ${props.hoverBg} ${props.width} ${props.height} ${props?.textColor} ${props?.fontsize} ${props.border} ${props.borderColor}  ${props.borderWidth} ${props.radius} ${props.fontWeight ? props.fontWeight : "font-bold"} ${props.px} ${props.py} ${props.mx} ${props.my} ${props.additionalClasses} `} label={props.text} iconPos={props.iconPos} icon={props.icon} rounded onClick={props.onClick} >
      </Button> )}
      </div>
  );
}
