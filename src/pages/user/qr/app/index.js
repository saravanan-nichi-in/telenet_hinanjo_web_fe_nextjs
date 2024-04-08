import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { Button } from "@/components";
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import QrScannerModal from "@/components/modal/qrScannerModal";
import {UserQrService} from "@/services"
import {setCheckInData} from "@/redux/qr_app"
import { family_dummy_data } from "@/utils/constant";


export default function App() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [openQrPopup, setOpenQrPopup] = useState(false);
    const closeQrPopup = () => {
        setOpenQrPopup(false);
    }
    const dispatch = useDispatch();
    const {register} = UserQrService;
    const router = useRouter()
   const qrResult = (res) => {
    let formData = new FormData();
    formData.append("content",res)
    register(formData,(result)=>
    {   
    console.log(res)
   })
   dispatch(setCheckInData(family_dummy_data))
   router.push('/user/qr/app/register')
}

    return (<div className='grid flex-1'>
    <div className='col-12 flex-1'>
      <div className='card flex flex-column h-full align-items-center justify-content-center'>
        <div className="mdScreenMaxWidth xlScreenMaxWidth">
            <QrScannerModal
        open={openQrPopup}
        close={closeQrPopup} 
        callback={qrResult}>
        </QrScannerModal>
        
        <div className="h-full" style={{display:"flex", justifyContent: "center", alignItems:"center"}}>
       <Button buttonProps={{
                    type: 'submit',
                    rounded: "true",
                    size:"large",
                    text: " " + translate(localeJson, 'qr_scanner_popup_btn'),
                    className:"pi pi-qrcode primary-button",
                    onClick: () => {setOpenQrPopup(true)},
                }} parentClass={"flex primary-button"} ></Button>
                </div>
                </div>
                </div>
                </div>
                </div>);
}