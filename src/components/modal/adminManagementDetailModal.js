import React, { useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useContext, useState } from 'react';
import { AdminManagementService } from '@/helper/adminManagementService';
import { NormalTable } from "../datatable";
import AdmiinManagementEditModal from "./adminManagementEditModal";


export default function AdminManagementDetailModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const [admin, setAdmins] = useState([]);
    const columns = [
        { field: '氏名', header: '氏名', minWidth: "8rem" },
        { field: 'メール', header: 'メール', minWidth: "8rem" },
    ];
    const { open, close } = props && props;
    const [editAdminOpen, setEditAdminOpen] = useState(false);
    const onAdminClose = () => {
        setEditAdminOpen(!editAdminOpen);
    };
    const onRegister = (values) => {
        setEditAdminOpen(false);
    };

    useEffect(() => {
        AdminManagementService.getAdminsMedium().then((data) => setAdmins(data));
    }, []);

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'admin_details')}
        </div>
    );

    return (
        <React.Fragment>
            <AdmiinManagementEditModal
                open={editAdminOpen}
                close={onAdminClose}
                register={onRegister}
            />
            <div>
                <Dialog
                    className="custom-modal"
                    header={header}
                    visible={open}
                    style={{ minWidth: "20rem" }}
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
                                text: translate(localeJson, 'update'),
                                severity: "primary",
                                onClick: () => setEditAdminOpen(true)
                            }} parentClass={"inline"} />
                        </div>
                    }
                >
                    <div className={`modal-content`}>
                        <div>
                            <NormalTable tableStyle={{ maxWidth: "30rem" }} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admin} columns={columns} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}