import React from 'react';

const ValidationError = (props) => {
    const { parentClass, fontWeight, errorBlock, parentStyle } = props

    return (
        <small className={`p-error block ${parentClass} ${fontWeight || "font-medium"}`} style={parentStyle}>
            {errorBlock}
        </small>
    );
}
export default ValidationError