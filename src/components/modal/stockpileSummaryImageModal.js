import React from "react"
import { Dialog } from 'primereact/dialog';


import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useContext, useState } from 'react';
import { ImageComponent } from "../image";

export default function StockpileSummaryImageModal(props) {
    const { localeJson } = useContext(LayoutContext);
    /**
     * Destructing
    */
    const { open, close } = props && props;

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
                                    src: "/layout/images/perspective.jpg"
                                }}
                            />
                            </div>
                        </Dialog>
                    </div>
    );
}