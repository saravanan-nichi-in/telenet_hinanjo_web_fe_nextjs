import React, { useState } from "react";
import Image from 'next/image'

const ImageComponent = (props) => {
    const { parentClass, parentStyle, imageProps = {} } = props;
    const { src, width, height, alt, style } = imageProps;
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
        <div className={`${parentClass}`} style={parentStyle}>
            <Image
                src={imageLoader({ src })}
                width={width}
                alt={alt}
                style={style}
                height={height}
                onError={handleImageError}
                loader={imageLoader}
            />
        </div>
    );
}
export default ImageComponent