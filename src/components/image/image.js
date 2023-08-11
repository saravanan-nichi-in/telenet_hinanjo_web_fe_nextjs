import React from "react";
import Image from 'next/image'
export default function Images(props) {

    const imageLoader = () => {
        return `https://placehold.co/${props.width}x${props.height}`
    }

    return (
        <div className={`${props.additionalClass}`}>
            <Image
                loader={imageLoader}
                src={props.src}
                width={props.width}
                height={props.height}
            />
        </div>
    );
}

