import React from 'react';

const InputFile = (props) => {
    const { parentClass, parentStyle, inputFileProps = {} } = props;
    const { name, height, inputFileClass, accept, onChange, onBlur, ref, inputFileStyle, value,
        required, readOnly, disabled, ...restProps } = inputFileProps;

    const divStyle = {
        border: '1px solid #ccc', // You can adjust the border style as needed
        padding: '10px', // Add padding for spacing
        ...parentStyle, // Allow overriding styles from props
    };
    return (
        <div className={`${parentClass}`} style={divStyle}>
            <input type="file"
                name={name}
                className={`${inputFileClass} ${height || 'custom_input'}`}
                accept={accept}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                style={inputFileStyle}
                value={value}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                {...restProps}
            />
        </div>
    );
}
export default InputFile