import React from 'react';
import { InputSwitch } from 'primereact/inputswitch';

const InputSwitcher = (props) => {

    return (
        <div>
            
                <InputSwitch className={`${props.bgColor} ${props.additionalClass}`} checked={props.checked} onChange={props.onChange} />          
        </div>
    );
}
export default InputSwitcher