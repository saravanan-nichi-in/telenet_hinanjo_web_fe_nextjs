import React, { useState } from "react";
import Image from 'next/image'
const ImageComponent = (props) => {
    const { parentClass, imageProps = {} } = props && props
    const { src, width, height } = imageProps && imageProps

    const [imageError, setImageError] = useState(false);

    const imageLoader = ({ src }) => {
        if (imageError || !src) {
            return `https://placehold.co/${width}x${height}`;
        }
        return src;
    }

    const handleImageError = () => {
        setImageError(true);
    }

    return (
        <div className={`${parentClass}`}>
            <Image
                src={src}
                width={width}
                height={height}
                onError={handleImageError}
                loader={imageLoader}
            />
        </div>
    );
}

export default ImageComponent