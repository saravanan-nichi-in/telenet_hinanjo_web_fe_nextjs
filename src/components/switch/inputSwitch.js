import React, { useState } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import { ToggleButton } from 'primereact/togglebutton';


const InputSwitcher = (props) => {

    return (
        <div>
            
                <InputSwitch className={`${props.bgcolor} ${props.additionalclass}`} checked={props.checked} onChange={props.onchange} />
            
        </div>
    );
}
export default InputSwitcher