import { InputTextarea } from "primereact/inputtextarea";

const TextAreaFloatLabel = (props) => {
    const {
        parentClass,
        parentStyle,
        textAreaFloatLabelProps = {}
    } = props;
    const {
        name,
        textAreaClass,
        value,
        id,
        style,
        onChange,
        rows,
        cols,
        readOnly,
        disabled,
        text,
        custom,
        spanClass,
        spanText,
        onBlur,
        ...restProps
    } = textAreaFloatLabelProps;

    return (
        <div className="custom-align-label">
            <div className={`${parentClass}  ${custom || 'custom-textArea'} p-float-label`} style={parentStyle}>
            <InputTextarea name={name}
                className={`${textAreaClass} `}
                value={value}
                id={id}
                style={style}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                cols={cols}
                readOnly={readOnly}
                disabled={disabled}
                {...restProps}
            />
            <label htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
        </div>
        </div>
    );
}

export default TextAreaFloatLabel;