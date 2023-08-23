import React from 'react';
import { Avatar } from 'primereact/avatar';

const AvatarComponent = (props) => {
    const { parentClass, avatarProps = {} } = props && props
    const { avatarClass, label, size, icon, image, shape, style } = avatarProps;
    
    return (
        <div className={`${parentClass}`}>
            <Avatar className={avatarClass}
                label={label}
                size={size}
                icon={icon}
                image={image}
                shape={shape}
                style={style}
            />
        </div>
    )
}

export default AvatarComponent