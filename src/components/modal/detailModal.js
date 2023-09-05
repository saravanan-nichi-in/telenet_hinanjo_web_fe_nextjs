import React from "react"
import { Dialog } from 'primereact/dialog';
import { NormalLabel } from "../label";
import { TextArea } from "../input";

const DetailModal = (props) => {
    const { parentMainClass, detailModalProps = {} } = props;
    const { headerContent, value1, value2, modalClass, draggable, position, onHide, visible } = detailModalProps;

    const header = (
        headerContent
    )

    return (
        <div className={`${parentMainClass}`}>
            <Dialog className={`${modalClass}`} draggable={draggable} position={position} header={header} visible={visible} onHide={onHide} style={{ width: '600px', padding: "10px" }}>
                <div>
                <NormalLabel labelClass="w-full font-bold pt-0" text={"その他不足物資"} />
                <TextArea textAreaProps={{
                    textAreaClass: "w-full bg-bluegray-50",
                    rows: 5,
                    readOnly: "true",
                    value: value1
                }} />
                </div>
                <div className="mt-1">
                <NormalLabel labelClass="w-full font-bold pt-0" text={"その他不足物資"} />
                <TextArea textAreaProps={{
                    textAreaClass: "w-full bg-bluegray-50",
                    rows: 5,
                    readOnly: "true",
                    value: value2
                }} />
                </div>
            </Dialog>
        </div>
    )
}
export default DetailModal