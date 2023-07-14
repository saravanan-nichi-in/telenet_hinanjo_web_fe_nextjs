"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import ToggleBoxMedium from "@/components/Input/toggleBoxMedium";
import DynamicLabel from "@/components/Label/dynamicLabel";
import Medium from "@/components/Input/medium";
import TitleUserCard from "../components/titleUserCard";
import ActionButton from "../components/actionButton";
import intl from "@/utils/locales/jp/jp.json";
export default function UserDetails() {

  const userInfo = {
    isRecordingSettings: true,
    saveFirst: "1",
    recordedFileSize: "1",
    recordedFileStorageLocation: "",

  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    isRecordingSettings: true,
    saveFirst: "1",
    recordedFileSize: "1",
    recordedFileStorageLocation: "/storage/emulated/0/ptalk/REC/",
  });


  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <div className="text-customBlue font-bold  mb-4">{intl.user_voice_recording_screen_label}</div>
        <TitleUserCard title={intl.user_voice_recording_screen_label} />

      </div>
      <div className="flex justify-end mb-2">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
          {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4">
        <div className="w-full md:w-1/2">
          <div className="mb-8">
            <DropdownMedium
              borderRound={"rounded-xl"}
              padding={"py-3 pr-[120px]"}
              options={[
                { id: 1, value: "1", label: "Internal" },
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
              id={"saveFirst"}
              labelColor={"#7B7B7B"}
              label={intl.user_sos_destination_label}
              value={userDetailsInfo.saveFirst}
              onChange={(saveFirst) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ saveFirst: saveFirst },
                });
              }}
            />
          </div>
          <div className="mb-8 md:pt-6">
            <div className="bg-input-gray py-3 pl-4 rounded-xl">

              <ToggleBoxMedium
                toggle={userDetailsInfo.isRecordingSettings}
                setToggle={(isRecordingSettings) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{
                      isRecordingSettings: isRecordingSettings,
                    },
                  });
                }}
                label={intl.user_voice_recording_setting_label}
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
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:justify-center">
          <div className="mb-8">
            <div className="mb-4">
              <DropdownMedium
                borderRound={"rounded-xl"}
                padding={"py-3 pr-[120px]"}
                options={[
                  { id: 1, value: "1", label: "200MB" },
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
                id={"recordedFileSize"}
                labelColor={"#7B7B7B"}
                label={intl.user_voice_recording_storage_label}
                value={userDetailsInfo.recordedFileSize}
                onChange={(recordedFileSize) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{ recordedFileSize: recordedFileSize },
                  });
                }}
              />
            </div>
            <div className="mb-0">
            <DynamicLabel text={intl.user_voice_recording_storage_location} textColor="#7B7B7B" htmlFor="recordedFileStorageLocation" />
            <Medium
              id="recordedFileStorageLocation"
              type={"text"}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-3"}
              focus={"focus:outline-none"}
             border={"border border-gray-400"}
              bg={"bg-[#f2f2f2]"}
              additionalClass={"block w-full pl-5 text-sm pr-[30px] text-[#C7C7C7]"}
              value={userDetailsInfo.recordedFileStorageLocation}
              onChange={(recordedFileStorageLocation) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ recordedFileStorageLocation: recordedFileStorageLocation },
                });
              }}
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
