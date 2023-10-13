import React from "react";
import { Dialog } from "primereact/dialog";

import Button from "../button/button";

const CommonDialog = (props) => {
  // Destructuring
  const {
    open,
    close,
    dialogParentClassName,
    dialogBodyClassName,
    position,
    header,
    content,
    footerParentClassName,
    footerButtonsArray,
    ...restProps
  } = props;
  // Footer buttons
  const footer = () => {
    if (footerButtonsArray.length > 0) {
      return (
        <div className={footerParentClassName}>
          {footerButtonsArray.map((buttonDetails, i) => (
            <Button
              key={i}
              buttonProps={buttonDetails.buttonProps}
              parentClass={buttonDetails.parentClass}
            />
          ))
          }
        </div>
      )
    }
    return false;
  };

  return (
    <div className={dialogParentClassName}>
      <Dialog
        className="custom-modal"
        header={header}
        visible={open}
        position={position}
        onHide={() => close()}
        footer={footer()}
      >
        <div className={dialogBodyClassName}>
          <div>
            <p>{content}</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CommonDialog;
