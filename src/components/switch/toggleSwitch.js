import React from 'react';
import { ToggleButton } from 'primereact/togglebutton';

const ToggleSwitch = (props) => {
    const {
        bgColor,
        parentClass,
        custom,
        id,
        style,
        onLabel,
        offLabel,
        onIcon,
        offIcon,
        checked,
        onChange,
        disabled,
        ...restProps
    } = props && props;

    return (
        <div>
            <ToggleButton className={`${bgColor} ${parentClass} ${custom || 'person-count-button'}`}
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
};

export default ToggleSwitch;