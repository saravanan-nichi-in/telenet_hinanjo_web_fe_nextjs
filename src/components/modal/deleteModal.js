import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import InputSwitcher from "../switch/inputSwitch";
import RectangularButton from "../button/rectangularBtn";
const DeleteModal = (props) => {
    const { parentMainClass, text, iconPos, icon, parentClass, checked, modalClass, position, header, contentClass, content } = props
    const [visible, setVisible] = useState(false);
    const footer = (
        <div className="text-center">
            <RectangularButton rectangularButtonProps={{
                buttonClass: "w-50rem h-3rem",
                text: "cancel"
            }} parentClass={"inline"} />
            <RectangularButton rectangularButtonProps={{
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
                    <RectangularButton rectangularButtonProps={{
                        text: text,
                        iconPos: iconPos,
                        icon: icon,

                        onClick: () => setVisible(true)
                    }} />
                </>) : (
                <>
                    <InputSwitcher parentClass={parentClass} inputSwitchProps={{
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