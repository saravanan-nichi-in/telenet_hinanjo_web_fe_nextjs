import React,{useState} from 'react';
import InputGroup from './inputGroup';
export default function IncrementDecrement(props) {
    const [value, setValue] = useState(props.value);
    const handleIncrement = () => {
        setValue(value + 1);
    };
    const handleDecrement = () => {
        setValue(value - 1);
    };
    
    return (

        <div className={`${props.parentClass}`}>
            <InputGroup inputClass={"text-center"} parentClass={props.parentClass} value={value} onChange={(e) => setValue(parseInt(e.target.value))} onRightClick={handleIncrement} onLeftClick={handleDecrement} rightIcon={"pi pi-plus"} leftIcon={"pi pi-minus"} />

        </div>


    )
}
