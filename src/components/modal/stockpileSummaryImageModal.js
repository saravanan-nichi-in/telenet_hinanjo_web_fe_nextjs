import React from "react"
import { Dialog } from 'primereact/dialog';
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useContext, useState } from 'react';
import { ImageComponent } from "../image";

export default function StockpileSummaryImageModal(props) {
    const { localeJson } = useContext(LayoutContext);
    /**
     * Destructing
    */
    const { open, close, imageUrl } = props;
    return (
        <div>
            <Dialog
                className="custom-modal"
                visible={open}
                draggable={false}
                onHide={() => close()}
            >
                <div class={`text-1rem`}>
                    <ImageComponent
                        imageProps={{
                            width: "300",
                            height: "200",
                            src: imageUrl,
                            alt: "scan-image"
                        }}

                    />
                </div>
            </Dialog>
        </div>
    );
}