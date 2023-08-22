import { Button } from "primereact/button";

export default function RoundedBtn(props) {
  const { parentClass, roundedBtnProps = {} } = props && props
  const { severity, hoverBg, fontWeight, buttonClass, text, iconPos, icon, onClick, bg } = roundedBtnProps && roundedBtnProps

  return (
    <div className={`${parentClass}`}>
      {severity ? (
        <Button className={` ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass}`}
          label={text} iconPos={iconPos} rounded severity={severity} icon={icon} onClick={onClick}
        />
      ) : (
        <Button className={`${bg} ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass}`}
          label={text} iconPos={iconPos} rounded icon={icon} onClick={onClick} >
        </Button>
      )}
    </div>
  );
}
