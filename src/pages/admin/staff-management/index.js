import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { StaffDetailService } from '@/helper/StaffDetailService';
import { AdminManagementDeleteModal, AdminManagementImportModal, StaffManagementDetailModal, StaffManagementEditModal } from '@/components/modal';

export default function StaffManagementPage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [staff, setStaff] = useState([]);
    const router = useRouter();
    const [importStaffOpen, setImportStaffOpen] = useState(false);
    const [staffDetailsOpen, setStaffDetailsOpen] = useState(false);
    const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
    const [editStaffOpen, setEditStaffOpen] = useState(false);
    const [CreateStaffOpen, setCreateStaffOpen] = useState(false);
    const staffs = [
        { field: 'No', header: 'S No', minWidth: "3rem" },
        {
            field: '氏名', header:translate(localeJson, 'name'), minWidth: "15rem", body: (rowData) => (
                <a className='text-decoration' onClick={() => setStaffDetailsOpen(true)}>
                    {rowData['氏名']}
                </a>
            )
        },
        { field: 'メール', header: translate(localeJson, 'address_email') },
        { field: '電話番号', header:translate(localeJson, 'tel') },
        {
            field: 'actions',
            header: translate(localeJson, 'edit'),
            textAlign: "center",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'edit'), buttonClass: "text-primary",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => setEditStaffOpen(true)
                    }} />
                </div>
            ),
        }, {
            field: 'actions',
            header: translate(localeJson, 'delete'),
            textAlign: "center",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'delete'), buttonClass: "text-primary",
                        bg: "bg-red-600 text-white",
                        hoverBg: "hover:bg-red-500 hover:text-white",
                        onClick: () => setDeleteStaffOpen(true)
                    }} />   
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            await StaffDetailService.getStaffMedium().then((data) => setStaff(data));
            setLoader(false);
        };
        fetchData();
    }, []);

    const onStaffImportClose = () => {
        setImportStaffOpen(!importStaffOpen);
    };
    const onStaffDetailClose = () => {
        setStaffDetailsOpen(!staffDetailsOpen);

    };
    const onStaffDeleteClose = () => {
        setDeleteStaffOpen(!deleteStaffOpen);
    };
    const onStaffEditClose = () => {
        setEditStaffOpen(!editStaffOpen);
    };
    const onStaffCreateClose = () => {
        setCreateStaffOpen(!CreateStaffOpen);
    };
    const onRegister = (values) => {
        setImportStaffOpen(false);
        setEditStaffOpen(false);
        setCreateStaffOpen(false);
    };

    return (
        <React.Fragment>
            <AdminManagementImportModal
                open={importStaffOpen}
                close={onStaffImportClose}
                register={onRegister}
                modalHeaderText={translate(localeJson, 'staff_management_import')}
            />
            <StaffManagementDetailModal
                open={staffDetailsOpen}
                close={onStaffDetailClose}
            />
            <AdminManagementDeleteModal
                open={deleteStaffOpen}
                close={onStaffDeleteClose}
            />
            <StaffManagementEditModal
                open={editStaffOpen}
                close={onStaffEditClose}
                register={onRegister}
                buttonText={translate(localeJson, 'update')}
                modalHeaderText={translate(localeJson, 'edit_staff_management')}
            />
            <StaffManagementEditModal
                open={CreateStaffOpen}
                close={onStaffCreateClose}
                register={onRegister}
                buttonText={translate(localeJson, 'submit')}
                modalHeaderText={translate(localeJson, 'add_staff_management')}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'staff_management')}</h5>
                        <hr />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    onClick: () => setImportStaffOpen(true),
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
                                    text: translate(localeJson, 'create_staff'),
                                    onClick: () => setCreateStaffOpen(true),
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
                                                text: translate(localeJson, 'name'),
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
                            <NormalTable paginator={"true"} paginatorLeft={true} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={staff} columns={staffs} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}