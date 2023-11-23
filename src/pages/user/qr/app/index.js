import { Button } from "@/components";
import { getValueByKeyRecursively as translate } from '@/helper'
import { useContext, useState } from "react";
import { LayoutContext } from '@/layout/context/layoutcontext';
import QrScannerModal from "@/components/modal/qrScannerModal";
import { MdOutlineQrCodeScanner } from "react-icons/md";



export default function App() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [openQrPopup, setOpenQrPopup] = useState(false);
    const closeQrPopup = () => {
        setOpenQrPopup(false);
    }

    return (<><QrScannerModal
        open={openQrPopup}
        close={closeQrPopup}></QrScannerModal>
        <div style={{height:"500px", display:"flex", justifyContent: "center", alignItems:"center"}}>
       <Button buttonProps={{
                    type: 'submit',
                    rounded: "true",
                    size:"large",
                    text: " " + translate(localeJson, 'qr_scanner_popup_btn'),
                    severity: "primary",
                    className:"pi pi-qrcode",
                    onClick: () => {setOpenQrPopup(true)},
                }} parentClass={"flex"} ></Button>
                </div>
                </>);
}