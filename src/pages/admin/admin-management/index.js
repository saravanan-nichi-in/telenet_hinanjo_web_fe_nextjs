import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { AdminManagementService } from '@/helper/adminManagementService';
import { AdminManagementCreateModal, AdminManagementDeleteModal, AdminManagementDetailModal, AdminManagementEditModal, AdminManagementImportModal } from '@/components/modal';

export default function AdminManagementPage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [editAdminOpen, setEditAdminOpen] = useState(false);
    const [adminDetailsOpen, setAdminDetailsOpen] = useState(false);
    const [deleteAdminOpen, setDeleteAdminOpen] = useState(false);
    const [importAdminOpen, setImportAdminOpen] = useState(false);
    const [createAdminOpen, setCreateAdminOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await AdminManagementService.getAdminsMedium().then((data) => setAdmins(data));
            setLoader(false);
        };
        fetchData();
    }, []);

    /**
    * Email setting modal close
   */
    const onAdminClose = () => {
        setEditAdminOpen(!editAdminOpen);
    };
    /**
        * Detail setting modal close
       */
    const onAdminDetailClose = () => {
        setAdminDetailsOpen(!adminDetailsOpen);
    };
    /**
        * Delete setting modal close
       */
    const onAdminDeleteClose = () => {
        setDeleteAdminOpen(!deleteAdminOpen);
    };
    /**
    * Import setting modal close
   */
    const onAdminImportClose = () => {
        setImportAdminOpen(!importAdminOpen);
    };
    /**
    * Delete setting modal close
   */
    const onAdminCreateClose = () => {
        setCreateAdminOpen(!createAdminOpen);
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEditAdminOpen(false);
        setImportAdminOpen(false);
        setCreateAdminOpen(false);
    };

    const Listcolumn = [
        { field: 'No.', header: 'S No', minWidth: "3rem" },
        {
            field: '氏名', header: "氏名", minWidth: "15rem", body: (rowData) => (
                <a className='text-decoration' onClick={() => setAdminDetailsOpen(true)}>
                    {rowData['氏名']}
                </a>
            )
        },
        { field: 'メール', header: 'メール' },
        {
            field: 'actions',
            header: '編集',
            textAlign: "center",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'edit'), buttonClass: "text-primary",
                        bg: "bg-white",
                        onClick: () => setEditAdminOpen(true),
                        hoverBg: "hover:bg-primary hover:text-white",
                    }} />
                </div>
            ),
        }, {
            field: 'actions',
            header: '削除',
            textAlign: "center",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'delete'), buttonClass: "text-primary",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => setDeleteAdminOpen(true)
                    }} />
                </div>
            ),
        },
    ];



    return (
        <React.Fragment>
            <AdminManagementEditModal
                open={editAdminOpen}
                close={onAdminClose}
                register={onRegister}
            />
            <AdminManagementDetailModal
                open={adminDetailsOpen}
                close={onAdminDetailClose}
            />
            <AdminManagementDeleteModal
                open={deleteAdminOpen}
                close={onAdminDeleteClose}
            />
            <AdminManagementImportModal
                open={importAdminOpen}
                close={onAdminImportClose}
                register={onRegister}
                modalHeaderText={translate(localeJson, 'admin_management_import')}
            />
            <AdminManagementCreateModal
                open={createAdminOpen}
                close={onAdminCreateClose}
                register={onRegister}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'admin_management')}</h5>
                        <hr />
                        <div >
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    onClick: () => setImportAdminOpen(true),
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />

                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'signup'),
                                    onClick: () => setCreateAdminOpen(true),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <form>
                                    <div class="flex justify-content-end gap-3 flex-wrap float-right mt-5 mb-3" >
                                        <div class="" >
                                            <InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
                                                text: translate(localeJson, 'full_name'),
                                                inputClass: "w-17rem lg:w-17rem md:w-20rem sm:w-14rem "
                                            }} parentClass={"w-full lg:w-22rem md:w-20rem sm:w-14rem"}
                                            />

                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary"
                                            }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div>
                            </div>
                            <NormalTable paginator={"true"} paginatorLeft={true} showGridlines={"true"} customActionsField="actions" value={admins} columns={Listcolumn} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}