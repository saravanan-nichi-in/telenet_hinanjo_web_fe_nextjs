import { Button } from "primereact/button";

export default function IconBtn(props) {
  return (
    <main>
        <Button className={`${props.bg ? props.bg :"bg-primary"} ${props.hoverBg} ${props.width} ${props.height} ${props?.textColor} ${props?.fontsize} ${props.border}  ${props.borderWidth} ${props.borderColor} ${props.radius} ${props.fontweight ? props.fontweight :"font-bold"} ${props.px} ${props.py} ${props.mx} ${props.my}`}icon={props.icon}  >
        </Button>
    </main>
  );
}
