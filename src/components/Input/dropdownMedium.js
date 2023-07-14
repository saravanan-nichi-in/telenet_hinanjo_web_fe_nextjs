import React, { useRef } from 'react';
import DropDownIcon from '../Icons/dropdownIcon';

export default function DropdownMedium(props) {
  const selectRef = useRef(null);
  const handleChange = (event) => {
    event.stopPropagation();
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    const selectedValue = selectedOption.value;
    if (props.onChange) {
      props.onChange(selectedValue,event);
    }
  };
  const handleIconClick = (event) => {
    event.stopPropagation()
    selectRef.current.click();
  };
  const requiredColor = {
    color:"#ED2E2E"
  }

  return (
    <main>
      <label
        htmlFor="countries"
        className={`block mb-1 text-sm font-medium ${props.labelClass}`}
        style={{ color: props.labelColor }}
      >
        {props.label}{props.isRequired&&(<span style={requiredColor}> *</span>)}
      </label>
      <div className="select-container">
        <div className="custom-icon" onClick={handleIconClick} style={{top:props.dropIcon}}>
          {props?.dropDownIcon ? props.dropDownIcon() : <DropDownIcon />}
        </div>
        <select
          id={props.id}
          className={`${props.additionalClass} ${props.padding} ${props.text}
            ${props.border} ${props.borderRound} ${props.additionalClass}
            ${props.focus} ${props.bg}`}
          ref={selectRef}
          onChange={handleChange}
          value={props?.value}
        >
          {!props.defaultSelectNoOption && <option disabled value={''}>
            {'--選択する--'}
          </option>}
          {props.options.map((dropDownOption, index) => (
            <option className='bg-white text-black rounded' id={`id-${index}`} key={dropDownOption.value} value={dropDownOption.value}>
              {dropDownOption[props.optionLabel]}
            </option>
          ))}
        </select>
      </div>
    </main>
  );
}
