import React, { useState } from 'react';

import InputGroup from '../input/inputGroup';

export default function Counter(props) {
    const {
        name,
        readOnly,
        disabled,
        parentClass
    } = props;
    const [value, setValue] = useState(props.value);

    const handleIncrement = () => {
        setValue(value + 1);
    };

    const handleDecrement = () => {
        setValue(value - 1);
    };

    return (
        <InputGroup inputGroupProps={{
            inputClass: "text-center",
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