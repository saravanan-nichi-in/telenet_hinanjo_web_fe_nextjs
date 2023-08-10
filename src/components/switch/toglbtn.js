import React from 'react';

import { ToggleButton } from 'primereact/togglebutton';
const TogglBtn = (props) => {

    return (
        <div>
            <ToggleButton className={`${props.bgColor} ${props.additionalClass}`} onLabel={props.onLabel} offLabel={props.offLabel} onIcon={props.onIcon} offIcon={props.offIcon}
                checked={props.checked} onChange={props.onChange} />
        </div>
    );
}
export default TogglBtn;