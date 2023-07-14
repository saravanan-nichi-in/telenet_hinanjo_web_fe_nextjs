"use client";
import React from "react";
import SectionDeleteIcon from "../Icons/sectionDelete";
import intl from "../../utils/locales/jp/jp.json";

const SubSection = ({
  selected,
  tabs,
  handleTabClick,
  handleEditClick,
  handleDeleteClick,
}) => {
  const sectionStyle = {
    borderRadius: "9px",
    background: "#FFF",
    boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.10)",
    height: "475px",
    maxHeight: "586px",
    overflow: "auto",
  };

  const headingStyle = {
    borderRadius: "9px",
    background: "#ECF8FF",
    color: "#AAA",
    textAlign: "center",
    fontSize: "21px",
    fontStyle: "normal",
    fontWeight: "500",
    height: "62px",
  };

  const buttonStyle = {
    borderRadius: "9px",
    background: "#346595",
    marginBottom: "10px",
  };

  return (
    <div style={sectionStyle}>
      <span
        className="flex justify-center items-center mb-2"
        style={headingStyle}
      >
        {intl.help_settings_component_subsection}
      </span>
      <div className="px-[32px]">
        {tabs.map((tab, index) => {
          const textStyle = {
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "29px",
            color: selected === index ? "#FFF" : "#848484",
            textAlign: "center",
            marginLeft: "50px",
          };

          return (
            <div
              key={tab}
              style={selected === index ? buttonStyle : null}
              onClick={() => handleTabClick(index)}
              className={tabs.length === index + 1 ? "mb-2" : ""}
            >
              <span className="flex justify-between items-center h-[53px] cursor-pointer">
                <p className="text-[20px]" style={textStyle}>{tab}</p>
                <p className="flex ">
                  <span
                    data-testid={`delete-${index}`}
                    className="mr-[11px] ml-[25px]"
                    onClick={() => handleDeleteClick(tab)}
                  >
                    <SectionDeleteIcon />
                  </span>
                </p>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubSection;
