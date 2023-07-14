"use client";
import React, { useState } from "react";
import DynamicLabel from "@/components/Label/dynamicLabel";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import TextPlain from "@/components/Input/textPlain";
import DropdownMedium from "@/components/Input/dropdownMedium";
import IconRight from "@/components/Input/iconRight";
import PasswordTickIcon from "@/components/Icons/passwordTick";
import Breadcrumb from "@/components/Layout/breadcrumb";
export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [selectedOption, setOption] = useState("");

  const cardStyle = {
    background: "#FFFFFF",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "9px",
  };
  const handleSave = (event) => {
    event.preventDefault();
    /**password, selectedOption */
    // Perform further actions with the input values
  };
  function passwordTick(flag) {
    return <PasswordTickIcon />;
  }
  const links = [
    { title: "ダッシュボード", link: "#" },
    { title: "パスワードを変更", link: "/dashboard/update-password" },
  ];
  return (
    <>
      <div className="mb-[38px]">
        <Breadcrumb links={links} />
      </div>
      <div className="flex justify-between mb-[20px] xl:mb-[44px] ">
        <div className="flex items-center">
          <DynamicLabel
            text="パスワードを変更"
            alignment="text-center"
            fontSize="text-2xl"
            fontWeight="font-medium"
            textColor="#000000"
            disabled={false}
          />
        </div>
      </div>
      <div
        style={cardStyle}
        className="pt-[37px] p-[20px] md:px-[60px]  xl:px-[80px] xl:pt-[50px] xl:pb-[40px]"
      >
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-12 lg:gap-y-8 lg:gap-x-24 "
        >
          <div data-testid="dropdown-medium" className="flex flex-col">
            <DropdownMedium
              borderRound={"rounded-xl"}
              value={selectedOption}
              onChange={setOption}
              padding={"pt-[10px] pb-[10px] pr-[120px]"}
              options={[
                { id: 1, value: "1", label: "option 01" },
                { id: 2, value: "2", label: "option 02" },
                { id: 3, value: "3", label: "option 03" },
                { id: 4, value: "4", label: "option 04" },
              ]}
              key={"value"}
              optionLabel={"label"} // From options array
              border={"border border-gray-300"}
              focus={"focus:outline-none focus:ring-2  focus:ring-customBlue"}
              bg={"bg-input-color"}
              text={"text-base"}
              additionalClass={"block w-full pl-5"}
              id={"userId"}
              labelColor={"#7B7B7B"}
              label={"ユーザーID"}
            >
              {" "}
            </DropdownMedium>
          </div>
          <div className="flex flex-col">
            <TextPlain
              type={"text"}
              for={"newPassword"}
              value={password}
              onChange={setPassword}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px]"}
              focus={"focus:outline-none focus:ring-2  focus:ring-customBlue "}
              border={"border border-gray-300"}
              bg={"bg-input-color "}
              additionalClass={"block w-full pl-5 text-base pr-[30px]"}
              label={"新しいパスワード"}
              labelColor={"#7B7B7B"}
              id={"newPassword"}
            />
          </div>
          <div className="flex flex-col ">
            <IconRight
              icon={() => passwordTick()}
              placeholder={""}
              borderRound={"rounded-xl"}
              padding={"p-[10px]"}
              label={"現在のパスワード"}
              labelColor={"#7B7B7B"}
              labelClass={
                "mb-2 text-sm font-medium text-gray-900 dark:text-white"
              }
              bg={"bg-input-color"}
              border={"border border-gray-300"}
              focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
              text={"text-base text-gray-900"}
              additionalClass={
                "bg-input-color block w-full pl-5 text-base pr-[30px]"
              }
            />
          </div>
          <div className="flex flex-col">
            <TextPlain
              type={"text"}
              placeholder={""}
              for={"passwordConfirmation"}
              borderRound={"rounded-xl"}
              padding={"p-[10px]"}
              focus={"focus:outline-none focus:ring-2  focus:ring-customBlue "}
              border={"border border-gray-300"}
              bg={"bg-input-color "}
              additionalClass={"block w-full pl-5 text-base pr-[30px]"}
              label={"パスワードを認証する"}
              labelColor={"#7B7B7B"}
              id={"Id"}
            />
          </div>
          <div className="flex flex-col"></div>
          <div className=" flex justify-end xl:mt-12 xl:mb-[30px]">
            <IconLeftBtn
              text={"保存"}
              type="submit"
              textColor={"text-white font-semibold text-sm w-full"}
              py={"py-3.5"}
              bgColor={"bg-customBlue"}
              textBold={true}
              icon={() => {
                return null;
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
}
