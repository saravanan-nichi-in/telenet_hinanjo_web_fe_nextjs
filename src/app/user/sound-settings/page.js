"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import DynamicLabel from "../../../components/Label/dynamicLabel";
import HeaderTabOption from "@/components/Icons/headerTabOptions";
import Progress from "@/components/Input/progress";
import ToggleBoxMedium from "@/components/Input/toggleBoxMedium";
import { useEffect } from "react";
import TitleUserCard from "../components/titleUserCard";
import ActionButton from "../components/actionButton";
import intl from "@/utils/locales/jp/jp.json";
export default function UserDetails() {
  const [progressBarPtt, setProgressBarPtt] = useState(0);
  const [progressBarNotification, setProgressBarNotification] = useState(0);

  const userInfo = {
    pttNotificationVolume: 0,
    notificationVolume: 0,
    notificationSound: "",
    replyTone: "",
    toneRepeatSettings: "",
    vibrateOnRequestReceived: true,
    vibrationOnPtt: "",
  };
  const user = {
    userId: "",
    radioNumber: "",
    companyName: "",
    designation: "",
    email: "",
    phone: "",
    currentAddress: "",
  };

  const [userDetails, setUserDetails] = useState({
    userId: "",
    radioNumber: "",
    companyName: "",
    designation: "",
    email: "",
    phone: "",
    currentAddress: "",
  });

  const [userDetailsInfo, setUserDetailsInfo] = useState({
    pttNotificationVolume: 0,
    notificationVolume: 0,
    notificationSound: "",
    replyTone: "",
    toneRepeatSettings: "",
    vibrateOnRequestReceived: true,
    vibrationOnPtt: "",
  });

  useEffect(() => {
    let obj = { ...userDetailsInfo };
    obj.pttNotificationVolume = progressBarPtt;
    setUserDetailsInfo((prev) => ({ ...obj }));
  }, [progressBarPtt]);

  useEffect(() => {
    let obj = { ...userDetailsInfo };
    obj.notificationVolume = progressBarNotification;
    setUserDetailsInfo((prev) => ({ ...obj }));
  }, [progressBarNotification]);

  function reset() {
    setUserDetailsInfo(userInfo);
  }
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_sound_settings_screen_label} />
      </div>
      <div className="flex justify-end mb-2">
        <button className=" text-customBlue font-bold" onClick={() => reset()}>
        {intl.user_band_settings_reset_btn_label}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4">
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <DynamicLabel
              text={intl.user_quick_ptt_notification_volume}
              textColor="#7B7B7B"
              htmlFor="userId"
            />
            <div className="bg-input-gray py-3 pt-2 px-4 rounded-lg">
              <Progress value={progressBarPtt} setValue={setProgressBarPtt} />
            </div>
          </div>
          <div className="mb-4">
            <DynamicLabel
              text={intl.user_sound_settings_notifcation_volume}
              textColor="#7B7B7B"
              htmlFor="userId"
            />
            <div className="bg-input-gray py-3 pt-2 px-4 rounded-lg">
              <Progress
                value={progressBarNotification}
                setValue={setProgressBarNotification}
              />
            </div>
          </div>

          <div className="mb-4">
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
              id={"notificationSound"}
              labelColor={"#7B7B7B"}
              label={intl.user_sound_settings_select_ptt_notication_sound}
              value={userDetailsInfo.notificationSound}
              onChange={(notificationSound) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ notificationSound: notificationSound },
                });
              }}
            />
          </div>

          <div className="mb-4">
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
              id={"replyTone"}
              labelColor={"#7B7B7B"}
              label={intl.user_sound_settings_reply_tone}
              value={userDetailsInfo.replyTone}
              onChange={(replyTone) => {
                setUserDetailsInfo({
                  ...userDetailsInfo,
                  ...{ replyTone: replyTone },
                });
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col ">
          <div className="">
            <div className="mb-4 md:mb-9">
              <DropdownMedium
                borderRound={"rounded-xl"}
                padding={"py-[13px] pr-[120px]"}
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
                label={intl.user_sound_settings_tone_repeat}
                value={userDetailsInfo.toneRepeatSettings}
                onChange={(toneRepeatSettings) => {
                  setUserDetailsInfo({
                    ...userDetailsInfo,
                    ...{ toneRepeatSettings: toneRepeatSettings },
                  });
                }}
              />
            </div>
            <div className="mb:4 md:mb-10 ">
              <div className="bg-input-gray py-3 pl-4 rounded-xl">
                <ToggleBoxMedium
                  toggle={userDetailsInfo.vibrateOnRequestReceived}
                  setToggle={(vibrateOnRequestReceived) => {
                    setUserDetailsInfo({
                      ...userDetailsInfo,
                      ...{
                        vibrateOnRequestReceived: vibrateOnRequestReceived,
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
            </div>
            <div className="mt-4">
              <div>
              <div className="bg-input-gray py-3 pl-4 rounded-xl">
                <ToggleBoxMedium
                  toggle={userDetailsInfo.vibrationOnPtt}
                  setToggle={(vibrationOnPtt) => {
                    setUserDetailsInfo({
                      ...userDetailsInfo,
                      ...{ vibrationOnPtt: vibrationOnPtt },
                    });
                  }}
                  label={intl.user_sound_settings_vibration_when_receiving_on_ptt}
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
            </div>
            </div>
          </div>
          <div className="mt-4">
            <ActionButton title={intl.user_add_action_btn_label} />
          </div>
        </div>
      </div>
    </>
  );
}
