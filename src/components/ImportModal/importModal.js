"use client"

import React, { useState } from "react";
import Modal from "../Modal/modal";
import FileUpload from "./fileUpload";
import ProgressBar from "./plainProgressBar";
import IconLeftBtn from "../Button/iconLeftBtn";
import intl from "../../utils/locales/jp/jp.json";
export default function ImportModal(props) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  /**
   * Handles the click event on the progress bar.
   * Resets the file name and performs any necessary actions.
   */
  const handleBarClick = () => {
    setFileName(null);
  };

  /**
   * Handles the file upload event.
   * Sets the uploaded file in the state and updates the file name.
   * @param {object} file - The uploaded file.
   */
  const handleFileUpload = (file) => {
    // Perform operations with the file in the parent component
    setFile(file);
    setFileName(file.name);
  };

  const modelFooter = () =>{
    return <IconLeftBtn
      text={intl.company_list_company_import}
      textColor={"text-white font-semibold text-sm"}
      py={"py-2.5"}
      px={"w-[85%]"}
      bgColor={"bg-customBlue"}
      textBold={true}
      icon={() => {
        return null;
      }}
      onClick={(event)=>{
        let {modelToggle, onCloseHandler} = props;
        onCloseHandler(()=>(!modelToggle));
      }}
    />
  }

  return (
    <div className="flex direction-column">
      <Modal
        fontSize="text-xl"
        fontWeight="font-semibold"
        textColor="#346595"
        text={intl.company_list_company_import}
        file={file}
        modalFooter={modelFooter}
      >
        <div className="flex flex-col">
          {/* File upload component */}
          <div data-testid="file-upload" className="mb-6">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Progress bar component */}
          <div data-testid="progress-bar" className="mb-3">
            <ProgressBar
              fileName={fileName}
              percentage={88}
              onClick={() => {
                handleBarClick();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
