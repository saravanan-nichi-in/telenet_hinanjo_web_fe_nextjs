"use client";

import { useState } from "react";
import ToggleBoxMedium from "@/components/Input/toggleBoxMedium";
import DynamicLabel from "@/components/Label/dynamicLabel";
import TitleUserCard from "../components/titleUserCard";
import ActionButton from "../components/actionButton";
import intl from "@/utils/locales/jp/jp.json";
export default function OneTouchPtt() {
  const userInfo = {
    useOfPtalk: false,
  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    useOfPtalk: false,
  });

  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
       <TitleUserCard title={intl.user_ptalk_service_screen_label} />
      </div>
      <div className="flex justify-end mb-2 md:pr-4">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
        {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      
      <div className="w-full md:w-[330px] mx-auto">
        <div className="mb-8">
          <DynamicLabel
            htmlFor={"useTalkUse"}
            text={intl.user_ptalk_service_useTalkUse_label}
            textColor={"#7B7B7B"}
            fontSize={"13px"}
            className="mb-2 md:hidden"
          />
          <div className="bg-input-gray py-3 pl-4 rounded-xl mb-8">
            <ToggleBoxMedium
              toggle={userDetailsInfo.useOfPtalk}
              setToggle={(useOfPtalk) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{
                    useOfPtalk: useOfPtalk,
                  },
                });
              }}
              label={intl.user_ptalk_service_vibrate}
              labelColor={"#7B7B7B"}
              id={"Id"}
              onColor={"#1E1E1E"}
              onHandleColor={"#00ACFF"}
              handleDiameter={16}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow={"0px 1px 5px rgba(0, 0, 0, 0.6)"}
              activeBoxShadow={"0px 0px 1px 10px rgba(0, 0, 0, 0.2)"}
              height={10}
              width={27}
              additionalClass={""}
              labelClass={
                "text-sm font-medium text-gray-900 dark:text-gray-300"
              }
            />
          </div>
          <div className="mb-0">
          <ActionButton title={intl.help_settings_addition_keep} />
          </div>
        </div>
      </div>
    </>
  );
}
