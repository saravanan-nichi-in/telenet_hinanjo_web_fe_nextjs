import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';

const InputSwitch = (props) => {
    const { parentClass, inputSwitchProps = {} } = props && props
    const { switchClass, id, checked, onChange, disabled } = inputSwitchProps && inputSwitchProps

    return (
        <div className={`${parentClass}`}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                id={id}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
}
export default InputSwitch