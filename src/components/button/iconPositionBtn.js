import { Button } from "primereact/button";

export default function IconPosBtn(props) {
  return (
    <div className={`${props.additionalClass}`}>
      {props.severity ? (
        <Button className={` ${props.hoverBg} ${props.width} ${props.height} ${props.border} ${props.borderWidth} ${props.borderColor}  ${props.radius} ${props.fontWeight ? props.fontWeight : "font-bold"} ${props?.textColor} ${props.fontsize} ${props.px} ${props.py} ${props.mx} ${props.my} ${props.additionalClasses}`} label={props.text} iconPos={props.iconPos} severity={props.severity} icon={props.icon} onClick={props.onClick} />
    ):(
      <Button className={`${props.bg} ${props.hoverBg} ${props.width} ${props.height} ${props.border} ${props.borderWidth} ${props.borderColor}  ${props.radius} ${props.fontWeight ? props.fontWeight : "font-bold"} ${props?.textColor} ${props.fontsize} ${props.px} ${props.py} ${props.mx} ${props.my} ${props.additionalClasses}`} label={props.text} iconPos={props.iconPos} icon={props.icon} onClick={props.onClick} >
      </Button>
      )}
      </div>
  );
}
