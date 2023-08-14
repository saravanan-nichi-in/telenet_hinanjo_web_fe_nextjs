import React from 'react';

const ErrorBlock = (props) => {
    return (
        <small className={`p-error block ${props.parentClass} ${props.fontWeight ? props.fontWeight:"font-medium"}`}>
                {props.errorBlock}
        </small>
    );
}
export default ErrorBlock