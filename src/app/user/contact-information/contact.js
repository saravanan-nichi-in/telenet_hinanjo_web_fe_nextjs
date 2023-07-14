"use client";
import React from "react";
import DynamicLabel from "@/components/Label/dynamicLabel";
import IconOutlineBtn from "@/components/Button/iconOutlineBtn";
import IconBtn from "@/components/Button/iconBtn";
import AddIcon from "@/components/Icons/addIcon";
import SectionDeleteIcon from "@/components/Icons/sectionDelete";
import intl from "@/utils/locales/jp/jp.json";
import DataTable from "@/components/DataTable/DataTable";
import { contactData, tableDefaultPageSizeOption,fileName } from "@/utils/constant";
import Modal from "@/components/Modal/modal";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import TextPlain from "@/components/Input/textPlain";
import DropdownMedium from "@/components/Input/dropdownMedium";
import GetIconQRCode from "../../../components/Icons/qrCode";
import ImportModal from "@/components/ImportModal/importModal";

export default function Contact({ children }) {
  const radioNumberStyle = {
    color: "#346595",
    fontWeight: "500",
    fontSize: "14px",
  };
  /**columns of company list and its operations */
  const contactsColumns = [
    {
      title: intl.user_contact_info_contact_name,
      dataIndex: "contactName",
      render: (text) => <a style={radioNumberStyle}>{text}</a>,
      width:120
    },
    {
      title: intl.company_list_company_radioNumber,
      dataIndex: "radioNumber",
      render: (text) => (
        <a style={{ fontSize: "14px", fontWeight: "500" }}>{text}</a>
      ),
      width:120
    },
    {
      title: "",
      dataIndex: "deleteEdit",
      render: (text, record) => (
        <div style={{ marginLeft: "10%", marginRight:"10%" }}>
          <p className="flex">
            <span
              data-testid={`delete`}
              className="cursor-pointer rounded-full px-3 py-2"
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
      width:50
    },
  ];
  /**columns of company list and its operations ends here*/

  const [columns, setColumns] = React.useState(contactsColumns);
  const [qrCodeModal, setQrCodeModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [exportModal, setExportModal] = React.useState(false);
  const [importModal, setImportModal] = React.useState(false);
  const [addNewModal, setAddNewModal] = React.useState(false);
  const [detailsModal, setDetailsModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);

  const [contactName,setContactName] = React.useState("");
  const [radioNo,setRadioNo] = React.useState("");

  React.useEffect(()=>{
    if(addNewModal){
      setContactName(()=>("連絡先名"));
      setRadioNo(()=>("無線番号"));
    } else {
      setContactName(()=>(""));
      setRadioNo(()=>(""));
    }
  },[detailsModal, editModal]);

  /**ICON Imports */
  function editIcon() {
    return <AddIcon />;
  }

  function importIcon() {
    return <svg width="19" height="26" viewBox="0 0 19 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-7.44916e-07 17.0417L4.4797 17.0417C4.66443 17.0417 4.81691 16.8923 4.82685 16.7012C4.82903 16.659 5.06757 12.4391 7.08085 8.28543C9.58675 3.11537 13.5928 0.332522 19 8.30516e-07C16.4071 2.04289 9.3454 8.37081 9.3454 16.6819C9.3454 16.8805 9.50103 17.0415 9.69303 17.0415L14.1727 17.0415L9.76552 22.6135L7.08654 26L4.97651 23.3324L4.40779 22.6135L-7.44916e-07 17.0417Z" fill="#346595"/>
    </svg>
  }

  function folderIcon() {
    return <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2449 2.56042C16.6619 2.56042 17 2.89387 17 3.30444V12.959C17 13.37 16.6604 13.7031 16.2449 13.7031H0.755142C0.338107 13.7031 0 13.3696 0 12.959V1.44583C0 1.03562 0.336965 0.703125 0.756551 0.703125H5.57339C5.78143 0.703125 6.04393 0.839675 6.16099 1.01016L7.01354 2.25217C7.13041 2.42229 7.3933 2.56023 7.60113 2.56023L16.2449 2.56042Z" fill="#CDCDCD"/>
    </svg>    
  }

  function exportIcon() {
    return <svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.0417 0V4.4797C17.0417 4.66443 16.8923 4.81691 16.7012 4.82685C16.659 4.82903 12.4391 5.06757 8.28543 7.08085C3.11537 9.58675 0.332521 13.5928 0 19C2.04289 16.4071 8.37081 9.3454 16.6819 9.3454C16.8805 9.3454 17.0415 9.50104 17.0415 9.69304V14.1727L22.6135 9.76552L26 7.08654L23.3324 4.97651L22.6135 4.40779L17.0417 0Z" fill="#346595"/>
    </svg>
  }
  /**ICON Imports ends here*/

  /**ICON Imports ends here*/
  const fileStyle = {fontWeight:"400", color:"#7B7B7B", fontSize:"12px"}
  const changeLink = {color:"#346595", fontWeight:"700", fontSize:"12px"}
  /**Delete handler */
  function handelDelete(record) {
    setDeleteModal(() => true);
  }

  function qrCodeIcons() {
    return <GetIconQRCode/>
  }

  function importHandler() {setTimeout(() => {setImportModal(() => true);}, 500);}
  function detailHandler() {setTimeout(() => {setDetailsModal(() => true);}, 500);}
  

  return (
    <>
      <div>
        <div className="flex justify-between mb-2 xl:mb-2 ">
          <div className="flex items-center">
            <DynamicLabel
              text={intl.user_contact_info_title}
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
                text={intl.company_list_company_import}
                textColor={"text-customBlue"}
                textBold={true}
                py={"xl:py-[7px] md:py-1.5 py-1.5"}
                px={"xl:px-[32px] md:px-[33.5px] px-[33.5px]"}
                icon={() => importIcon()}
                borderColor={"border-customBlue"}
                onClick={async() => {await setImportModal(() => false); await importHandler()}}
              />
            </span>
            <span className="mr-2.5">
              <IconOutlineBtn
                text={intl.company_list_company_export_title}
                textColor={"text-customBlue"}
                textBold={true}
                py={"xl:py-[8px] md:py-1.5 py-1.5"}
                px={"xl:px-[20px] md:px-[22.5px] px-[22.5px]"}
                icon={() => exportIcon()}
                borderColor={"border-customBlue"}
                onClick={() => {
                  setExportModal(() => true);
                }}
              />
            </span>
            <span>
              <IconOutlineBtn
                text={intl.user_contact_info_add}
                textColor={"text-customBlue"}
                textBold={true}
                py={"xl:py-[8px] md:py-1.5 py-1.5"}
                px={"xl:px-[32.5px] md:px-[22.5px] px-[22.5px]"}
                icon={() => editIcon()}
                borderColor={"border-customBlue"}
                onClick={async() => { await setEditModal(() => false); await setDetailsModal(() => false); await setAddNewModal(() => true)}}
              />
            </span>
          </div>
          <div className=" lg:hidden flex">
            <span className="mr-2.5">
              <IconBtn
                textColor={"text-white"}
                additionalClass={"px-[7px]"}
                textBold={true}
                icon={() => importIcon()}
                onClick={async() => {await setImportModal(() => false); await importHandler()}}
                bg="bg-transparent"
              />
            </span>
            <span className="mr-2.5">
              <IconBtn
                textColor={"text-white"}
                textBold={true}
                icon={() => exportIcon()}
                additionalClass={"py-[7.5px]"}
                bg="bg-transparent"
                onClick={() => {
                  setExportModal(() => true);
                }}
              />
            </span>
            <span>
              <IconBtn
                textColor={"text-white"}
                textBold={true}
                icon={() => editIcon()}
                additionalClass={"py-[9.2px] px-[8px]"}
                bg="bg-transparent"
                onClick={async() => { await setEditModal(() => false); await setDetailsModal(() => false); await setAddNewModal(() => true)}}
              />
            </span>
          </div>
        </div>
        <div className="mb-[20px] relative" style={{ width: "100%" }}>
          <DataTable
            rowSelectionFlag
            columns={columns}
            dataSource={contactData}
            onSelectRow={(tableData) => {
              return tableData;
            }}
            defaultPaeSizeOptions={tableDefaultPageSizeOption}
            defaultValue={1}
            onRowClick={async(record, rowIndex)=>{
              await setDetailsModal((() => false))
              await setEditModal(() => false);
              await detailHandler()
            }}
          />
        </div>
        {exportModal && (
          <Modal
            height="500px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={intl.company_list_company_export_title}
            onCloseHandler={setExportModal}
            contentPaddingTop="pt-1"
            modalFooter={()=>{
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
            }}
          >
            <div className="flex flex-col px-[4%]">
              <div className="flex-grow py-[30px]">
                <form className="grid grid-cols-1 gap-y-2">
                  <div className="flex flex-col">
                    <TextPlain
                      type="text"
                      for={"id"}
                      placeholder={""}
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
        {qrCodeModal && (
          <Modal
            height="412px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={intl.company_list_company_qrCode}
            onCloseHandler={setQrCodeModal}
            modalFooter={()=>{
              return <div className="grid grid-cols-2 gap-[30px] place-content-center">
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
                      setQrCodeModal(() => false);
                    }}
                  />
                </div>
                <div>
                  <IconLeftBtn
                    text={"ダウンロード "}
                    textColor={"text-white font-semibold text-sm w-full"}
                    py={"py-[11px]"}
                    px={"px-[10.5px] md:px-[18.5px]"}
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
            }}
          >
            <div className="flex flex-col">
              <div className="flex-grow py-[30px] pt-[10px]">
                <center>{qrCodeIcons()}</center>
              </div>
            </div>
          </Modal>
        )}
        {importModal && <ImportModal modelToggle={importModal}
              onCloseHandler={setImportModal}/>}
        {deleteModal && (
            <Modal
              height="412px"
              fontSize="text-xl"
              fontWeight="font-semibold"
              textColor="#346595"
              text={intl.help_settings_addition_delete}
              onCloseHandler={setDeleteModal}
              modalFooter={()=>{
                return <div className="grid grid-cols-2 gap-[30px] place-content-center">
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
                        textColor={"text-white font-semibold text-sm w-full"}
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
            <div className="flex flex-col px-[4%]">
                <div className="flex-grow py-[90px] pt-[60px]">
                  {intl.user_group_delete}
                </div>
            </div>
          </Modal>
        )}
        {(addNewModal || detailsModal || editModal) && (
          <Modal
            height="480px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={detailsModal ? "連絡先の詳細" : editModal ? "連絡先の編集" : "新しい連絡先を追加"}
            onCloseHandler={setAddNewModal}
            displayEditIcon={detailsModal}
            handelEdit={async ()=>{
              await setDetailsModal(() => false);
              await setAddNewModal(() => false);
              await setEditModal(() => true);
            }}
            modalFooter={()=>{
              return !detailsModal && <IconLeftBtn
                text={intl.help_settings_addition_keep}
                textColor={"text-white font-semibold text-sm w-full"}
                py={"py-[11px]"}
                px={"w-[84%]"}
                bgColor={"bg-customBlue"}
                textBold={true}
                icon={() => {
                  return null;
                }}
                onClick={() => {
                  setAddNewModal(() => false);
                }}
              />
            }}
          >
            <div className="flex flex-col px-[4%]">
              <div className="flex-grow py-[20px]">
                <form className="grid grid-cols-1 gap-y-2">
                  <div className="flex flex-col">
                    <TextPlain
                      type="text"
                      for={"id"}
                      placeholder={""}
                      borderRound="rounded-xl"
                      padding="p-[10px]"
                      focus="focus:outline-none focus:ring-2 focus:ring-customBlue"
                      border="border border-gray-300"
                      bg="bg-input-color"
                      additionalClass="block w-full pl-5 text-base pr-[30px]"
                      label={"連絡先名"}
                      labelColor="#7B7B7B"
                      id={"id"}
                      isRequired={true}
                      labelClass={"float-left"}
                      value={contactName}
                      onChange={(event)=>{ setContactName(()=>event.target.value) }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <TextPlain
                      type="text"
                      for={"id"}
                      placeholder={""}
                      borderRound="rounded-xl"
                      padding="p-[10px]"
                      focus="focus:outline-none focus:ring-2 focus:ring-customBlue"
                      border="border border-gray-300"
                      bg="bg-input-color"
                      additionalClass="block w-full pl-5 text-base pr-[30px]"
                      label={"無線番号"}
                      labelColor="#7B7B7B"
                      id={"id"}
                      isRequired={true}
                      labelClass={"float-left"}
                      value={radioNo}
                      onChange={(event)=>{ setRadioNo(()=>event.target.value) }}
                    />
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
