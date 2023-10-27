import React, { useState } from 'react';

import InputGroup from '../input/inputGroup';

export default function Counter(props) {
    const {
        name,
        readOnly,
        disabled,
        parentClass,
        inputClass
    } = props;
    const [value, setValue] = useState(props.value);

    const handleIncrement = () => {
        const newValue = parseInt(value) + 1;
        setValue(newValue);
        props.onValueChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = parseInt(value) - 1;
        setValue(newValue);
        props.onValueChange(newValue);
    };

    return (
        <InputGroup inputGroupProps={{
            inputClass: inputClass,
            id: props.id,
            value: value,
            name: name,
            onChange: (e) => setValue(parseInt(e.target.value)),
            onRightClick: handleIncrement,
            onLeftClick: handleDecrement,
            rightIcon: "pi pi-plus",
            leftIcon: "pi pi-minus",
            leftStyle: { cursor: "pointer" },
            rightStyle: { cursor: "pointer" },
            readOnly: readOnly,
            disabled: disabled
        }} parentClass={parentClass}
        />
    )
}