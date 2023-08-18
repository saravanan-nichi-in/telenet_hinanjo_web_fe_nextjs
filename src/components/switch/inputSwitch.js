import React from 'react';
import { InputSwitch } from 'primereact/inputswitch';

const InputSwitcher = (props) => {
    const { parentClass, inputSwitchProps = {} } = props && props
    const { switchClass, checked, onChange } = inputSwitchProps && inputSwitchProps
    return (
        <div className={`${parentClass}`}>

            <InputSwitch className={` ${switchClass}`}
                checked={checked}
                onChange={onChange}
            />
        </div>
    );
}
export default InputSwitcher