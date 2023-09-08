import React from 'react';
import { ToggleButton } from 'primereact/togglebutton';

const ToggleSwitch = (props) => {
    const { bgColor, parentClass, id, style, onLabel, offLabel, onIcon, offIcon, checked,
        onChange, disabled, ...restProps } = props && props.togglProps;

    return (
        <div>
            <ToggleButton className={`${bgColor} ${parentClass}`}
                id={id}
                style={style}
                onLabel={onLabel}
                offLabel={offLabel}
                onIcon={onIcon}
                offIcon={offIcon}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...restProps}
            />
        </div>
    );
}
export default ToggleSwitch;