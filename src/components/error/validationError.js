import React from 'react';

const ValidationError = (props) => {
    const { parentClass, fontWeight, errorBlock, parentStyle, ...restProps } = props

    return (
        <small className={`p-error block ${parentClass} ${fontWeight || "font-medium"}`} style={parentStyle} {...restProps}>
            {errorBlock}
        </small>
    );
}
export default ValidationError