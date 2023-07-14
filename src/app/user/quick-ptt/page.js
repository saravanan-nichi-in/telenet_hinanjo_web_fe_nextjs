"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import TitleUserCard from "../components/titleUserCard";
import ActionButton from "../components/actionButton";
import intl from "@/utils/locales/jp/jp.json";
export default function OneTouchPtt() {
  const userInfo = {
    pttNotificationVolume: 0,
  };

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    pttNotificationVolume: 0,
  });

  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_quick_ptt_screen_label} />
      </div>
      <div className="flex justify-end mb-2 md:pr-4">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
          {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="w-full mx-auto">
        <div className="w-full md:w-[330px] mx-auto mb-8">
          <div className="mb-8">
            <DropdownMedium
              borderRound={"rounded-xl"}
              padding={"py-3 pr-[120px]"}
              options={[
                { id: 1, value: "1", label: "option 01" },
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
              id={"currentPassword"}
              labelColor={"#7B7B7B"}
              label={intl.user_quick_ptt_notification_volume}
              value={userDetailsInfo.pttNotificationVolume}
              onChange={(pttNotificationVolume) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ pttNotificationVolume: pttNotificationVolume },
                });
              }}
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
