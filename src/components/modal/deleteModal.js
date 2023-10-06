import React, { useContext, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";

import InputSwitch from "../switch/inputSwitch";
import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

const DeleteModal = (props) => {
  const {
    disabled,
    parentMainClass,
    text,
    iconPos,
    icon,
    parentClass,
    data,
    checked,
    modalClass,
    draggable,
    position,
    header,
    style,
    contentClass,
    content,
    bg,
    hoverBg,
    severity,
    buttonClass,
    cancelButton,
    updateButton,
    updateCalBackFunction,
    ...restProps
  } = props;
  const { localeJson } = useContext(LayoutContext);
  const [visible, setVisible] = useState(false);
  const [checkedSwitch, setCheckedSwitch] = useState(checked);
  const footer = () => {
    if (cancelButton || updateButton) {
      return (
        <div className="text-center">
          {/* Delete button */}
          {cancelButton && (
            <Button
              buttonProps={{
                buttonClass: "text-600 w-8rem",
                bg: "bg-white",
                hoverBg: "hover:surface-500 hover:text-white",
                text: translate(localeJson, "cancel"),
                onClick: () => setVisible(false),
              }}
              parentClass={"inline"}
            />
          )}
          {/* update button */}
          {updateButton && (
            <Button
              buttonProps={{
                buttonClass: "w-8rem",
                type: "submit",
                text: translate(localeJson, "update"),
                severity: "danger",
                onClick: () => onClickupdateButton(data),
              }}
              parentClass={"inline"}
            />
          )}
        </div>
      );
    }
    return false;
  };

  useEffect(() => {
    setCheckedSwitch(checked);
  }, [checked]);

  /**
   * Return id to the parent function
   * @param {*} rowData
   */
  const onClickupdateButton = (rowData) => {
    updateCalBackFunction(rowData);
    setVisible(false);
  };

  return (
    <div className={`${parentMainClass}`}>
      {text ? (
        <>
          {/* Check box */}
          <Button
            buttonProps={{
              text: text,
              iconPos: iconPos,
              icon: icon,
              bg: bg,
              hoverBg: hoverBg,
              severity: severity,
              buttonClass: buttonClass,
              onClick: () => setVisible(true),
            }}
          />
        </>
      ) : (
        <>
          {/* Switch */}
          <InputSwitch
            parentClass={parentClass}
            inputSwitchProps={{
              disabled: disabled || false,
              checked: checkedSwitch,
              onChange: () => setVisible(true),
            }}
          />
        </>
      )}
      <Dialog
        className="custom-modal"
        header={header}
        visible={visible}
        draggable={false}
        onHide={() => setVisible(false)}
        footer={footer()}
      >
        <div className={`text-center modal-content`}>
          <div>
            <p>{content}</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DeleteModal;
