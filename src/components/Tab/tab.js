"use client";
import React, { useState, useEffect } from "react";

const TabComponent = ({ tabReset, setActiveTab, activeTab }) => {

  const [isMobile, setIsMobile] = useState(false);

  const handleTabClick = (index) => {
    setActiveTab(index);
    tabReset(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styleConstants = {
    tab: {
      flex: 1,
      height: "40px",
      borderRadius: "9px",
      fontSize: "20px",
      lineHeight: "29px",
      textAlign: "center",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...(isMobile && { fontSize: "12px", height: "35px", lineHeight:"normal", verticalAlign:'center' }),
    },
    normalTab: {
      background: "rgba(255, 255, 255, 0.95)",
      color: "#9E9E9E",
    },
    activeTab: {
      background: "#346595",
      boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
      color: "#FFFFFF",
    },
  };

  const tabs = [
    { text: "無線番号設定" },
    { text: "グループ" },
    { text: "連絡先" },
  ];

  return (
    <div className="flex items-center">
      {tabs.map((tab, index) => (
        <div
          key={tab.text}
          className={` ${index !== tabs.length - 1 ? "mr-2" : ""}`}
          style={{
            ...styleConstants.tab,
            ...(activeTab === index
              ? styleConstants.activeTab
              : styleConstants.normalTab),
          }}
          onClick={() => {
            handleTabClick(index);
          }}
          tabIndex={index} // Pass the tabIndex as a prop
        >
          {tab.text}
        </div>
      ))}
    </div>
  );
};

export default TabComponent;