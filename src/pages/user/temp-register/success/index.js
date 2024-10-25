import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { downloadImage, toastDisplay, getValueByKeyRecursively as translate } from "@/helper";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearExceptPlaceId, clearExceptSuccessData, reset } from "@/redux/tempRegister";
import { TempRegisterServices } from "@/services"
import { default_place_id } from "@/utils/constant";
import html2canvas from 'html2canvas'; 

const RegisterSuccess = () => {
  const { localeJson, locale } = useContext(LayoutContext);
  const router = useRouter()
  const dispatch = useAppDispatch();
  const regReducer = useAppSelector((state) => state.tempRegisterReducer);
  const [showDelete,setShowDelete] = useState(false);
  const [isTemp,setIsTemp] = useState(false);
  const pageRef = useRef(null);

  const family_code = regReducer.successData?.data?.familyCode

  const url = regReducer.successData?.data?.url

  const baseUrl = regReducer.successData?.data?.baseUrl

  const { deleteTempFamily } = TempRegisterServices

  useEffect(() => {
    const handlePopstate = () => {
      // Clear localStorage when the back button is clicked
      localStorage.setItem('refreshing', "true");
    };

    const handleBeforeUnload = () => {
      // Clear localStorage when the page is about to be unloaded
      localStorage.setItem('refreshing', "true");
    };

    // Attach the event listeners when the component mounts
    window.addEventListener("popstate", handlePopstate);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [locale]);

  useEffect(() => {
    let place_id = regReducer.placeId;
    let SuccessPlaceId = regReducer.successData?.placeId

    if(localStorage.getItem('deletedFromStaff')=="true"||localStorage.getItem('tempDataDeleted')=="true"||!regReducer.successData?.data?.familyCode)
    {
      router.push('/user/temp-person-count')
    }
    if (regReducer.successData?.data?.familyCode) {
      let payload = {
        family_code:regReducer.successData?.data?.familyCode
      }
      TempRegisterServices.isRegistered(payload,(res)=>
    {
      if(res)
      {
        let data = res.data;
        if(data?.is_registered != "0" && !(default_place_id.includes(parseInt(place_id))))
        {
          localStorage.setItem("showDelete","false")
          router.push('/user/temp-person-count')
        }
        else if(data?.is_registered == "1") {
          localStorage.setItem("personCountTemp",null)
          localStorage.setItem('refreshing', "false");
          localStorage.setItem("tempDataDeleted","true");
          dispatch(clearExceptSuccessData());
          setIsTemp(false)
        }
        else {
          setIsTemp(true)
        }
      }
    })
    }

    if (place_id != SuccessPlaceId) {
      toastDisplay(translate(localeJson, "already_register"),'','',"error");
    }
    // Dispatch setSuccessData only if the page has been refreshed
   let show = localStorage.getItem("refreshing");
   let isTrue = localStorage.getItem("showDelete");
   if( show == "true" || isTrue == "true") {
    localStorage.setItem("showDelete","true");
    setShowDelete(true)
  }
  }, [locale]);

  const handleDownload = async () => {
    const element = pageRef.current;
    const buttonContainer = element.querySelector("#capture");
    const textContainer = element.querySelector("#textCapture");
    const svgContainer = element.querySelector("#svgCapture");
    const imgElement = element.querySelector("img");
    buttonContainer.classList.remove('block');
    buttonContainer.classList.add('hidden');
    textContainer.classList.add('hidden');
    svgContainer.classList.add('hidden');
    svgContainer.classList.remove('flex');

      
    console.log(buttonContainer)
    // Convert base64 to Blob and set it as the image source
    if (imgElement && baseUrl) {
      const blob = base64ToBlob(baseUrl);
      const objectUrl = URL.createObjectURL(blob);
      
      // Wait until image is fully loaded before proceeding
      imgElement.src = objectUrl;
      await new Promise((resolve) => (imgElement.onload = resolve));
    }
  
    // Capture the canvas with hidden buttons
    html2canvas(element, { scale: 2, useCORS: true, allowTaint: true }).then((canvas) => {
      // Restore buttons after capture
      buttonContainer.classList.add('block');
      buttonContainer?.classList?.remove('hidden');
      textContainer.classList.remove('hidden');
      svgContainer.classList.add('flex');
      svgContainer.classList.remove('hidden');
    
  
      const link = document.createElement("a");
      link.download = "qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };
  

  

  
  // Function to convert base64 string to Blob
  const base64ToBlob = (base64String) => {
    //Convert base64 string to binary data
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    // Create Blob object from binary data
    const blob = new Blob(byteArrays, { type: 'image/png' });

    return blob;
  };
  
  
  

  return (
    <div className='grid flex-1' ref={pageRef}>
      <div className='col-12 flex-1'>
        <div className='card flex flex-column h-full align-items-center justify-content-center'>
          <div className="mdScreenMaxWidth xlScreenMaxWidth">
            <div id="svgCapture" className='col-12 flex justify-content-center'>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.16675 40.0001C7.16675 21.8762 21.8762 7.16675 40.0001 7.16675C58.1239 7.16675 72.8334 21.8762 72.8334 40.0001C72.8334 58.1239 58.1239 72.8334 40.0001 72.8334C21.8762 72.8334 7.16675 58.1239 7.16675 40.0001ZM18.6465 42.687L30.6132 54.6536C32.1051 56.1455 34.5567 56.153 36.0225 54.6515C36.0233 54.6507 36.0241 54.6498 36.0249 54.649L61.3203 29.3536C62.8156 27.8584 62.8156 25.4418 61.3203 23.9465C59.825 22.4513 57.4085 22.4513 55.9132 23.9465L33.3328 46.5269L24.0536 37.2799C22.5584 35.7846 20.1418 35.7846 18.6465 37.2799C17.1513 38.7751 17.1513 41.1917 18.6465 42.687Z" fill="#106540" stroke="black" />
              </svg>
            </div>
            <p id="textCapture" className="text-2xl text-center">{translate(localeJson, "tem_reg_success_message")}</p>
            <div className="text-center">
              <p className="text-5xl font-bold">{translate(localeJson, "your_family_code")}</p>
            </div>
            <div className="mb-3 text-center">
              <p className="text-5xl font-bold">{family_code}</p>
            </div>
            {isTemp &&(
            <div className="mb-3 text-center">
              <img src={url} width={300} height={300} />
            </div>
            )}
             {isTemp &&(
            <div id="capture" className="mb-3 text-center block grid col-12 successButtonText">
              <Button buttonProps={{
                type: "button",
                buttonClass: "w-full back-button h-5rem border-radius-5rem",
                text: translate(localeJson, 'download'),
                onClick: () => {
                  handleDownload();
                  // downloadImage(baseUrl, 'qr.JPEG');
                },
              }} parentClass={"back-button"}
              />
              {
                showDelete &&
                <Button buttonProps={{
                  type: "button",
                  buttonClass: "w-full delete-button-user h-5rem border-radius-5rem mt-3 border-2",
                  text: translate(localeJson, 'delete'),
                  onClick: () => {

                    let payload = {
                      family_id: regReducer.successData?.data?.familyId
                    }
                    deleteTempFamily(payload,(res)=> {
                      if(res)
                      {
                        dispatch(clearExceptPlaceId())
                        localStorage.setItem("personCountTemp",null)
                        localStorage.setItem('refreshing', "false");
                        localStorage.setItem("tempDataDeleted","true");
                        localStorage.setItem("isSuccess","false");
                        localStorage.setItem("showDelete","false")
                        router.push('/user/temp-person-count')
                      }
                    })
                  },
                }} parentClass={"delete-button-user"}
                />
              }
              <div className="p-error mt-3">
                {translate(localeJson, "qr_notification_message")}
              </div>

            </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
