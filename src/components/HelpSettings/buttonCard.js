import React from "react";

const ButtonCard = ({ activeButton, onActiveButtonChange }) => {
  const handleButtonClick = (buttonName) => {
    onActiveButtonChange(buttonName);
  };

  // Common button styles
  const buttonStyles = {
    width: "132px",
    height: "30px",
    flexShrink: 0,
    textAlign: "center",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    outline: "none",
  };

  // Active button styles
  const activeButtonStyles = {
    ...buttonStyles,
    borderRadius: "24px",
    background: "#346595",
    color: "#FFFFFF",
  };

  // Inactive button styles
  const inactiveButtonStyles = {
    ...buttonStyles,
    color: "#737373",
  };

  return (
    <div
      style={{
        width: "295px",
        height: "42px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
        borderRadius: "32px",
        background: "#FFF",
        boxShadow: "0px 0px 7px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Button 1 */}
      <button
        style={
          activeButton === "file" ? activeButtonStyles : inactiveButtonStyles
        }
        onClick={() => handleButtonClick("file")}
      >
        ファイル
      </button>

      {/* Button 2 */}
      <button
        style={
          activeButton === "text" ? activeButtonStyles : inactiveButtonStyles
        }
        onClick={() => handleButtonClick("text")}
      >
        テキスト
      </button>
    </div>
  );
};

export default ButtonCard;
