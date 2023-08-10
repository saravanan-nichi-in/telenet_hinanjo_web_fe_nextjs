import React from 'react';

const ErrorBlock = (props) => {

    return (
        <small className={`p-error block ${props.additionalClass}`}>
                {props.errorBlock}
        </small>
    );
}
export default ErrorBlock