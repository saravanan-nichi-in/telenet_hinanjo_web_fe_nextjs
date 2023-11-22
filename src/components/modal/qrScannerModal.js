import React from "react"
import { Dialog } from 'primereact/dialog';
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useContext, useState } from 'react';
import {QrScanner} from '@yudiel/react-qr-scanner';
import { useRouter } from "next/router";
import { getValueByKeyRecursively as translate } from '@/helper'

export default function QrScannerModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    /**
     * Destructing
    */
    const { open, close } = props;

    return (
        <div>
            <Dialog
                className="custom-modal"
                visible={open}
                header={translate(localeJson, 'qr_scanner_popup_dialog')}
                draggable={false}
                style={{width:"30%"}}
                onHide={() => close()}
            >
                <div >
                    <QrScanner
                        onDecode={(result) => {
                            // router.push({
                            //     path : "/user/qr/app/register",
                            //     // query: { data: result }
                            // })
                            localStorage.setItem('user_qr', result);
                            router.push("/user/qr/app/register")
                        }}
                        onError={(error) => console.log(error?.message)}
                    />
                </div>
            </Dialog>
        </div>
    );
}