import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { showOverFlow, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ButtonRounded, FamilyListComponent } from "@/components";
import { useAppDispatch } from "@/redux/hooks";
import { reset } from "@/redux/qr_app";
import { reset as clear } from "@/redux/tempRegister"
import { UserQrService } from "@/services";

const SearchDetails = () => {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const qrAppReducer = useSelector((state) => state.qrAppReducer);
  const dispatch = useAppDispatch();

  const { create } = UserQrService;

  let data = qrAppReducer?.checkInData || [];

  let family_id = data.length > 0 ? data[0].family_id : "";

  let place_id = data.length > 0 ? data[0].place_id : "";

  const isCheckedIn = (res) => {
    if(res)
    {
    localStorage.setItem("tempDataDeleted","true")
    localStorage.setItem("isSuccess","false");
    dispatch(clear());
    dispatch(reset())
    setLoader(false);
     router.push("/user/qr/app");
    }
  };

  useEffect(() => {
    showOverFlow();
  }, [locale]);

  return (
    <div className="flex justify-content-center">
      <div className="m-2 w-full xlScreenMaxWidth mdScreenMaxWidth">
        {data?.length > 0 && (
          <>
            <FamilyListComponent
              data={data}
              header={translate(localeJson, "reg_confirm")}
            />
            <div className="flex flex-column justify-content-center align-items-center">
              <div className="w-12 lg:w-6">
                <ButtonRounded
                  buttonProps={{
                    buttonClass: "w-full h-3rem primary-button",
                    type: "submit",
                    rounded: "true",
                    text: translate(localeJson, "admission_button"),
                    onClick: () => {
                      let payload = {
                        family_id: family_id,
                        place_id: place_id,
                      };
                      setLoader(true);
                      create(payload, isCheckedIn);
                    },
                  }}
                  parentClass={"w-full  primary-button"}
                />
                <ButtonRounded
                  buttonProps={{
                    type: "button",
                    rounded: "true",
                    custom: "",
                    buttonClass:
                      "back-button w-full custom-icon-button h-3rem flex justify-content-center",
                    text: translate(localeJson, "return"),
                    onClick: () => {
                      dispatch(reset());
                      router.push("/user/qr/app");

                    },
                  }}
                  parentClass={
                    "back-button w-full flex justify-content-center mt-3  mb-3 lg:mb-0"
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchDetails;