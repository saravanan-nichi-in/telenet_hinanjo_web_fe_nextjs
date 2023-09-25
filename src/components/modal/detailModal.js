import React from "react"
import { Dialog } from 'primereact/dialog';

import { NormalLabel } from "../label";
import { TextArea } from "../input";

const DetailModal = (props) => {
    const {
        parentMainClass,
        detailModalProps = {}
    } = props;
    const {
        headerContent,
        value1,
        value2,
        modalClass,
        draggable,
        position,
        onHide,
        visible,
        style,
        ...restProps
    } = detailModalProps;
    const header = (
        headerContent
    );

    return (
        <div className={`${parentMainClass}`}>
            <Dialog className={`${modalClass}`}
                draggable={draggable}
                position={position}
                header={header}
                visible={visible}
                onHide={onHide}
                style={style}
                {...restProps}
            >
                <div className="pt-2">
                    <NormalLabel labelClass="w-full font-bold pt-0 mb-1"
                        text={"その他不足物資"} 
                        style={{
                            fontSize: "14px",
                            marginBottom: "10px"
                        }} />
                    <TextArea textAreaProps={{
                        textAreaClass: "w-full bg-bluegray-50",
                        rows: 5,
                        readOnly: "true",
                        value: value1
                    }} parentStyle={{paddingTop: "0.2rem"}} />
                </div>
                <div className="mt-1">
                    <NormalLabel labelClass="w-full font-bold pt-0"
                        text={"その他不足物資"}
                        style={{
                            fontSize: "14px"
                        }} />
                    <TextArea textAreaProps={{
                        textAreaClass: "w-full bg-bluegray-50 pt-1",
                        rows: 5,
                        readOnly: "true",
                        value: value2
                    }} parentStyle={{paddingTop: "0.2rem"}}/>
                </div>
            </Dialog>
        </div>
    );
}

export default DetailModal;