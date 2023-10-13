import React, { useContext } from 'react';
import { Dialog } from 'primereact/dialog';

import { NormalLabel } from "../label";
import { TextArea } from "../input";
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'

const DetailModal = (props) => {
    const { localeJson } = useContext(LayoutContext);
    const {
        parentMainClass,
        detailModalProps = {}
    } = props;
    const {
        headerContent,
        note,
        comment,
        modalClass,
        draggable,
        position,
        onHide,
        visible,
        style,
        ...restProps
    } = detailModalProps;

    /**
     * Header content 
     */
    const header = (
        headerContent
    );

    console.log(visible);
    return (
        <div className={`${parentMainClass}`}>
            <Dialog className={`${modalClass} custom-modal`}
                draggable={draggable}
                position={position}
                header={header}
                visible={visible}
                onHide={onHide}
                style={style}
                // blockScroll={visible}
                {...restProps}
            >
                <div className="pt-2">
                    <NormalLabel labelClass="w-full pt-0 mb-1"
                        text={translate(localeJson, 'Other_shared_matters')}
                        style={{
                            marginBottom: "10px"
                        }} />
                    <TextArea textAreaProps={{
                        textAreaClass: "w-full bg-bluegray-50",
                        rows: 5,
                        readOnly: "true",
                        value: note
                    }} parentStyle={{ paddingTop: "0.2rem" }} />
                </div>
                <div className="mt-1">
                    <NormalLabel labelClass="w-full pt-0"
                        text={translate(localeJson, 'Other_shortage_items')} />
                    <TextArea textAreaProps={{
                        textAreaClass: "w-full bg-bluegray-50 pt-1",
                        rows: 5,
                        readOnly: "true",
                        value: comment
                    }} parentStyle={{ paddingTop: "0.2rem" }} />
                </div>
            </Dialog>
        </div>
    );
}

export default DetailModal;