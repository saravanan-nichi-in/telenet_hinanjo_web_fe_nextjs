"use client";

export default function TextPlain(props) {
  const disableTextStyle = {
    color: "#C6C3C3",
    fontSize: "17px",
  };
  const normalStyle = {
    color: "#303030",
    fontWeight: "500",
  };
  const requiredColor = {
    color:"#ED2E2E"
  }
  return (
    <main>
      <label
        htmlFor={props.for}
        className={`block mb-1 text-[17px] font-medium ${props.labelClass}`}
        style={{ color: props.labelColor }}
      >
        {props.label}{props.isRequired&&(<span style={requiredColor}> *</span>)}
      </label>
      <input
        type={props.type}
        name={props.name? props.name : props.id}
        id={props.id}
        style={props.disabled ? disableTextStyle : normalStyle}
        className={`${props.padding} ${props.additionalClass}  
                  ${props.border} ${props.borderRound}
                  ${props.focus} ${props.bg} ${props.disabled ? "cursor-not-allowed" : ""}`}
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled ? props.disabled : false}
        onChange={(event) => {
          props.onChange(event);
        }}
      />
    </main>
  );
}
