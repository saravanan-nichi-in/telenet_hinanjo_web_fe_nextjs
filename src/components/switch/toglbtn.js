import React from 'react';

import { ToggleButton } from 'primereact/togglebutton';
const TogglBtn = (props) => {
    const { bgColor, parentClass, onLabel, offLabel, onIcon, offIcon, checked, onChange } = props && props.togglProps;
    return (
        <div>
            <ToggleButton className={`${bgColor} ${parentClass}`}
                onLabel={onLabel}
                offLabel={offLabel}
                onIcon={onIcon}
                offIcon={offIcon}
                checked={checked}
                onChange={onChange} />
        </div>
    );
}
export default TogglBtn;