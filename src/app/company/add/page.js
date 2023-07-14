"use client";
import React from "react";
import DynamicLabel from "@/components/Label/dynamicLabel";
import CompanyForm from "@/components/CompanyInfo/formComponent";
import Upload from "@/components/Input/upload";
import Breadcrumb from "@/components/Layout/breadcrumb";
import intl from "@/utils/locales/jp/jp.json";
import {companyAddLinks} from "@/utils/constant";
import { useRouter } from "next/navigation";

export default function AddUser() {
  const router = useRouter();
  const cardStyle = {
    background: "#FFFFFF",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "9px",
  };
  
  return (
    <>
      <div className="mb-1">
        <Breadcrumb links={companyAddLinks} />
      </div>
      <div className="">
        <div className="flex  justify-between mb-2 xl:mb-2">
          <div className="flex">
            <DynamicLabel
              text={intl.company_details_company_add}
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
          <div className="mt-2 mb-3">
            <hr />
          </div>
          <CompanyForm isForm={true} isRequired={true} routerPath={router}></CompanyForm>
        </div>
      </div>
    </>
  );
}
