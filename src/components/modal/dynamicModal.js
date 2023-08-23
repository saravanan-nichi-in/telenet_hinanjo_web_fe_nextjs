import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import InputSwitch from "../switch/inputSwitch";
import Btn from "../button/btn";

const DynamicModal = (props) => {
    const { text, iconPos, parentClass, checked, modalClass, position, header, footer, contentClass, content } = props
    const [visible, setVisible] = useState(false);

    return (
        <div className={`${props.parentMainClass}`}>
            {props.text ? (
                <>
                    <Btn btnProps={{
                        text: text,
                        iconPos: iconPos,
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
                <div class={`text-center ${contentClass}`}>
                    {content}
                </div>
            </Dialog>
        </div>
    )
}
export default DynamicModal