"use client";
import React, { useState } from "react";
import DynamicLabel from "@/components/Label/dynamicLabel";
import SubSection from "@/components/HelpSettings/subsection";
import TextPlain from "@/components/Input/textPlain";
import ButtonCard from "@/components/HelpSettings/buttonCard";
import FileUploadCard from "@/components/HelpSettings/fileUploadCard";
import IconOutlineBtn from "@/components/Button/iconOutlineBtn";
import PlusButton from "@/components/Icons/plusButton";
import DeleteIcon from "../../../components/Icons/deleteIcon";
import IconBtn from "../../../components/Button/iconBtn";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import dynamic from "next/dynamic";
import Modal from "@/components/Modal/modal";
import intl from "@/utils/locales/jp/jp.json"

const EditorComponent = dynamic(
  () => import("../../../components/HelpSettings/textEditor"),
  {
    ssr: false,
  }
);

export default function Subsection() {
  const [activeButton, setActiveButton] = useState("file");
  const [isAdd, setIsAdd] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const handleAddButton = () => {
    setActiveButton("file"); 
    setIsAdd(true); 
    setSelectedTab(null); 
    setSectionName("");
  };
  function deleteIcon() {
    return <DeleteIcon />;
  }

  const handleActiveButtonChange = (buttonName) => {
    setActiveButton(buttonName);
  };
  function plusIcon() {
    return <PlusButton />;
  }
  const subSectionCard = {
    borderRadius: "9px",
    background: "#FFF",
    boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.10)",
  };
  const HeaderButton = {
    borderRadius: "9px",
    background: "#D9D9D9",
    color: "#717171",
  };
  const [selectedTab, setSelectedTab] = useState(null);
  const [sectionName, setSectionName] = useState("");
  const tabs = ["Ptalkサービス", "サービス 1", "サービス 2", "サービス 3", "サービス 4", "サービス 5", "サービス 6"];

  const handleTabClick = (index) => {
    setSelectedTab(index);
  };
  const handleEditClick = (index) => {
    // Handle edit icon click for the tab at the given index
    setShowModal(!showModal);
  };

  const handleDeleteClick = (index) => {
    // Handle delete icon click for the tab at the given index
    setDeleteModal(!deleteModal);
  };

  const handleFileButtonClick = () => {};
  const [editorValue, setEditorValue] = useState("");

  const handleEditorChange = (content) => {
    setEditorValue(content);
    // Do something with the updated value
    // editorValue
  };
  return (
    <>
      <div className="flex  justify-between mb-2 ">
        <div className="flex items-center">
          <DynamicLabel
            text={intl.help_settings_title}
            alignment="text-center"
            fontSize="text-[22px]"
            fontWeight="font-medium"
            textColor="#000000"
            disabled={false}
          />
        </div>
      </div>
      <div className="md:flex  md:justify-between mb-2 md:items-center">
        <div>
          <button
            style={HeaderButton}
            className=" text-base py-[10px] px-[80.5px] w-full md:w-auto"
          >
            {intl.help_settings_generally_btn}
          </button>
        </div>
        <div className="mt-2 md:mt-[0px]">
          <IconOutlineBtn
            text={intl.help_settings_addition_btn}
            textColor={"text-customBlue"}
            textBold={true}
            py={"py-[9.7px]"}
            px={"px-[57.5px]"}
            icon={() => plusIcon()}
            borderColor={"border-customBlue"}
            onClick={handleAddButton}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:gap-[10px]">
        <div className="lg:hidden flex-row">
          <SubSection
            selected={selectedTab}
            tabs={tabs}
            handleTabClick={handleTabClick}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </div>
        <div className="md:w-3/5 mt-2 md:mt-[0px]">
          <div style={subSectionCard} className="px-3 pb-3 pt-3">
            <TextPlain
              type="text"
              for="subSectionName"
              placeholder=""
              borderRound="rounded-xl"
              padding="p-2"
              focus="focus:outline-none focus:ring-2 focus:ring-customBlue"
              border="border border-gray-300"
              bg="bg-input-color"
              additionalClass="block w-full pl-5 text-base pr-[30px]"
              label={intl.help_settings_addition_subsection_name}
              labelColor="#7B7B7B"
              id="sectionName"
              value={selectedTab!=null ? tabs[selectedTab] : sectionName}
              onChange={setSectionName}
            />
          </div>
          {isAdd && (
            <div className="pt-2 flex justify-center">
              <ButtonCard
                activeButton={activeButton}
                onActiveButtonChange={handleActiveButtonChange}
              />
            </div>
          )}

          {activeButton === "file" && (
            <div className="pt-2">
              <FileUploadCard
                isAdd={isAdd}
                CardHeight={isAdd ? "322px" : "398px"}
                HeaderTitle={
                  isAdd ? intl.help_settings_addition_upload_file : intl.help_settings_addition_service_manual
                }
              />
            </div>
          )}
          {activeButton === "text" && (
            <div
              className="mt-2 flex flex-col"
              style={{
                borderRadius: "9px",
                background: "#FFF",
                boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.10)",
                height: isAdd ? "322px" : "398px",
              }}
            >
              <div className="flex justify-between items-center px-[20px] pt-3 mb-[20px]">
                <div>
                  <DynamicLabel
                    text={intl.help_settings_addition_explanation}
                    alignment="text-center"
                    fontSize="text-[17px]"
                    fontWeight="font-normal"
                    textColor="#7B7B7B"
                    disabled={false}
                  />
                </div>
                <div>
                  <IconBtn
                    textColor={"text-white"}
                    textBold={true}
                    icon={() => deleteIcon()}
                  />
                </div>
              </div>
              <div className="px-[20px] flex-grow">
                <EditorComponent onChange={handleEditorChange} />
              </div>
              <div className="flex justify-end   pb-[16px] px-[20px]">
                <IconLeftBtn
                  text={intl.help_settings_addition_keep}
                  textColor="text-white font-normal text-xl"
                  py="py-[8px] px-[55px]"
                  bgColor="bg-customBlue"
                  textBold={true}
                  rounded="rounded-lg"
                  icon={() => null}
                  onClick={handleFileButtonClick}
                />
              </div>
            </div>
          )}
        </div>
        <div className="hidden lg:block md:w-2/5">
          <SubSection
            selected={selectedTab}
            tabs={tabs}
            handleTabClick={handleTabClick}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </div>
      </div>
      {showModal && (
        <Modal
          height="412px"
          fontSize="text-xl"
          fontWeight="font-semibold"
          textColor="#346595"
          text={intl.help_settings_addition_modal_add}
          modalFooter={()=>{
            return <IconLeftBtn
              text={intl.help_settings_addition_keep}
              textColor={"text-white font-semibold text-sm w-full"}
              py={"py-3"}
              px={"w-[320px]"}
              bgColor={"bg-customBlue"}
              textBold={true}
              icon={() => {
                return null;
              }}
            />
          }}
        >
          <div className="flex flex-col px-[4%]">
            <div className="flex flex-col mt-[20px] mb-[80px]">
              <TextPlain
                type={"text"}
                for={"sectionName"}
                placeholder={""}
                borderRound={"rounded-xl"}
                padding={"p-[10px]"}
                focus={
                  "focus:outline-none focus:ring-2  focus:ring-customBlue "
                }
                border={"border border-gray-300"}
                bg={"bg-input-color "}
                additionalClass={"block w-full pl-5 text-base pr-[30px]"}
                label={intl.help_settings_addition_section_name}
                labelColor={"#7B7B7B"}
                id={"sectionName"}
                value={sectionName}
                onchange={setSectionName}
              />
            </div>
          </div>
        </Modal>
      )}
      {deleteModal && (
        <Modal
          height="412px"
          fontSize="text-xl"
          fontWeight="font-semibold"
          textColor="#346595"
          text={intl.help_settings_addition_delete}
          modalFooter={()=>{
            return <div className=" flex justify-between">
                <div>
                  <IconLeftBtn
                    text={intl.help_settings_addition_modal_cancel}
                    textColor={"text-white font-semibold text-sm w-full"}
                    py={"py-[11px]"}
                    px={"px-[10.5px] md:px-[17.5px]"}
                    bgColor={"bg-customBlue"}
                    textBold={true}
                    icon={() => {
                      return null;
                    }}
                  />
                </div>
                <div>
                  <IconLeftBtn
                    text={intl.help_settings_addition_delete}
                    textColor={"text-white font-semibold text-sm w-full ml-2"}
                    py={"py-[11px]"}
                    px={"px-[30.5px] md:px-[38.5px]"}
                    bgColor={"bg-customBlue"}
                    textBold={true}
                    icon={() => {
                      return null;
                    }}
                  />
                </div>
            </div>
          }}
        >
          <div className="flex flex-col">
            <div className="flex-grow py-[90px] pt-[60px]">
              {intl.help_settings_addition_msg}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
