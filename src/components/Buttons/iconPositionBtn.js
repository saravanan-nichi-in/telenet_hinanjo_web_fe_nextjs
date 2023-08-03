import { Button } from "primereact/button";

export default function IconPosBtn(props) {
  return (
    <main>
        <Button className={`${props.bg ? props.bg :"bg-primary"} ${props.hoverBg} ${props.width} ${props.height} ${props.border} ${props.borderWidth} ${props.borderColor}  ${props.radius} ${props.fontweight ? props.fontweight :"font-bold"} ${props?.textColor} ${props.fontsize} ${props.px} ${props.py} ${props.mx} ${props.my}`} label={props.text}  iconPos={props.iconpos} icon={props.icon} >
        </Button>
    </main>
  );
}
