"use client";
import React from "react";
import DynamicLabel from "@/components/Label/dynamicLabel";
import Upload from "@/components/Input/upload";
import IconOutlineBtn from "@/components/Button/iconOutlineBtn";
import DeleteIcon from "@/components/Icons/deleteIcon";
import IconBtn from "@/components/Button/iconBtn";
import intl from "@/utils/locales/jp/jp.json";
import CompanyForm from "@/components/CompanyInfo/formComponent";
import Breadcrumb from "@/components/Layout/breadcrumb";
import {companyEditLinks} from "@/utils/constant";
import { useRouter } from "next/navigation";
export default function EditCompanyInformation() {
  const cardStyle = {
    background: "#FFFFFF",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "9px",
  };
  function deleteIcon(flag) {
    return <DeleteIcon isMobile={flag} />;
  }
  const initialCompanyName = "ABC Company";
  const initialMailId = "example@mail.com";
  const initialAddress = "123 Main St";
  const initialUserCount = 10;
  const initialDescription = "This is a company description";
  const initialSalesChannel = "Sales Channel"
  const routerPath = useRouter();
  return (
    <>
      <div className="mb-1">
        <Breadcrumb links={companyEditLinks} />
      </div>
      <div className="">
        <div className="flex justify-between mb-2 xl:mb-2">
          <div className="flex items-center">
            <DynamicLabel
              text={intl.edit_screen_label}
              alignment="text-center"
              fontSize="text-[22px]"
              fontWeight="font-medium"
              textColor="#000000"
              disabled={false}
            />
          </div>
        </div>
        <div
          style={cardStyle}
          className="pt-2 p-3 md:px-[60px]  xl:px-[80px] xl:pt-2 pb-[40px]"
        >
          <div className="flex justify-center">
            <Upload edit={true} />
          </div>
          <div className="mt-5 mb-6">
            <hr />
          </div>
          <CompanyForm
            initialCompanyName={initialCompanyName}
            initialMailId={initialMailId}
            initialAddress={initialAddress}
            initialUserCount={initialUserCount}
            initialSalesChannel={initialSalesChannel}
            initialDescription={initialDescription}
            isForm={true}
            isRequired={true}
            routerPath={routerPath}
          ></CompanyForm>
        </div>
      </div>
    </>
  );
}
