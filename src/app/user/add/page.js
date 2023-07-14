"use client";

import { useState } from "react";
import DropdownMedium from "../../../components/Input/dropdownMedium";
import DynamicLabel from "../../../components/Label/dynamicLabel";
import Input from "../../../components/Input/medium";
import Breadcrumb from "../../../components/Layout/breadcrumb";
import ActionButton from "../components/actionButton";
import {breadUserCrumbLinks} from '@/utils/constant';
import intl from "@/utils/locales/jp/jp.json"
export default function AddUser() {
  const user = {
    userId: "",
    currentPassword: "",
    radioNumber: "",
    designation: "",
    email: "",
    phone: "",
  };
  const [userDetails, setUserDetails] = useState(user);

  return (
    <>
      <div className="mb-8">
        <Breadcrumb links={breadUserCrumbLinks} />
      </div>
      <div className="mb-8 font-bold">{intl.user_add_screen_label}</div>
      <div className="border border-gray-200 rounded-lg shadow flex flex-col md:flex-row gap-x-8  bg-white md:p-16 md:pb-8 max-h-max">
        <div className="md:w-1/2">
          <div className="mb-8">
            <DynamicLabel
              text={intl.user_userId_label}
              textColor="#7B7B7B"
              htmlFor="userId"
            />
            <Input
              id="userId"
              type={"text"}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-[13px]"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
              border={"border border-gray-400"}
              bg=""
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
              bg=""
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
          <div>{userDetails.email}</div>
          <div className="mb-8">
            <DynamicLabel text={intl.user_email_id_label} textColor="#7B7B7B" />
            <Input
              type={"email"}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-[13px]"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
              border={"border border-gray-400"}
              bg=""
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
        </div>
        <div className="md:w-1/2">
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
              text={"text-sm"}
              additionalClass={"block w-full pl-5"}
              id={"currentPassword"}
              labelColor={"#7B7B7B"}
              label={intl.user_add_current_password_label}
              value={userDetails.currentPassword}
              onChange={(currentPassword) => {
                setUserDetails({
                  ...userDetails,
                  ...{ currentPassword: currentPassword },
                });
              }}
            />
          </div>
          <div className="mb-8">
            <DynamicLabel text={intl.user_add_specify_label} textColor="#7B7B7B" />
            <Input
              type={"text"}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-[13px]"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
              border={"border border-gray-400"}
              bg=""
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
          <div className="mb-12">
            <DynamicLabel text={intl.user_add_telephone_number_label} textColor="#7B7B7B" />
            <Input
              type={"text"}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px] py-[13px]"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
              border={"border border-gray-400"}
              bg=""
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
          <div className="mb-8">
            <ActionButton title={intl.user_add_action_btn_label} />
          </div>
        </div>
      </div>
    </>
  );
}
