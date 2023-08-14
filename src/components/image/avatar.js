import React from 'react'; 
import { Avatar as AvatarComponent } from 'primereact/avatar';


const Avatar = (props) => {
    const {parentClass,avatarClass,label,size,icon,image,shape,style} = props && props.avatarProps;
    
    console.log(props.image,size);
    return (
        <div className={`${parentClass}`}>
            <AvatarComponent className={avatarClass} label={label} size={size} icon={icon} image={image} shape={shape} style={style}/>
        </div>
    )
}

export default Avatar