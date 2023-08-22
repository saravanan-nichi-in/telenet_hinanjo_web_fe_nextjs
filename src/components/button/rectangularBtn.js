import { Button } from "primereact/button";

export default function RectangularButton(props) {
  const { parentClass, rectangularButtonProps = {} } = props && props;
  const { severity, hoverBg, fontWeight, buttonClass, text, iconPos, icon, onClick, bg, rounded } = rectangularButtonProps && rectangularButtonProps;

  return (
    <div className={`${parentClass}`}>
      {severity ? (
        <Button className={` ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass}`}
          label={text} rounded={rounded} iconPos={iconPos} severity={severity} icon={icon} onClick={onClick}
        />
      ) : (
        <Button className={`${bg} ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass}`}
          label={text} iconPos={iconPos} rounded={rounded} icon={icon} onClick={onClick} >
        </Button>
      )}
    </div>
  );
}
