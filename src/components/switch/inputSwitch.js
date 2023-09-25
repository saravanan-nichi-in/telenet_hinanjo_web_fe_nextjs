import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';

const InputSwitch = (props) => {
    const {
        parentClass,
        parentStyle,
        inputSwitchProps = {}
    } = props;
    const {
        switchClass,
        id,
        style,
        checked,
        onChange,
        readOnly,
        disabled,
        ...restProps
    } = inputSwitchProps;

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                id={id}
                style={style}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                {...restProps}
            />
        </div>
    );
};

export default InputSwitch;
