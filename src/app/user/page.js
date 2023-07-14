"use client";
import React from "react";
import intl from "@/utils/locales/jp/jp.json";
import DynamicLabel from "@/components/Label/dynamicLabel";
import IconOutlineBtn from "../../components/Button/iconOutlineBtn";
import AddIcon from "@/components/Icons/addIcon";
import DataTable from "@/components/DataTable/DataTable";
import { fileName, tableDefaultPageSizeOption, userSearchResult } from "@/utils/constant";
import SectionDeleteIcon from "@/components/Icons/sectionDelete";
import SectionEditIcon from "@/components/Icons/sectionEditIcon";
import Modal from "@/components/Modal/modal";
import TextPlain from "@/components/Input/textPlain";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import ImportIcon from "@/components/Icons/import";
import ExportIcon from "@/components/Icons/exportIcon";
import DropdownMedium from "@/components/Input/dropdownMedium";
import ImportModal from "@/components/ImportModal/importModal";
import GetIconQRCode from "@/components/Icons/qrCode";
import { useRouter } from "next/navigation";


export default function HelpSettingsList() {

  const router = useRouter();
  const fileStyle = { fontWeight: "400", color: "#7B7B7B", fontSize: "12px" };
  const changeLink = { color: "#346595", fontWeight: "700", fontSize: "12px" };
  const companyColumns = [
    {
      title:intl.company_list_company_radioNumber,
      dataIndex: "radioNumber",
      render: (text) => <a className="text-customBlue">{text}</a>,
      width: 120
    },
    {
      title:intl.user_userId_label,
      dataIndex: "numberOfRadioNumber",
      render: (text) => <a className="float-right">{text}</a>,
      width: 110,
    },
    {
      title:intl.user_email_id_label,
      dataIndex: "mangerId",
      render: (text) => <a>{text}</a>,
      width: 130
    },
    {
      title:intl.user_agency_name_label,
      dataIndex: "agencyName",
      render: (text) => <a>{text}</a>,
      width: 100
    },
    {
      title: "",
      dataIndex: "deviceStatus",
      render: (status) => {
        if (status == 1) {
          return (
            <div className={`bg-[#FEB558] h-2 w-2 p-2 rounded-full`}></div>
          );
        }
        if (status == 2) {
          return (
            <div className={`bg-[#D9D9D9] h-2 w-2 p-2 rounded-full`}></div>
          );
        } else {
          return (
            <div className={`bg-[#1AB517] h-2 w-2 p-2 rounded-full`}></div>
          );
        }
      },
      width: "45px",
    },
    {
      title: "スターテス",
      dataIndex: "status",
      render: (text, record) => (
        <div style={{ width: "85px" }} onClick={(event) => {event.stopPropagation();}}>
          <DropdownMedium
            borderRound={"rounded-[5px] cursor-pointer"}
            padding={"pt-[5px] pb-[5px] pl-[10px]"}
            options={[
              { id: 1, value: "1", label: "有効" },

              { id: 2, value: "2", label: "無効" },
            ]}
            keys={"value"} // From options array
            optionLabel={"label"} // From options array
            border={"border border-gray-300"}
            focus={"focus:outline-none focus:ring-2 focus:ring-customBlue"}
            bg={text === "1" ? "bg-customGreen" : "bg-customGray"}
            text={"text-sm text-white"}
            additionalClass={"block w-full"}
            id={"Id"}
            labelColor={"#7B7B7B"}
            label={""}
            value={text}
            disabled={false}
            defaultSelectNoOption
            dropDownIcon={() => {
              return getIconDropDown();
            }}
          />
        </div>
      ),

      width: "120px",
    },
    {
      title: "",
      dataIndex: "deleteEdit",
      render: (text, record) => (
        <div style={{ marginright: "10px" }}>
          <p className="flex">
            <span
              data-testid={`delete`}
              className="ml-[25px] cursor-pointer rounded-full px-3 py-2"
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
      width: 50
    },
  ];

  const [columns, setColumns] = React.useState(companyColumns);
  const [editModal, setEditModal] = React.useState(false);
  const [editSettings, setEditSettings] = React.useState("グループ");
  const [modelToggle, setModelToggle] = React.useState(false);
  const [qrCodeModal, setQrCodeModal] = React.useState(false);
  const [exportModal, setExportModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  function editIcon(flag) {
    return <AddIcon isMobile={flag} />;
  }

  function folderIcon() {
    return (
      <svg
        width="17"
        height="14"
        viewBox="0 0 17 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2449 2.56042C16.6619 2.56042 17 2.89387 17 3.30444V12.959C17 13.37 16.6604 13.7031 16.2449 13.7031H0.755142C0.338107 13.7031 0 13.3696 0 12.959V1.44583C0 1.03562 0.336965 0.703125 0.756551 0.703125H5.57339C5.78143 0.703125 6.04393 0.839675 6.16099 1.01016L7.01354 2.25217C7.13041 2.42229 7.3933 2.56023 7.60113 2.56023L16.2449 2.56042Z"
          fill="#CDCDCD"
        />
      </svg>
    );
  }

  function handelEdit(record) {
    setEditModal(() => true);
  }

  function handelDelete(record) {
    setDeleteModal(() => true);
  }

  function getIconDropDown() {
    return (
      <svg
        width="19"
        height="8"
        viewBox="0 0 19 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.0949 7.60544C9.75231 7.84278 9.29847 7.84278 8.9559 7.60544L1.3299 2.322C0.524184 1.76378 0.919198 0.5 1.89939 0.5L17.1514 0.499999C18.1316 0.499999 18.5266 1.76378 17.7209 2.32199L10.0949 7.60544Z"
          fill="white"
        />
      </svg>
    );
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      //
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  function importHandler () {
    setModelToggle(()=>true);
  }

  function getExportModalFooter(){
    return <IconLeftBtn
      text={"エクスポート"}
      textColor={"text-white font-semibold text-sm w-full"}
      py={"py-[11px]"}
      px={"w-[84%]"}
      bgColor={"bg-customBlue"}
      textBold={true}
      icon={() => {
        return null;
      }}
      onClick={() => {
        setExportModal(() => false);
        setQrCodeModal(() => true);
      }}
    />
  }

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
      <div>
        {modelToggle && (
          <div>
            <ImportModal modelToggle={modelToggle}
              onCloseHandler={setModelToggle}/>
          </div>
        )}
        <div className="flex  justify-between mb-2 xl:mb-2 ">
          <div className="flex items-center ">
            <DynamicLabel
              text={intl.user_screen_label}
              alignment="text-center"
              fontSize="text-[22px]"
              fontWeight="font-medium"
              textColor="#000000"
              disabled={false}
            />
          </div>
          <div className="flex gap-x-2">
            <IconOutlineBtn
              text={intl.company_list_company_import}
              textColor={"text-customBlue"}
              textBold={true}
              py={"xl:py-2 md:py-1.5 py-1.5"}
              px={"xl:px-[32px] md:px-[33.5px] px-[33.5px]"}
              icon={() => <ImportIcon />}
              borderColor={"border-customBlue"}
              onClick={async() => {await setModelToggle(()=>false); await importHandler()}}
            />
            <IconOutlineBtn
              text={intl.company_list_company_export_title}
              textColor={"text-customBlue"}
              textBold={true}
              py={"xl:py-2 md:py-1.5 py-1.5"}
              px={"xl:px-[20px] md:px-[22.5px] px-[22.5px]"}
              icon={() => <ExportIcon />}
              borderColor={"border-customBlue"}
              onClick={() => setExportModal(true)}

            />
            <IconOutlineBtn
              text={intl.user_addUser_label}
              textColor={"text-customBlue"}
              textBold={true}
              py={"xl:py-2 md:py-1.5 py-1.5"}
              px={"xl:px-[32.5px] md:px-[22.5px] px-[22.5px]"}
              icon={() => editIcon(false)}
              borderColor={"border-customBlue"}
              onClick={() => router.push("/user/add")}
            />
          </div>
        </div>
        <div className="mb-[20px] relative" style={{ width: "100%" }}>
          <DataTable
            rowSelectionFlag
            columns={columns}
            dataSource={userSearchResult}
            onSelectRow={(tableData) => {
              return tableData;
            }}
            defaultPaeSizeOptions={tableDefaultPageSizeOption}
            defaultValue={1}
            onRowClick={(row, rowIndex) => {
              router.push("/user/details");
            }}
          />
        </div>
        {editModal && (
          <Modal
            height="412px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={intl.help_settings_addition_modal_edit}
            onCloseHandler={setEditModal}
          >
            <div className="flex flex-col">
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
                  value={editSettings}
                  onChange={setEditSettings}
                />
              </div>
              <div>
                <div className=" flex justify-end">
                  <IconLeftBtn
                    text={intl.help_settings_addition_keep}
                    textColor={"text-white font-semibold text-sm w-full"}
                    py={"py-3"}
                    bgColor={"bg-customBlue"}
                    textBold={true}
                    icon={() => {
                      return null;
                    }}
                    onClick={() => {
                      setEditModal(() => false);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}

        {qrCodeModal && (
          <Modal
            height="auto"
            fontSize="text-xl"
            textColor="#346595"
            text={intl.company_list_company_qrCode}
            onCloseHandler={setQrCodeModal}
          >
            <div className="flex flex-col mb-3">
              <div className="flex-grow mb-8">
                <center>{GetIconQRCode()}</center>
              </div>
                
              <div className="flex gap-x-3 py-5">
                <div>
                  <IconLeftBtn
                    text="キャンセル"
                    textColor={"text-white font-semibold text-sm w-full rounded-lg"}
                    py={"py-2"}
                    px={"px-[10.5px] md:px-[17.5px]"}
                    bgColor={"bg-customBlue"}
                    textBold={true}
                    icon={() => {
                      return null;
                    }}
                    onClick={() => {
                      setQrCodeModal(() => false);
                    }}
                  />
                </div>
                <div>
                  <IconLeftBtn
                    text="ダウンロード"
                    textColor={"text-white font-semibold text-sm w-full rounded-lg"}
                    py={"py-2"}
                    px={"px-[10.5px] md:px-[17.5px]"}
                    bgColor={"bg-customBlue"}
                    textBold={true}
                    icon={() => {
                      return null;
                    }}
                    onClick={() => {
                      setQrCodeModal(() => false);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
      
        {exportModal && (
          <Modal
              height="500px"
              fontSize="text-xl"
              fontWeight="font-semibold"
              textColor="#346595"
              text={intl.company_list_company_export_title}
              onCloseHandler={setExportModal}
              contentPaddingTop="pt-1"
              contentPadding="px-0"
              modalFooter={getExportModalFooter}
            >
              <div className="flex flex-col px-[5%]">
                <div className="flex-grow py-3">
                  <form className="grid grid-cols-1 gap-y-3">
                    <div className="flex flex-col">
                      <TextPlain
                        type="text"
                        for={"id"}
                        placeholder={"ファイル名"}
                        borderRound="rounded-xl"
                        padding="p-[10px]"
                        focus="focus:outline-none focus:ring-2 focus:ring-customBlue"
                        border="border border-gray-300"
                        bg="bg-input-color"
                        additionalClass="block w-full pl-5 text-base pr-[30px]"
                        label={"ファイル名"}
                        labelColor="#7B7B7B"
                        id={"id"}
                        isRequired={true}
                        labelClass={"float-left"}
                      />
                    </div>
                    <div className="flex flex-col">
                      <DropdownMedium
                        borderRound={"rounded-xl"}
                        padding={"pt-[12px] pb-[12px] pr-[120px]"}
                        options={[
                          { id: 1, value: "1", label: "CSV" },
                          { id: 2, value: "2", label: "QR code" },
                        ]}
                        keys={"value"} // From options array
                        optionLabel={"label"} // From options array
                        border={"border border-gray-300"}
                        focus={
                          "focus:outline-none focus:ring-2 focus:ring-customBlue"
                        }
                        bg={"bg-search-custom"}
                        text={"text-sm"}
                        additionalClass={"block w-full pl-5"}
                        id={"Id"}
                        labelColor={"#7B7B7B"}
                        label={"現在のパスワード"}
                        disabled={false}
                        isRequired={true}
                        defaultSelectNoOption
                        labelClass={"float-left"}
                        dropIcon={"70%"}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor={"label-for-address"}
                        className="flex mb-1 text-[15px] font-medium float-left"
                        style={{ color: "#7B7B7B" }}
                      >
                        {"宛先"}
                      </label>
                      <div className="flex flex-row">
                        <div className="basis-none mt-1">{folderIcon()}</div>
                        <div
                          className="basis-none pl-2 mt-[4px]"
                          style={fileStyle}
                        >
                          {fileName}
                        </div>
                        <div
                          className="basis-full float-right cursor-pointer mt-[5px] md:ml-[105px] float-right"
                          style={changeLink}
                        >
                          {"変更"}
                        </div>
                      </div>
                    </div>
                  </form>
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
            modalFooter={getDeleteModalFooter}
          >
            <div className="flex flex-col">
              <div className="flex-grow py-[50px] pt-[50px] px-6">
              {`ユーザーに関連付けられている PTT 番号、設定、グループ、連絡先も削除されます。削除よろしですか？`}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
