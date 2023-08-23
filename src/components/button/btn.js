import { Button } from "primereact/button";

export default function Btn(props) {
  const { parentClass, btnProps = {} } = props && props;
  const { severity, hoverBg, fontWeight,fontSize, buttonClass, text, iconPos, icon, onClick, bg, rounded } = btnProps && btnProps;

  return (
    <div className={`${parentClass}`}>
      {severity ? (
        <Button className={` ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass} ${fontSize || "custom-button"}`}
          label={text} rounded={rounded} iconPos={iconPos} severity={severity} icon={icon} onClick={onClick}
        />
      ) : (
        <Button className={`${bg} ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass}  ${fontSize || "custom-button"}`}
          label={text} iconPos={iconPos} rounded={rounded} icon={icon} onClick={onClick} >
        </Button>
      )}
    </div>
  );
}
