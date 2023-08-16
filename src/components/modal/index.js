import React, { useState } from "react"
import IconPosBtn from "../button/iconPositionBtn";
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
const Modal = (props) => {
    const [visible, setVisible] = useState(false);


    return (
        <div className={`${props.parentMainClass}`}>
            {props.text ? (
                <>
                    <IconPosBtn text={props.text}
                        icon={props.icon}
                        iconPos={props.iconPos}
                        onClick={() => setVisible(true)} />
                    <Dialog className={`${props.modalClass}`} position={props.position} header={props.header} footer={props.footer} visible={visible} onHide={() => setVisible(false)}>
                        <div class={`text-center ${props.contentClass}`}>
                            {props.content}
                        </div>
                    </Dialog>
                </>) : (
                <>
                    <InputSwitch className={`${props.bgColor} ${props.parentClass}`} checked={props.checked} onChange={() => setVisible(true)} />
                    <Dialog className={`${props.modalClass}`} position={props.position} header={props.header} footer={props.footer} visible={visible} onHide={() => setVisible(false)}>
                        <div class={`text-center ${props.contentClass}`}>
                            {props.content}
                        </div>
                    </Dialog>
                </>)}
        </div>
    )
}
export default Modal