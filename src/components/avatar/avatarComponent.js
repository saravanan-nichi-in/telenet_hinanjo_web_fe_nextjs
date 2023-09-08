import React from 'react';
import { Avatar } from 'primereact/avatar';

const AvatarComponent = (props) => {
    const { parentClass, parentStyle, avatarProps = {} } = props;
    const { avatarClass, label, id, size, icon, image, shape, style, ...restProps } = avatarProps;

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <Avatar className={avatarClass}
                label={label}
                id={id}
                size={size}
                icon={icon}
                image={image}
                shape={shape}
                style={style}
                {...restProps}
            />
        </div>
    )
}
export default AvatarComponent