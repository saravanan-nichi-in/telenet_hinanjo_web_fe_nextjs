import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import InputSwitcher from "../switch/inputSwitch";
import RectangularButton from "../button/rectangularBtn";
const Modal = (props) => {

    const [visible, setVisible] = useState(false);


    return (
        <div className={`${props.parentMainClass}`}>
            {props.text ? (
                <>
                    <RectangularButton rectangularButtonProps={{
                        text: props.text,
                        iconPos: props.iconPos,
                        onClick: () => setVisible(true)
                    }} />
                </>) : (
                <>
                    <InputSwitcher parentClass={props.parentClass} inputSwitchProps={{
                        checked: props.checked,
                        onChange: () => setVisible(true)
                    }} />
                </>)}
                <Dialog className={`${props.modalClass}`} position={props.position} header={props.header} footer={props.footer} visible={visible} onHide={() => setVisible(false)}>
                        <div class={`text-center ${props.contentClass}`}>
                            {props.content}
                        </div>
                    </Dialog>
        </div>
    )
}
export default Modal