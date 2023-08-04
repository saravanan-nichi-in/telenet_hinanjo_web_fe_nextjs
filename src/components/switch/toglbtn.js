import React from 'react';

import { ToggleButton } from 'primereact/togglebutton';
const TogglBtn = (props) => {

    return (
        <div>
            <ToggleButton className={`${props.bgcolor} ${props.additionalclass}`} onLabel={props.onlabel} offLabel={props.offLabel} onIcon={props.onicon} offIcon={props.officon}
                checked={props.checked} onChange={props.onchange} />
        </div>
    );
}
export default TogglBtn;