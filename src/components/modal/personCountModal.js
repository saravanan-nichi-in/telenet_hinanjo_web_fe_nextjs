import React, { useContext, useState } from "react";
import { Dialog } from "primereact/dialog";

import Button from "../button/button";
import { ToggleSwitch } from "../switch";
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";

const PersonCountModal = (props) => {
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
    const { localeJson } = useContext(LayoutContext);

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
    const [buttonStates, setButtonStates] = useState(Array(8).fill(false));

    const handleButtonClick = (index) => {
        const newButtonStates = [...buttonStates];
        newButtonStates.fill(false); // Uncheck all buttons
        newButtonStates[index] = true; // Check the clicked button
        setButtonStates(newButtonStates);
    };
    return (
        <div className={dialogParentClassName}>
            <Dialog
                className="custom-modal"
                header={header}
                visible={open}
                draggable={false}
                blockScroll={true}
                position={position}
                onHide={() => close()}
                footer={footer()}
            >
                <div className={dialogBodyClassName}>
                    {content}
                    <div className="w-100 flex flex-row justify-content-center">
                        <div className="w-full">
                            <div className=" flex flex-wrap justify-content-center gap-3">
                                {buttonStates.map((checked, index) => (
                                    <ToggleSwitch
                                        key={index}
                                        checked={checked}
                                        onLabel={`${index + 1 + translate(localeJson, 'people')}`}
                                        offLabel={`${index + 1 + translate(localeJson, 'people')}`}
                                        onChange={() => handleButtonClick(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default PersonCountModal;