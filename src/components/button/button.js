import { Button as Btn } from "primereact/button";

export default function Button(props) {
  const { parentClass, parentStyle, buttonProps = {} } = props;
  const { severity, hoverBg, fontWeight, fontSize, buttonClass,
    style, text, iconPos, icon, type, link, dataPrToolTip, onClick, bg, rounded } = buttonProps;

  return (
    <div className={`${parentClass}`} style={parentStyle}>
      <Btn className={`${bg} ${hoverBg} ${fontWeight || "font-bold"} ${buttonClass}  ${fontSize || "custom-button"}`}
        style={style}
        label={text}
        iconPos={iconPos}
        severity={severity}
        rounded={rounded}
        icon={icon}
        type={type}
        link={link}
        data-pr-tooltip={dataPrToolTip}
        onClick={onClick}
      />
    </div>
  );
}