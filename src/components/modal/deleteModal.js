import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import InputSwitch from "../switch/inputSwitch";
import Btn from "../button/btn";
const DeleteModal = (props) => {
    const { parentMainClass, text, iconPos, icon, parentClass, checked, modalClass, position, header, contentClass, content } = props
    const [visible, setVisible] = useState(false);
    const footer = (
        <div className="text-center">
            <Btn btnProps={{
                buttonClass: "w-50rem h-3rem",
                text: "cancel"
            }} parentClass={"inline"} />
            <Btn btnProps={{
                buttonClass: "w-40rem h-3rem",
                text: "delete",
                severity: "danger"
            }} parentClass={"inline"} />
        </div>
    );

    return (
        <div className={`${parentMainClass}`}>
            {text ? (
                <>
                    <Btn btnProps={{
                        text: text,
                        iconPos: iconPos,
                        icon: icon,

                        onClick: () => setVisible(true)
                    }} />
                </>) : (
                <>
                    <InputSwitch parentClass={parentClass} inputSwitchProps={{
                        checked: checked,
                        onChange: () => setVisible(true)
                    }} />
                </>)}
            <Dialog className={`${modalClass}`} draggable={false} position={position} header={header} footer={footer} visible={visible} onHide={() => setVisible(false)}>
                <div class={`text-center ${contentClass} text-lg`}>
                    {content}
                </div>
            </Dialog>
        </div>
    )
}
export default DeleteModal