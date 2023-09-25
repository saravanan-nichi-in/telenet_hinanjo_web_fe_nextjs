import { InputNumber as InputNum } from 'primereact/inputnumber';

const InputNumber = (props) => {
  const {
    parentClass,
    inputNumberProps = {}
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
    ...restProps
  } = inputNumberProps;

  return (
    <div className={`${parentClass}`}>
      <InputNum className={`${inputNumberClass} ${custom || 'custom_input'}`}
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
        {...restProps} />
    </div>
  )
}

export default InputNumber;