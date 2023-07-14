"use client";
import React from "react";
import intl from "@/utils/locales/jp/jp.json";
import DynamicLabel from "../../../components/Label/dynamicLabel";
import IconOutlineBtn from "../../../components/Button/iconOutlineBtn";
import AddIcon from "../../../components/Icons/addIcon";
import DataTable from "@/components/DataTable/DataTable";
import { helpSettingsData, tableDefaultPageSizeOption } from "@/utils/constant";
import SectionDeleteIcon from "@/components/Icons/sectionDelete";
import SectionEditIcon from "@/components/Icons/sectionEditIcon";
import Modal from "@/components/Modal/modal";
import TextPlain from "@/components/Input/textPlain";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import { useRouter } from "next/navigation";

export default function HelpSettingsList() {
  const router = useRouter();
  const helpSettingsColumns = [
    {
      title:intl.helpSettingsList_section_label,
      dataIndex: "section",
      render: (text) => <a>{text}</a>,
      width: "30%",
    },
    {
      title:intl.helpSettingsList_Subsection_label,
      dataIndex: "numberOfSubsections",
      render: (text) => (
        <a className="float-left pl-2" style={{ paddingRight: "10px" }}>
          {text}
        </a>
      ),
      width: "30%",
    },
    {
      title: "",
      dataIndex: "deleteEdit",
      render: (text, record) => (
        <div style={{ marginLeft: "10%", marginRight: "5%" }}>
          <p className="flex">
            <span
              data-testid={`edit`}
              className="ml-[25px] cursor-pointer rounded-full px-3 py-2"
              onClick={(event) => {
                event.stopPropagation();
                handelEdit(record);
              }}
              style={{ background: "#EDF2F5" }}
            >
              <SectionEditIcon />
            </span>
            <span
              data-testid={`delete`}
              className="ml-[50px] cursor-pointer rounded-full px-3 py-2"
              onClick={(event) => {
                event.stopPropagation();
                handelDelete(record);
              }}
              style={{ background: "#EDF2F5" }}
            >
              <SectionDeleteIcon />
            </span>
          </p>
        </div>
      ),
    },
  ];

  const [columns, setColumns] = React.useState(helpSettingsColumns);
  const [editModal, setEditModal] = React.useState(false);
  const [editSettings, setEditSettings] = React.useState("グループ");
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [addModal, setAddModal] = React.useState(false);

  function editIcon(flag) {
    return <AddIcon isMobile={flag} />;
  }

  function handelEdit(record) {
    setEditModal(() => false);
    setAddModal(() => false);
    setTimeout(() => {setEditModal(() => true);}, 500);
  }

  function handelDelete(record) {
    setDeleteModal(() => true);
  }

  function addHandler(){
    setTimeout(() => {setAddModal(() => true);}, 500);
  }

  return (
    <>
      <div>
        <div className="flex  justify-between mb-2 xl:mb-2 ">
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
          <div className="flex ">
            <IconOutlineBtn
              text={intl.help_settings_addition_btn}
              textColor={"text-customBlue"}
              textBold={true}
              py={"xl:py-2.5 md:py-1.5 py-1.5"}
              px={"xl:px-[47px] md:px-[48.5px] px-[48.5px]"}
              icon={() => editIcon(false)}
              borderColor={"border-customBlue"}
              onClick={async() => {
                await setEditModal(() => false);
                await setAddModal(() => false);
                await addHandler();
              }}
            />
          </div>
        </div>
        <div className="mb-[20px]" style={{ width: "100%" }}>
          <DataTable
            columns={columns}
            dataSource={helpSettingsData}
            onSelectRow={(tableData) => {
              return tableData;
            }}
            defaultPaeSizeOptions={tableDefaultPageSizeOption}
            defaultValue={1}
            onRowClick={(row, rowIndex) => {
              router.push("/help-settings/sub-section");
            }}
          />
        </div>
        {(editModal || addModal) && (
          <Modal
            height="412px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={addModal ? "セクションを追加" : intl.help_settings_addition_modal_edit}
            onCloseHandler={setEditModal}
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
                  onClick={() => {
                    setEditModal(() => false);
                    setAddModal(() => false);
                  }}
                />
            }}
          >
            <div className="flex flex-col px-[4%]">
              <div className="flex flex-col mt-[20px] mb-[80px]">
                <TextPlain
                  type={"text"}
                  for={"editSettings"}
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
                  id={"editSettings"}
                  value={addModal ? "" : editSettings}
                  onChange={setEditSettings}
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
            onCloseHandler={setDeleteModal}
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
                      onClick={() => {
                        setDeleteModal(() => false);
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
                      onClick={() => {
                        setDeleteModal(() => false);
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
      </div>
    </>
  );
}
