import React from "react"
import { Dialog } from 'primereact/dialog';
import { NormalLabel } from "../label";
import { TextArea } from "../input";

const DetailModal = (props) => {
    const { parentMainClass, detailModalProps = {} } = props && props
    const { headerContent, value1, value2, modalClass, position, onHide, visible } = detailModalProps

    const header = (
        headerContent
    )

    return (
        <div className={`${parentMainClass}`}>
            <Dialog className={`${modalClass}`} draggable={false} position={position} header={header} visible={visible} onHide={onHide} style={{ width: '600px', padding: "10px" }}>
                <NormalLabel labelClass="w-full font-18 font-bold pt-0" text={"その他不足物資"} />
                <TextArea textAreaProps={{
                    textAreaClass: "w-full font-18 bg-bluegray-50",
                    rows: 5,
                    readOnly: "true",
                    value: value1
                }} />
                <br /><br />
                <NormalLabel labelClass="w-full font-18 font-bold pt-0" text={"その他不足物資"} />
                <TextArea textAreaProps={{
                    textAreaClass: "w-full font-18 bg-bluegray-50",
                    rows: 5,
                    readOnly: "true",
                    value: value2
                }} />
            </Dialog>
        </div>
    )
}
export default DetailModal