import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function AdminManagementDeleteModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close } = props && props;
    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'confirmation_information')}
        </div>
    );

    return (
        <div>
            <Dialog
                className="custom-modal"
                header={header}
                visible={open}
                draggable={false}
                onHide={() => close()}
                footer={
                    <div className="text-center">
                        <Button buttonProps={{
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => close(),
                        }} parentClass={"inline"} />
                        <Button buttonProps={{
                            buttonClass: "w-8rem",
                            type: "submit",
                            text: translate(localeJson, 'ok'),
                            severity: "danger",
                            onClick: () => close("confirm"),
                        }} parentClass={"inline"} />
                    </div>
                }
            >
                <div className={`text-center modal-content`}>
                    <div>
                        <p>{translate(localeJson, 'once_deleted_cannot_restore')}</p>
                        <p> {translate(localeJson, 'do_you_want_to_delete')}</p>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}