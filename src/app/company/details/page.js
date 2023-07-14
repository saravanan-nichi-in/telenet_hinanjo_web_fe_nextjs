"use client";
import React from "react";
import DynamicLabel from "../../../components/Label/dynamicLabel";
import Upload from "../../../components/Input/upload";
import IconOutlineBtn from "../../../components/Button/iconOutlineBtn";
import DeleteIcon from "../../../components/Icons/deleteIcon";
import EditIcon from "../../../components/Icons/editIcon";
import IconBtn from "../../../components/Button/iconBtn";
import CompanyForm from "../../../components/CompanyInfo/formComponent";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Layout/breadcrumb";
import intl from "@/utils/locales/jp/jp.json";
import { companyDetailLinks } from "../../../utils/constant";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import Modal from "@/components/Modal/modal";

export default function CompanyInformation() {
  const router = useRouter();
  const cardStyle = {
    background: "#FFFFFF",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "9px",
  };
  function editIcon(flag) {
    return <EditIcon isMobile={flag} fill="#346595" />;
  }
  function deleteIcon(flag) {
    return <DeleteIcon isMobile={flag} />;
  }
  const initialCompanyName = "ABC Company";
  const initialMailId = "example@mail.com";
  const initialAddress = "123 Main St";
  const initialUserCount = 10;
  const initialDescription = "This is a company description";

  const [deleteModal, setDeleteModal] = React.useState(false);

  function getDeleteModalFooter() {
    return <div className="grid grid-cols-2 gap-2 place-content-center">
              <div>
                <IconLeftBtn
                  text={intl.help_settings_addition_modal_cancel}
                  textColor={"text-white font-semibold text-sm w-full"}
                  py={"py-[11px]"}
                  px={"px-6"}
                  bgColor={"bg-customBlue"}
                  textBold={true}
                  icon={() => {
                    return null;
                  }}
                  onClick={() => {
                    setDeleteModal(() => false);
                  }}
                />
              </div>
              <div>
                <IconLeftBtn
                  text={intl.help_settings_addition_delete}
                  textColor={"text-white font-semibold text-sm w-full"}
                  py={"py-[11px]"}
                  px={"px-6"}
                  bgColor={"bg-customBlue"}
                  textBold={true}
                  icon={() => {
                    return null;
                  }}
                  onClick={() => {
                    setDeleteModal(() => false);
                  }}
                />
              </div>
          </div> 
  }
  
  return (
    <>
      <div className="mb-1">
        <Breadcrumb links={companyDetailLinks} />
      </div>
      <div className="">
        <div className="flex  justify-between mb-2 xl:mb-2 ">
          <div className="flex items-center">
            <DynamicLabel
              text={intl.company_details_company_details}
              alignment="text-center"
              fontSize="text-[22px]"
              fontWeight="font-medium"
              textColor="#000000"
              disabled={false}
            />
          </div>
          <div className="hidden lg:flex items-center">
            <span className="mr-2.5">
              <IconOutlineBtn
                text={intl.company_details_edit}
                textColor={"text-customBlue"}
                textBold={true}
                py={"xl:py-2.5 md:py-1.5"}
                px={"xl:px-[47px] md:px-[48.5px]"}
                icon={() => editIcon(false)}
                borderColor={"border-customBlue"}
                onClick={() => router.push("/company/edit")}
              />
            </span>
            <span data-testid="delete-icon">
              <IconOutlineBtn
                text={intl.company_details_delete}
                textColor={"text-customBlue"}
                textBold={true}
                py={"xl:py-2.5 md:py-1.5"}
                px={"xl:px-[47px] md:px-[48.5px]"}
                icon={() => deleteIcon(false)}
                borderColor={"border-customBlue"}
                onClick={() => {
                  setDeleteModal(() => true);
                }}
              />
            </span>
          </div>
          <div className=" lg:hidden flex">
            <span className="mr-2.5">
              <IconBtn
                textColor={"text-white"}
                textBold={true}
                icon={() => editIcon(true)}
                onClick={() => router.push("company/edit")}
              />
            </span>
            <span>
              <IconBtn
                textColor={"text-white"}
                textBold={true}
                icon={() => deleteIcon(true)}
                onClick={()=>{setDeleteModal(() => true)}}
              />
            </span>
          </div>
        </div>
        <div
          id="cardId"
          style={cardStyle}
          className="pt-2 p-3 md:px-[60px]  xl:px-[80px] xl:pt-2 xl:pb-[40px]"
        >
          <div className="flex justify-center">
            <Upload/>
          </div>
          <div className="mt-2 mb-3">
            <hr />
          </div>
          <CompanyForm
            disabled={true}
            initialCompanyName={initialCompanyName}
            initialMailId={initialMailId}
            initialAddress={initialAddress}
            initialUserCount={initialUserCount}
            initialDescription={initialDescription}
            routerPath={router}
          ></CompanyForm>
        </div>
      </div>
      {deleteModal && (
          <Modal
            height="412px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={intl.help_settings_addition_delete}
            onCloseHandler={setDeleteModal}
            modalFooter={getDeleteModalFooter}
          >
            <div className="flex flex-col">
              <div className="flex-grow py-[50px] pt-[50px] px-6">
                {intl.company_list_company_delete}
              </div>
            </div>
          </Modal>
        )}
    </>
  );
}
