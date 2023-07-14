"use client";

import { useState } from "react";
import ToggleBoxMedium from "@/components/Input/toggleBoxMedium";
import TitleUserCard from "../components/titleUserCard";
import ActionButton from "../components/actionButton";
import intl from "@/utils/locales/jp/jp.json";
export default function UserDetails() {
  const userInfo = {
    isVolumeIncreaseBtn: true,
    isUserSettingsBtn: true,
    isVolumeDecreaseBtn: true,
  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    isVolumeIncreaseBtn: true,
    isUserSettingsBtn: true,
    isVolumeDecreaseBtn: true,
  });

  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_ptt_button_settings_screen_label} />
      </div>
      <div className="flex justify-end mb-2 md:pr-4">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
          {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4">
        <div className="w-full md:w-1/2 md:mb-12">
          <div className="mb-4">
            <div className="bg-input-gray py-3 pl-4 rounded-xl">
              <ToggleBoxMedium
                toggle={userDetailsInfo.isVolumeIncreaseBtn}
                setToggle={(isVolumeIncreaseBtn) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{
                      isVolumeIncreaseBtn: isVolumeIncreaseBtn,
                    },
                  });
                }}
                label={intl.user_ptt_button_settings_volume_up}
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
                additionalClass={" "}
                labelClass={
                  "text-sm font-medium text-gray-900 dark:text-gray-300"
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-input-gray py-3 pl-4 rounded-xl">
              <ToggleBoxMedium
                toggle={userDetailsInfo.isUserSettingsBtn}
                setToggle={(isUserSettingsBtn) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{
                      isUserSettingsBtn: isUserSettingsBtn,
                    },
                  });
                }}
                label={intl.user_ptt_button_settings_user_setting_btn}
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
                additionalClass={" "}
                labelClass={
                  "text-sm font-medium text-gray-900 dark:text-gray-300"
                }
              />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:justify-between">
          <div className="mb-4">
            <div className="bg-input-gray py-3 pl-4 rounded-xl">
              <ToggleBoxMedium
                toggle={userDetailsInfo.isVolumeDecreaseBtn}
                setToggle={(isVolumeDecreaseBtn) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{
                      isVolumeDecreaseBtn: isVolumeDecreaseBtn,
                    },
                  });
                }}
                label={intl.user_ptt_button_settings_volume_down}
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
                additionalClass={" "}
                labelClass={
                  "text-sm font-medium text-gray-900 dark:text-gray-300"
                }
              />
            </div>
          </div>

          <div className="mb-0">
            <ActionButton title={intl.help_settings_addition_keep} />
          </div>
        </div>
      </div>
    </>
  );
}
