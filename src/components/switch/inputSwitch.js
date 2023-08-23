import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';

const InputSwitch = (props) => {
    const { parentClass, inputSwitchProps = {} } = props && props
    const { switchClass, checked, onChange } = inputSwitchProps && inputSwitchProps

    return (
        <div className={`${parentClass}`}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                onChange={onChange}
            />
        </div>
    );
}
export default InputSwitch