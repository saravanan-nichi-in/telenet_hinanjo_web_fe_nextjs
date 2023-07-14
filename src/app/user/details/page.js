"use client";

import { useState } from "react";
import DynamicLabel from "../../../components/Label/dynamicLabel";
import EditIcon from "@/components/Icons/editIcon";
import TitleUserCard from "@/app/user/components/titleUserCard";
import ActionButton from "@/app/user/components/actionButton";
import { useRouter } from "next/navigation";
import intl from "@/utils/locales/jp/jp.json"
function DetailsBackground({ info, styles }) {
  return (
    <>
      <div
        className="text-[#C6C3C3] rounded-[9px] bg-[#F2FAFF] py-2 px-5"
        style={styles}
      >
        {info}
      </div>
    </>
  );
}

export default function UserDetails() {
  const routerPath = useRouter();
  const [userDetails, setUserDetails] = useState({
    userId: "dsdsdsd",
    radioNumber: "237623623",
    companyName: "会社名",
    companyAddress: "asas",
    designation: "会社の住所",
    email: "asasnas@abc.test",
    phone: "9876123456",
    currentAddress:"lorem"
  });

  return (
    <>
      <div className="flex justify-between mb-4 mt-2">
        <div></div>
        <TitleUserCard title={intl.user_details_screem_label} />
        <div
          className="bg-customBlue h-8 w-8 rounded-lg flex items-center justify-center"
          onClick={() => routerPath.push("/user/edit")}
        >
          <EditIcon fill="#ffffff" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:gap-x-4">
        <div className="w-full md:w-1/2 ">
          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.user_userId_label}
                textColor="#7B7B7B"
                className="mb-2"
                htmlFor="userId"
              />
            </div>
            <DetailsBackground info={intl.user_userId_label} />
          </div>
          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.company_list_company_radioNumber}
                textColor="#7B7B7B"
                className="mb-2"
                htmlFor="radioNumber"
              />
            </div>
            <DetailsBackground info={userDetails.radioNumber} />
          </div>

          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.form_component_company_name_label}
                textColor="#7B7B7B"
                className="mb-2"
                htmlFor="companyName"
              />
            </div>
            <DetailsBackground info={userDetails.companyName} />
          </div>

          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.user_details_company_address}
                textColor="#7B7B7B"
                className="mb-2"
                htmlFor="companyAddress"
              />
            </div>
            <DetailsBackground
              info={userDetails.companyAddress}
              styles={{
                height: "max-content",
                maxHeight: "auto",
                minHeight: "143px",
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.user_add_specify_label}
                textColor="#7B7B7B"
                className="mb-2"
              />
            </div>
            <DetailsBackground info={userDetails.designation} />
          </div>

          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.user_email_id_label}
                textColor="#7B7B7B"
                className="mb-2"
              />
            </div>
            <DetailsBackground info={userDetails.email} />
          </div>

          <div className="mb-4">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.user_add_telephone_number_label}
                textColor="#7B7B7B"
                className="mb-2"
              />
            </div>
            <DetailsBackground info={userDetails.phone} />
          </div>

          <div className="mb-8">
            <div className="mb-1">
              <DynamicLabel
                fontSize="text-base"
                text={intl.user_details_company_address}
                textColor="#7B7B7B"
                className="mb-2"
                htmlFor="companyAddress"
              />
            </div>
            <DetailsBackground
              info={userDetails.currentAddress}
              styles={{
                height: "max-content",
                maxHeight: "auto",
                minHeight: "143px",
              }}
            />
          </div>
          <div className="mb-4">
            <ActionButton title={intl.user_details_password_reset_btn} />
          </div>
        </div>
      </div>
    </>
  );
}
