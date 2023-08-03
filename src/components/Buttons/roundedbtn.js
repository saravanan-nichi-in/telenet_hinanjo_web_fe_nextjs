import { Button } from "primereact/button";

export default function RoundedBtn(props) {
  return (
    <main>
        <Button className={`${props.bg ? props.bg :"bg-primary"}  ${props.hoverBg} ${props.width} ${props.height} ${props?.textColor} ${props?.fontsize} ${props.border} ${props.borderColor}  ${props.borderWidth} ${props.radius} ${props.fontweight ? props.fontweight :"font-bold"} ${props.px} ${props.py} ${props.mx} ${props.my} `}label={props.text}  iconPos={props.iconpos} icon={props.icon} rounded  >
        </Button>
    </main> 
  );
}
