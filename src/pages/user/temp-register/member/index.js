import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPlaceId } from "@/redux/tempRegister";
import {
    TempRegisterServices,
    CommonServices,
  } from "@/services";
  import { LayoutContext } from "@/layout/context/layoutcontext";
import family from "@/redux/family";
export default function Member() {
    const { locale} = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const regReducer = useAppSelector((state) => state.tempRegisterReducer);

    useEffect(() => {
        const place_id = regReducer.placeId;
        const successData = regReducer.successData;
        const queryParams = new URLSearchParams(window.location.search);
        let key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
        let decryptedData = queryParams ? CommonServices.decrypt(queryParams.get('hinan'), key) : "";
        decryptedData && dispatch(setPlaceId(decryptedData))
        if ((place_id == "" && decryptedData == "") || (!place_id && !decryptedData)) {
          router.push("/user/list");
          return;
        }
        if (successData?.data?.familyCode) {
          let payload = {
            family_code:successData?.data?.familyCode
          }
          TempRegisterServices.isRegistered(payload,(res)=>
        {
          if(res)
          {
            let data = res.data;
            if(data?.isRegistered == "0")
            {
              localStorage.setItem("showDelete","true")
              router.push('/user/temp-register/success')
            }
            else {
              localStorage.setItem("showDelete","false")
              router.push('/user/temp-person-count')
            }
          }
        })
         
        }
        else {
            localStorage.setItem("showDelete","false")
            router.push('/user/temp-person-count')
        }
        return
      }, [locale]);
}