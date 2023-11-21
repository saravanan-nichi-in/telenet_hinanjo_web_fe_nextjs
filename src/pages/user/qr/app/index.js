import { Button } from "@/components";
import { getValueByKeyRecursively as translate } from '@/helper'
import { useContext, useState } from "react";
import { LayoutContext } from '@/layout/context/layoutcontext';
import QrScannerModal from "@/components/modal/qrScannerModal";


export default function App() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [openQrPopup, setOpenQrPopup] = useState(false);
    const closeQrPopup = () => {
        setOpenQrPopup(false);
    }

    return (<div className="grid">
        <QrScannerModal
            open={openQrPopup}
            close={closeQrPopup}></QrScannerModal>
        <div className="col-12" style={{marginTop: "15%", display:"flex" ,alignItems: "center", justifyContent: "center"}}>
            <Button buttonProps={{
                type: 'submit',
                rounded: "true",
                size:"large",
                text: translate(localeJson, 'qr_scanner_popup_btn'),
                severity: "primary",
                onClick: () => {setOpenQrPopup(true)}
            }} parentClass={"mr-1 mt-1"} /></div></div>);
}