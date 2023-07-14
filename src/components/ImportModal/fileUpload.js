"use client"

import React, { useState } from "react";
import UploadIcon from "../Icons/uploadIcon";
import DynamicLabel from "../Label/dynamicLabel";
import intl from "../../utils/locales/jp/jp.json";
const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const divStyle = {
    width: "286px",
    height: "188px",
    background: "rgba(57, 161, 234, 0.07)",
    border: "1px solid #39A1EA",
    borderRadius: "8px",
  };

  /**
   * Handles the file upload event.
   * Updates the state with the uploaded file and calls the onFileUpload callback.
   * @param {object} event - The file upload event.
   */
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    onFileUpload(uploadedFile); // Pass the uploaded file to the parent
  };

  /**
   * Handles the drag over event.
   * Prevents the default behavior.
   * @param {object} event - The drag over event.
   */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /**
   * Handles the drop event.
   * Prevents the default behavior and updates the state with the dropped file.
   * @param {object} event - The drop event.
   */
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
    onFileUpload(droppedFile); // Pass the dropped file to the parent
  };

  const fileUploadBtn = {
    background: "#346595",
    borderRadius: "5px",
  };

  return (
    <div
      data-testid="droppedFile"
      style={divStyle}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      file={file}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <UploadIcon />

        {/* File upload instructions */}
        <span className="mb-1">
        <DynamicLabel
          text="ファイルをドラッグ&amp;ドロップする"
          alignment="text-center"
          fontSize="text-xs"
          fontWeight="font-normal"
          textColor="#7B7B7B"
          disabled={false}
        />
        </span>
        <span className="mb-1">
        <DynamicLabel
          text={intl.importmodal_fileupload_or}
          alignment="text-center"
          fontSize="text-sm"
          fontWeight="font-normal"
          textColor="#7B7B7B"
          disabled={false}
        />
         </span>
        {/* File upload button */}
        <label
          style={fileUploadBtn}
          className="text-white px-7 py-1.5 rounded cursor-pointer mt-2"
        >
          <DynamicLabel
            text={intl.importmodal_fileupload_browse}
            alignment="text-center"
            fontSize="text-xs"
            fontWeight="font-semibold"
            textColor="#FFF"
            disabled={false}
          />
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
