"use client";
import Switch from "react-switch";

export default function ToggleBoxMedium(props) {
  return (
    <>
      <label className="flex flex-1 items-center justify-between cursor-pointer pr-2 ">
        <div 
          className={`text-ellipsis overflow-hidden ${props.labelClass}`} 
          style={{ color: props.labelColor }}
        >
          {props.label}
        </div>
        <Switch
            checked={props.toggle}
            onChange={()=>{props.setToggle(!props.toggle)}}
            onColor={props.onColor}
            onHandleColor={props.onHandleColor}
            handleDiameter={props.handleDiameter}
            uncheckedIcon={props.uncheckedIcon}
            checkedIcon={props.checkedIcon}
            boxShadow={props.boxShadow}
            activeBoxShadow={props.activeBoxShadow}
            height={props.height}
            width={props.width}
            className={`react-switch ${props.additionalClass}`}
            id={props.id}
        />
      </label>
    </>
  );
}
