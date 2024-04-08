import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';

import { InputSwitch } from "../switch";
import { Button } from "../button";

const DynamicModal = (props) => {
    const {
        text,
        iconPos,
        parentClass,
        checked,
        modalClass,
        draggable,
        position,
        header,
        footer,
        contentClass,
        content,
        ...restProps
    } = props;
    const [visible, setVisible] = useState(false);

    return (
        <div className={`${props.parentMainClass}`}>
            {props.text ? (
                <>
                    <Button buttonProps={{
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
            <Dialog className={`${modalClass}`}
                draggable={draggable}
                position={position}
                header={header}
                footer={footer}
                visible={visible}
                blockScroll={true}
                onHide={() => setVisible(false)}
                {...restProps}
            >
                <div class={`text-center ${contentClass}`}>
                    {content}
                </div>
            </Dialog>
        </div>
    );
}

export default DynamicModal;