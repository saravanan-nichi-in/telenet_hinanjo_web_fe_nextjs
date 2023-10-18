import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';

const InputSwitch = (props) => {
    const {
        parentClass,
        parentStyle,
        custom,
        inputSwitchProps = {}
    } = props;
    const {
        switchClass,
        id,
        style,
        checked,
        onChange,
        readOnly,
        onBlur,
        disabled,
        ...restProps
    } = inputSwitchProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-switch'} `} style={parentStyle}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                id={id}
                style={style}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                onBlur={onBlur}
                {...restProps}
            />
        </div>
    );
};

export default InputSwitch;
