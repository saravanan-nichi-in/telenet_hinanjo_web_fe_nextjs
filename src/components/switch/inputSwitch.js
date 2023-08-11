import React from 'react';
import { InputSwitch } from 'primereact/inputswitch';

const InputSwitcher = (props) => {

    return (
        <div className={`${props.parentClass}`}>
            
                <InputSwitch className={`${props.bgColor} ${props.switchClass}`} checked={props.checked} onChange={props.onChange} />          
        </div>
    );
}
export default InputSwitcher