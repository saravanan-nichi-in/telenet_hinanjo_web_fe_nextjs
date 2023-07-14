"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import ToggleBoxMedium from "@/components/Input/toggleBoxMedium";
import TitleUserCard from "@/app/user/components/titleUserCard";
import ActionButton from "@/app/user/components/actionButton";
import intl from "@/utils/locales/jp/jp.json"

export default function UserDetails() {
  const userInfo = {
    isBluetoothPressed: true,
    isDIMMode: true,
    screenOnPtt: "1",
    basicScreen: "1",
  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    isBluetoothPressed: true,
    screenOnPtt: "1",
    isDIMMode: true,
    basicScreen: "1",
  });

  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_display_settings_screen_label} />
      </div>
      <div className="flex justify-end mb-2 ">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
          {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4 ">
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <div className="bg-input-gray py-2.5 pr-2 pl-4 rounded-xl">
              <ToggleBoxMedium
                toggle={userDetailsInfo.isBluetoothPressed}
                setToggle={(isBluetoothPressed) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{
                      isBluetoothPressed: isBluetoothPressed,
                    },
                  });
                }}
                label={intl.user_display_settings_bluetooth_label}
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
                additionalClass={"ml-[100px]  text-xs "}
                labelClass={
                  "text-xs font-medium text-gray-900 dark:text-gray-300"
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <DropdownMedium
              borderRound={"rounded-xl"}
              padding={"py-3 pr-[120px]"}
              options={[
                { id: 1, value: "1", label:intl.user_display_settings_onptt_calls_option1},
                { id: 2, value: "2", label: "option 02" },
                { id: 3, value: "3", label: "option 03" },
                { id: 4, value: "4", label: "option 04" },
              ]}
              keys={"value"} // From options array
              optionLabel={"label"} // From options array
             border={"border border-gray-400"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
               bg=""
              text={"text-sm"}
              additionalClass={"block w-full px-4"}
              id={"screenOnPtt"}
              labelColor={"#7B7B7B"}
              label={intl.user_display_settings_screenSwitching}
              value={userDetailsInfo.screenOnPtt}
              onChange={(screenOnPtt) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ screenOnPtt: screenOnPtt },
                });
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:justify-between">
          <div className="mb-4">
            <div className="bg-input-gray py-2.5 pl-4 rounded-xl">
              <ToggleBoxMedium
                toggle={userDetailsInfo.isDIMMode}
                setToggle={(isDIMMode) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{
                      isDIMMode: isDIMMode,
                    },
                  });
                }}
                label={intl.user_display_settings_dimMode}
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
                additionalClass={"ml-[100px] "}
                labelClass={
                  "text-sm font-medium text-gray-900 dark:text-gray-300"
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="">
              <DropdownMedium
                borderRound={"rounded-xl"}
                padding={"py-[13px] pr-[120px]"}
                options={[
                  { id: 1, value: "1", label:intl.user_display_settings_home_option1 },
                  { id: 2, value: "2", label: "option 02" },
                  { id: 3, value: "3", label: "option 03" },
                  { id: 4, value: "4", label: "option 04" },
                ]}
                keys={"value"} // From options array
                optionLabel={"label"} // From options array
               border={"border border-gray-400"}
                focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
                 bg=""
                text={"text-sm"}
                additionalClass={"block w-full px-4"}
                id={"basicScreen"}
                labelColor={"#7B7B7B"}
                label={intl.user_display_settings_basicScreen}
                value={userDetailsInfo.basicScreen}
                onChange={(basicScreen) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{ basicScreen: basicScreen },
                  });
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <ActionButton title={intl.help_settings_addition_keep} />
          </div>
        </div>
      </div>
    </>
  );
}
