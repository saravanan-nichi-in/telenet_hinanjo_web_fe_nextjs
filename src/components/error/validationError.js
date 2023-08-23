import React from 'react';

const ValidationError = (props) => {
    const { parentClass, fontWeight, errorBlock } = props && props

    return (
        <small className={`p-error block ${parentClass} ${fontWeight ? fontWeight : "font-medium"}`}>
            {errorBlock}
        </small>
    );
}
export default ValidationError