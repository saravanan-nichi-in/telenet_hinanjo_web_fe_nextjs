import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';

const InputSwitch = (props) => {
    const { parentClass, inputSwitchProps = {} } = props && props
    const { switchClass, checked, onChange ,disabled} = inputSwitchProps && inputSwitchProps

    return (
        <div className={`${parentClass}`}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
}
export default InputSwitch