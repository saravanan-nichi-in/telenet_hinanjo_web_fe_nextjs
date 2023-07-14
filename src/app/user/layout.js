"use client";

import { useState, useEffect } from "react";
import Pttbar from "../../components/Layout/pttBar";
import SidebarInside from "@/components/Layout/sidebarInside";
import TabComponent from "@/components/Tab/tab";
import { usePathname } from "next/navigation";
import SidebarInsideMobile from "@/components/Layout/sidebarInsideMobile";
import Group from "./group-information/group";
import Contact from "./contact-information/contact";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import TextPlain from "@/components/Input/textPlain";
import Modal from "@/components/Modal/modal";
import intl from "@/utils/locales/jp/jp.json";
import ImportModal from "@/components/ImportModal/importModal";
import DropdownMedium from "@/components/Input/dropdownMedium";
import { fileName } from "@/utils/constant";
import GetIconQRCode from "../../components/Icons/qrCode";

export default function UserLayout({ children }) {
  const router = usePathname();
  const fileStyle = { fontWeight: "400", color: "#7B7B7B", fontSize: "12px" };
  const changeLink = { color: "#346595", fontWeight: "700", fontSize: "12px" };

  const [showModal, setShowModal] = useState(false);
  const [tabResetProp, setTabResetProp] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [modelToggle, setModelToggle] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sectionName, setSectionName] = useState("");
  const [exportModal, setExportModal] = useState(false);
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    !isSidebarVisible && setIsSidebarVisible(true);
  }, [tabResetProp]);

  function clickHere(v) {
    setIsSidebarVisible(v);
  }

  if (router === "/user/add") return children;
  if (router === "/user") return children;

  function showModalHandler() {
    setShowModal(()=>true);
  }

  function toggleModalHandler() {
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

  function qrCodeIcons() {
    return <GetIconQRCode />;
  }

  function getQrModalFooter(){
    return <div className="flex gap-x-3">
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
      <div className="mb-2">
        <Pttbar
          setShowModal={async()=>{
            await setShowModal(()=>false);
            await showModalHandler();
          }}
          setShowImportModel={async()=>{
            await setModelToggle(()=>false);
            await toggleModalHandler();
          }}
          setExportModal={setExportModal}
          setDeleteModal={setDeleteModal}
        />
      </div>
      <div className="w-full mb-2">
        <TabComponent
          tabReset={clickHere}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
      <div className="flex gap-x-2">
        {activeTab === 0 && (
          <>
            <div
              className="hidden lg:block w-1/5"
              style={{ minWidth: "250px" }}
            >
              <SidebarInside />
            </div>
            {isSidebarVisible && (
              <div
                className="w-full block lg:hidden"
                style={{ minWidth: "250px" }}
              >
                <SidebarInsideMobile
                  setIsSidebarVisible={setIsSidebarVisible}
                />
              </div>
            )}
            <div className="hidden lg:block w-full lg:w-4/5 border bg-white border-gray-200 rounded-lg shadow px-4 max-h-max py-4 pb-8 mt-2 lg:mt-0">
              {children}
            </div>
            {!isSidebarVisible && (
              <div className="w-full lg:w-4/5 border bg-white border-gray-200 rounded-lg shadow px-4 max-h-max py-2 pb-8 mt-2 lg:mt-0">
                {children}
              </div>
            )}
          </>
        )}
        {activeTab === 1 && (
          <>
            <div className="block w-full border pr-0 pl-1 max-h-max py-1 pb-8 mt-2 lg:mt-0">
              <Group />
            </div>
          </>
        )}
        {activeTab === 2 && (
          <>
            <div className="block w-full border pr-0 pl-1 max-h-max py-1 pb-8 mt-2 md:mt-0">
              <Contact />
            </div>
          </>
        )}

        {modelToggle && (
          <div>
            <ImportModal
              modelToggle={modelToggle}
              onCloseHandler={setModelToggle}
            />
          </div>
        )}
        {showModal && (
          <Modal
            height="412px"
            fontSize="text-xl"
            fontWeight="font-semibold"
            textColor="#346595"
            text={"インポート設定"}
            modalFooter={()=>{
              return <IconLeftBtn
                text={"インポート"}
                textColor={"text-white font-semibold text-sm w-full"}
                py={"py-3"}
                px={"w-[350px] 1sm:w-[85%] 2sm:w-[85%]"}
                bgColor={"bg-customBlue"}
                textBold={true}
                icon={() => {
                  return "";
                }}
                onClick={(event)=>{setShowModal(()=>false)}}
              />
            }}
          >
            <div className="flex flex-col">
              <div className="flex flex-col mt-[20px] mb-[80px] px-[5%]">
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
                  label={"PTT番号を入力"}
                  labelColor={"#7B7B7B"}
                  id={"sectionName"}
                  value={"000*000*0004"}
                  onchange={setSectionName}
                />
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
        {qrCodeModal && (
          <Modal
            height="auto"
            fontSize="text-xl"
            textColor="#346595"
            text={intl.company_list_company_qrCode}
            onCloseHandler={setQrCodeModal}
            modalFooter={getQrModalFooter}
          >
            <div className="flex flex-col mb-">
              <div className="flex-grow mb-7">
                <center>{qrCodeIcons()}</center>
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
