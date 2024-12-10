import React, { useContext, useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { QrScanner } from '@yudiel/react-qr-scanner';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button } from "@/components";

export default function QrScannerModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close } = props;

    const [toggleCameraMode, setToggleCameraMode] = useState("environment");

    useEffect(()=>{
        if (window.innerWidth >= 1024) { setToggleCameraMode("user"); }
    },[window.innerWidth])

    return (
        <div>
            <Dialog
                className="custom-modal"
                visible={open}
                header={translate(localeJson, 'qr_scanner_popup_dialog')}
                draggable={false}
                blockScroll={true}
                style={{ width: "400px" }}
                onHide={() => close()}
            >
                <div >
                    <QrScanner
                        onDecode={(result) => {
                            if (result && result !== localStorage.getItem('user_qr')) {
                                localStorage.setItem('user_qr', result);
                                props.callback(result);
                                setTimeout(() => {
                                    localStorage.removeItem('user_qr');
                                }, 1000)
                            }
                        }}
                        videoStyle={{
                                     transform: toggleCameraMode == "user" ? 'scaleX(-1)':'inherit', // Flip only for front camera
                                    }}
                        scanDelay={1000}
                        constraints={{
                            facingMode: toggleCameraMode
                        }}
                        onError={(error) => console.error(error?.message)}
                    />
                </div>
                <div>
                    <Button buttonProps={
                        {
                            onClick: () => {
                                if (toggleCameraMode == "user") {

                                    setToggleCameraMode("environment");
                                } else {
                                    setToggleCameraMode("user");
                                }
                            },
                            icon: "pi pi-camera",
                            buttonClass: "mt-3 mb-2",
                        }
                    }></Button>

                </div>
            </Dialog>
        </div>
    );
}