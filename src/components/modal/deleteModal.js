import React, { useState, useContext } from "react"
import { Dialog } from 'primereact/dialog';

import InputSwitch from "../switch/inputSwitch";
import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

const DeleteModal = (props) => {
    const {
        parentMainClass,
        text,
        iconPos,
        icon,
        parentClass,
        checked,
        modalClass,
        draggable,
        position,
        header,
        style,
        contentClass,
        content,
        bg,
        hoverBg,
        severity,
        buttonClass,
        ...restProps
    } = props;
    const [visible, setVisible] = useState(false);
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const footer = (
        <div className="text-center">
            <Button buttonProps={{
                buttonClass: "w-50rem h-3rem",
                text: translate(localeJson, 'cancel')
            }} parentClass={"inline"} />
            <Button buttonProps={{
                buttonClass: "w-40rem h-3rem",
                text: translate(localeJson, 'renew'),
                severity: "danger"
            }} parentClass={"inline"} />
        </div>
    );

    return (
        <div className={`${parentMainClass}`}>
            {text ? (
                <>
                    <Button buttonProps={{
                        text: text,
                        iconPos: iconPos,
                        icon: icon,
                        bg: bg,
                        hoverBg: hoverBg,
                        severity: severity,
                        buttonClass: buttonClass,
                        onClick: () => setVisible(true)
                    }} />
                </>) : (
                <>
                    <InputSwitch parentClass={parentClass} inputSwitchProps={{
                        checked: checked,
                        onChange: () => setVisible(true)
                    }} />
                </>)}
            <Dialog className={`${modalClass}`}
                draggable={draggable}
                position={position}
                header={header}
                footer={footer}
                visible={visible}
                style={style}
                onHide={() => setVisible(false)}
                {...restProps}
            >
                <div class={`text-center ${contentClass} text-1rem`}>
                    {content}
                </div>
            </Dialog>
        </div>
    );
}

export default DeleteModal;