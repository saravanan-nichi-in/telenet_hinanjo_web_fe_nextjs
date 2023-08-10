import React from "react";
import { Image } from 'primereact/image';

export default function Images(props) {
    
    return (
        <div className={`${props.additionalClass}`}>
            {props.preview ? (
            <Image src={props.src} height={props.height} width={props.width} alt={props.alt} preview={props.preview}/>
            ):(
                <Image src={props.src} height={props.height} width={props.width} alt={props.alt} />
            )}
        </div>
    )
}
