import { InputNumber as InputNum } from 'primereact/inputnumber';

const InputNumber = (props) => {
  const { parentClass, inputNumberProps = {} } = props && props
  const { inputNumberClass, height, id, value, onValueChange, showButtons, mode, currency, readOnly } = inputNumberProps && inputNumberProps

  return (
    <div className={`${parentClass}`}>
      <InputNum className={`${inputNumberClass} ${height || 'custom_input'}`} id={id} value={value} onValueChange={onValueChange} showButtons={showButtons} mode={mode} readOnly={readOnly} currency={currency} />
    </div>
  )
}
export default InputNumber;