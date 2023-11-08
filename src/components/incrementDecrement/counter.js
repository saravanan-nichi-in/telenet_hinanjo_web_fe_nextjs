import React, { useState } from 'react';

import InputGroup from '../input/inputGroup';

export default function Counter(props) {
    const {
        name,
        readOnly,
        disabled,
        parentClass,
        inputClass,
        style,
        min,
        max
    } = props;
    const [value, setValue] = useState(props.value);

    const handleIncrement = () => {
        const newValue =parseInt(value)? parseInt(value) + 1:1;
        setValue(newValue);
        props.onValueChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = parseInt(value)?parseInt(value) - 1:0;
        setValue(newValue);
        props.onValueChange(newValue);
    };

    return (
        <InputGroup
         inputGroupProps={{
            inputClass: inputClass,
            id: props.id,
            value: value,
            name: name,
            style: style,
            custom:"custom-input font-bold",
            onChange: (e) =>{
                let val=e.target.value; 
                if(min==0&&max>0) {
                if(parseInt(val)>min && parseInt(val)<=max)
                {
                 props.onValueChange(e.target.value?parseInt(e.target.value):0)
                 setValue(parseInt(e.target.value)?parseInt(e.target.value):0)
                }
                else {
                props.onValueChange(0)
                setValue(0)
            }
             }
             else {
                props.onValueChange(e.target.value?parseInt(e.target.value):0)
                 setValue(parseInt(e.target.value)?parseInt(e.target.value):0)
             }
            },
            onRightClick: handleIncrement,
            onLeftClick: handleDecrement,
            rightIcon: "pi pi-plus",
            leftIcon: "pi pi-minus",
            leftStyle: { cursor: value <= min ? "not-allowed" : "pointer" },
            rightStyle: { cursor: value >=max ? "not-allowed" : "pointer" },
            readOnly: readOnly,
            disabled: disabled
        }} parentClass={parentClass}
        />
    )
}