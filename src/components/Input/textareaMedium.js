"use client";

export default function TextareaMedium(props) {
  const disableTextStyle = {
    color: "#C6C3C3",
    fontSize: "17px",
    resize: props.resize ? props.resize : "none"
  };
  const normalStyle = {
    color: "#303030",
    fontWeight: "500",
    resize: props.resize ? props.resize : "none"
  };
  const requiredColor = {
    color:"#ED2E2E"
  }
  return (
    <main>
      <label
        htmlFor={props.for}
        className={`block ${props.labelClass}`}
        style={{ color: props.labelColor }}
      >
       {props.label}{props.isRequired&&(<span style={requiredColor}> *</span>)}
      </label>
      <textarea
        id={props.id}
        name={props.name? props.name : props.id}
        rows="2"
        style={props.disabled ? disableTextStyle : normalStyle}
        className={`
                block ${props.padding} w-full 
                ${props.text} 
                ${props.bg} rounded-lg 
                ${props.border} 
                ${props.focus}  
                ${props.additionalClass}  
              `}
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled ? props.disabled : false}
        onChange={(event) => {
          props.onChange(event);
        }}
      ></textarea>
    </main>
  );
}
