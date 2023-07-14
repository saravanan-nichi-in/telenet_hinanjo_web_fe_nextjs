import React, { useState, useEffect } from "react";
import DynamicLabel from "@/components/Label/dynamicLabel";
import HelpSettingPdf from "@/components/Icons/helpSettingPdf";
import ServiceDelete from "@/components/Icons/serviceDelete";
import IconLeftBtn from "@/components/Button/iconLeftBtn";
import intl from "../../utils/locales/jp/jp.json";

const FileUploadCard = ({
  handleUploadButtonClick,
  CardHeight,
  HeaderTitle,
  isAdd,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const uploadButtonStyle = {
    borderRadius: "9px",
    border: "2px solid #346595",
    background: "#F2FAFF",
    color: "#346595",
    textAlign: "center",
    fontSize: "17px",
    fontWeight: "600",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change the breakpoint as needed
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const baseCardStyle = {
    borderRadius: "9px",
    background: "#FFF",
    boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.10)",
    height: CardHeight,
  };

  const manualCard = isMobile
    ? { ...baseCardStyle, padding: "10px", maxWidth: "100%" }
    : { ...baseCardStyle, padding: "10px" };

  const fileCardStyle = {
    width: "100%",
    height: "86px",
    borderRadius: "9px",
    background: "rgba(159, 159, 159, 0.17)",
  };

  return (
    <div className="">
      <div style={manualCard} className="flex flex-col">
        <div className="flex items-center justify-center mt-3">
          <DynamicLabel
            text={HeaderTitle}
            alignment="text-center"
            fontSize="text-base"
            fontWeight="font-medium"
            textColor="#7B7B7B"
            disabled={false}
          />
        </div>
        <div className="flex items-center justify-center flex-grow lg:px-[10px]">
          {!isAdd && (
            <div style={fileCardStyle} className="flex items-center">
              <div className="ml-[20px]">
                <HelpSettingPdf />
              </div>
              <div className="flex flex-col flex-grow ml-[19px]">
                <DynamicLabel
                  text="Ptalk Service instructions.pdf"
                  alignment="text-center"
                  fontSize="text-base"
                  fontWeight="font-normal"
                  textColor="#346595"
                  disabled={false}
                />
              </div>
              <div className="mr-[20px] cursor-pointer">
                <ServiceDelete />
              </div>
            </div>
          )}
          {isAdd && (
            <div className="w-full flex items-center justify-center">
              <button className="py-[12px] w-full" style={uploadButtonStyle}>
                {intl.helpersettings_fileuploadcard_upload}
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end  lg:px-[10px] pb-2">
          <div className="flex justify-end">
            <IconLeftBtn
              text={intl.help_settings_addition_keep}
              textColor="text-white font-normal text-xl"
              py="py-[8px] px-[55px]"
              bgColor="bg-customBlue"
              textBold={true}
              rounded="rounded-lg"
              icon={() => null}
              onClick={handleUploadButtonClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadCard;
