import React, { useState, useEffect } from "react";
import ImageData from 'next/image'

export const ImageComponent = (props) => {
    const {
        parentClass,
        parentStyle,
        imageProps = {}
    } = props;
    const {
        src,
        width,
        height,
        alt,
        style,
        custom,
        maxWidth,
        ...restProps
    } = imageProps;
    const [imageError, setImageError] = useState(false);
    const [dimensions, setDimensions] = useState({ width: width, height: width });

    const imageLoader = ({ src }) => {
        if (imageError || !src) {
            return `https://placehold.co/${width}x${height}`;
        }
        return src;
    }

    const handleImageError = () => {
        setImageError(true);
    }
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
    }, [src]);

    return (
        <div className={`${parentClass}`} style={parentStyle}>
            <ImageData
                src={imageLoader({ src })}
                width={custom ? (dimensions.width > maxWidth ? maxWidth : dimensions.width) : width}
                alt={alt}
                style={style}
                height={custom ? dimensions.height : height}
                maxWidth={custom ? maxWidth : ''}
                onError={handleImageError}
                loader={imageLoader}
                {...restProps}
            />
        </div>
    );
}