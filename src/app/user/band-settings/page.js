"use client";

import { useState } from "react";
import TitleUserCard from "@/app/user/components/titleUserCard";
import ActionButton from "@/app/user/components/actionButton";
import DropdownMedium from "@/components/Input/dropdownMedium";
import intl from "@/utils/locales/jp/jp.json"
export default function OneTouchPtt() {
  const userInfo = {
    quality: "1",
  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    quality: "1",
  });

  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_band_settings_title_label} />
      </div>
      <div className="flex justify-end mb-2 md:pr-5">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
          {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="w-full md:w-[330px] mx-auto">
        <div className="mb-8">
          <DropdownMedium
            borderRound={"rounded-xl"}
            padding={"py-[13px] pr-[120px]"}
            options={[
              { id: 1, value: "1", label: "高品質 " },
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
            id={"quality"}
            labelColor={"#7B7B7B"}
            label={intl.user_band_settings_quality_label}
            value={userDetailsInfo.quality}
            onChange={(quality) => {
              setUserDetailsInfo({
                ...userDetailsInfo,
                ...{ quality: quality },
              });
            }}
          />
        </div>
        <div className="mb-0">
          <ActionButton title={intl.help_settings_addition_keep} />
        </div>
      </div>
    </>
  );
}
