import { Button as PrimeReactButton } from "primereact/button";

export default function Button(props) {
  const {
    parentClass,
    parentStyle,
    buttonProps = {}
  } = props;
  const {
    severity,
    hoverBg,
    custom,
    fontWeight,
    fontSize,
    buttonClass,
    style,
    text,
    iconPos,
    icon,
    type,
    link,
    dataPrToolTip,
    onClick,
    disabled,
    bg,
    rounded,
    ...restProps
  } = buttonProps;

  return (
    <div className={`${parentClass}`} style={parentStyle}>
      <PrimeReactButton
        className={`${bg} ${hoverBg} ${custom || 'custom-button'}  ${buttonClass} font-medium`}
        style={style}
        label={text}
        iconPos={iconPos}
        severity={severity}
        rounded={rounded}
        icon={icon}
        type={type}
        link={link}
        disabled={disabled}
        data-pr-tooltip={dataPrToolTip}
        onClick={onClick}
        {...restProps}
      />
    </div>
  );
}