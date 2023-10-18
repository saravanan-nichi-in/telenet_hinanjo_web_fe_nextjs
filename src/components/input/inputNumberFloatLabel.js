import { InputNumber as InputNum } from 'primereact/inputnumber';

const InputNumberFloatLabel = (props) => {
    const {
        parentClass,
        inputNumberFloatProps = {}
    } = props;
    const {
        inputNumberClass,
        custom,
        id,
        value,
        name,
        onValueChange,
        showButtons,
        mode,
        ref,
        required,
        readOnly,
        disabled,
        currency,
        text,
        spanClass,
        spanText,
        minFractionDigits,
        maxFractionDigits,
        useGrouping,
        onBlur,
        ...restProps
    } = inputNumberFloatProps;

    return (
        <div className='custom-align-label'>
        <div className={`${parentClass} ${custom || 'custom_input'} p-float-label`}>
            <InputNum className={`${inputNumberClass} `}
                id={id}
                value={value}
                name={name}
                onValueChange={onValueChange}
                showButtons={showButtons}
                mode={mode}
                ref={ref}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                currency={currency} 
                minFractionDigits={minFractionDigits}
                maxFractionDigits={maxFractionDigits}
                useGrouping={false}// disable comma separate for Number
                onBlur={onBlur}
                {...restProps} />
            <label htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
        </div>
        </div>
    )
}

export default InputNumberFloatLabel;