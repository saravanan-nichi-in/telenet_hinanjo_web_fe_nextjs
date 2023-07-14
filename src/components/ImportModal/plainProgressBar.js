"use client"

import React from "react";
import PlainBar from "../ProgressBar/plainBar";
import DynamicLabel from "../Label/dynamicLabel";
import FileIcon from "../Icons/fileIcon";
import CloseIcon from "../Icons/closeIcon";

export default function ProgressBar({ fileName, percentage, onClick }) {
  const barStyles = {
    background: "#E4E4E4",
    borderRadius: "10px",
    width: "286px",
    height: "55px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={barStyles}>
     <div data-testid="file-icon"> <FileIcon /></div>
      <div className="w-full flex flex-col">
        <div className="-mt-1.5" data-testid="file-name">
            <DynamicLabel
              text={fileName ? fileName : "Filename.csv"}
              alignment="text-center"
              fontSize="text-xs"
              fontWeight="font-normal"
              textColor="#346595"
              disabled={false}
            />
        </div>
        <div className="mt-1">
          <PlainBar percentage={percentage} height="5px" data-testid="plain-bar" />
        </div>
      </div>
      <div data-testid="close-icon"> <CloseIcon color="#39a1ea6b" margin={"mx-3.5"} onClick={onClick} /></div>

    </div>
  );
}
