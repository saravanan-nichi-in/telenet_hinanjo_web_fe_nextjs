import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';

const InputSwitch = (props) => {
    const { parentClass, parentStyle, inputSwitchProps = {} } = props;
    const { switchClass, id, style, checked, onChange,readOnly, disabled } = inputSwitchProps;

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                id={id}
                style={style}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
            />
        </div>
    );
}
export default InputSwitch