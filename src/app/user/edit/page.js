"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import DynamicLabel from "../../../components/Label/dynamicLabel";
import Input from "../../../components/Input/medium";
import HeaderTabOption from "@/components/Icons/headerTabOptions";
import { useEffect } from "react";
import ActionButton from "../components/actionButton";
import TitleUserCard from "../components/titleUserCard";
import intl from "@/utils/locales/jp/jp.json"
export default function UserEdit() {
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
        <TitleUserCard title={intl.user_edit_screen_label} />
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4 ">
        <div className="w-full md:w-1/2">
          <div className="mb-8">
            <DynamicLabel
              text={intl.user_userId_label}
              textColor="#7B7B7B"
              htmlFor="userId"
            />
            <Input
              id="userId"
              type={"text"}
              placeholder={intl.user_userId_label}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-3"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
             border={"border border-gray-400"}
              bg={"bg-input"}
              additionalClass={"block w-full pl-5 text-sm pr-[30px]"}
              value={userDetails.userId}
              onChange={(name) => {
                setUserDetails({
                  ...userDetails,
                  ...{ userId: name },
                });
              }}
            />
          </div>
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
              bg="bg-input"
              text={"text-sm"}
              additionalClass={"block w-full pl-5"}
              id={"radioNumber"}
              labelColor={"#7B7B7B"}
              label={intl.company_list_company_radioNumber}
              value={userDetails.radioNumber}
              onChange={(radioNo) => {
                setUserDetails({
                  ...userDetails,
                  ...{ radioNumber: radioNo },
                });
              }}
            />
          </div>

          <div className="mb-8">
            <DynamicLabel
              text={intl.form_component_company_name_label}
              textColor="#7B7B7B"
              htmlFor="companyName"
            />
            <Input
              id="companyName"
              type={"text"}
              placeholder={intl.form_component_company_name_label}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-3"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
             border={"border border-gray-400"}
              bg={"bg-input"}
              additionalClass={"block w-full pl-5 text-sm pr-[30px]"}
              value={userDetails.companyName}
              onChange={(companyName) => {
                setUserDetails({
                  ...userDetails,
                  ...{ companyName: companyName },
                });
              }}
            />
          </div>

          <div className="mb-8">
            <DynamicLabel
              text={intl.user_details_company_address}
              textColor="#7B7B7B"
              htmlFor="companyAddress"
            />
            <textarea
              id="companyAddress"
              type={"text"}
              placeholder={intl.user_details_company_address}
              className={
                "rounded-xl p-[10px] py-3 border-none  bg-custom-input block w-full pl-5 text-sm pr-[30px] bg-input focus:outline-none focus:ring-2 focus:ring-customBlue"
              }
              onChange={(companyAddress) => {
                setUserDetails({
                  ...userDetails,
                  ...{ companyAddress: companyAddress },
                });
              }}
              rows={4}
            >
              {userDetails.companyAddress}
            </textarea>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="mb-8">
            <DynamicLabel text={intl.user_add_specify_label} textColor="#7B7B7B" />
            <Input
              type={"text"}
              placeholder={intl.user_add_specify_label}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-3"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
             border={"border border-gray-400"}
              bg={"bg-input"}
              additionalClass={"block w-full pl-5 text-sm pr-[30px]"}
              value={userDetails.designation}
              onChange={(designation) => {
                setUserDetails({
                  ...userDetails,
                  ...{ designation: designation },
                });
              }}
            />
          </div>

          <div className="mb-8">
            <DynamicLabel text={intl.user_email_id_label} textColor="#7B7B7B" />
            <Input
              type={"email"}
              placeholder={intl.user_email_id_label}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-3"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
             border={"border border-gray-400"}
              bg={"bg-input"}
              additionalClass={"block w-full pl-5 text-sm pr-[30px]"}
              testId="content-input-email"
              value={userDetails.email}
              onChange={(email) => {
                setUserDetails({
                  ...userDetails,
                  ...{ email: email },
                });
              }}
            />
          </div>

          <div className="mb-8">
            <DynamicLabel text={intl.user_add_telephone_number_label} textColor="#7B7B7B" />
            <Input
              type={"text"}
              placeholder={intl.user_add_telephone_number_label}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-3"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
             border={"border border-gray-400"}
              bg={"bg-input"}
              additionalClass={"block w-full pl-5 text-sm pr-[30px]"}
              value={userDetails.phone}
              onChange={(phone) => {
                setUserDetails({
                  ...userDetails,
                  ...{ phone: phone },
                });
              }}
            />
          </div>

          <div className="mb-10">
            <DynamicLabel
              text={intl.user_details_company_address}
              textColor="#7B7B7B"
              htmlFor="currentAddress"
            />

            <textarea
              id="currentAddress"
              type={"text"}
              placeholder={intl.user_details_company_address}
              className={
                "rounded-xl p-[10px] py-3 border-none  bg-custom-input block w-full pl-5 text-sm pr-[30px] bg-input focus:outline-none focus:ring-2 focus:ring-customBlue"
              }
              onChange={(currentAddress) => {
                setUserDetails({
                  ...userDetails,
                  ...{ currentAddress: currentAddress },
                });
              }}
              rows={4}
            >
              {userDetails.currentAddress}
            </textarea>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4 ">
        <div className="w-full md:w-1/2">
          <ActionButton title={intl.help_settings_addition_modal_cancel} />
        </div>
        <div className="w-full md:w-1/2">
          <ActionButton title={intl.help_settings_addition_keep} />
        </div>
      </div>
    </>
  );
}
