import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { AdminManagementDeleteModal, AdminManagementImportModal, HqEditModal, StaffManagementDetailModal, StaffManagementEditModal } from '@/components/modal';
import { StaffManagementService } from '@/services/staffmanagement.service';

export default function HeadQuartersPage() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    const [staff, setStaff] = useState(null);
    const [importStaffOpen, setImportStaffOpen] = useState(false);
    const [staffDetailsOpen, setStaffDetailsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editStaffOpen, setEditStaffOpen] = useState(false);
    const [createStaffOpen, setCreateStaffOpen] = useState(false);
    const [registerModalAction, setRegisterModalAction] = useState('');


    const openDeleteDialog = () => {
        setDeleteOpen(true);
    }

    const onDeleteClose = () => {
        setDeleteOpen(false);
    };

    //delete related mehotds end

    const columnsData = [
        { field: 'id', header: translate(localeJson, 'header_slno'), className: "sno_class", textAlign: "center" },
        {
            field: 'name', header: translate(localeJson, 'name'), minWidth: "5rem",
            // body: (rowData) => (
            //     <p className='text-link-class clickable-row' onClick={() => {
            //         setStaffDetailsOpen(true);
            //     }}>
            //         {rowData['name']}
            //     </p>
            // )
        },
        { field: 'user_id', header: translate(localeJson, 'userId'), minWidth: "5rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => (
                <div>
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "text-primary",
                            bg: "bg-white",
                            hoverBg: "hover:bg-primary hover:text-white",
                            onClick: () => {
                                setRegisterModalAction("create")
                                setEditStaffOpen(true);
                            }
                        }} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "delete-button ml-2",
                            onClick: () => openDeleteDialog()
                        }} parentClass={"delete-button"} />
                </div>
            ),
        }
    ];

    const onStaffImportClose = () => {
        setImportStaffOpen(!importStaffOpen);
    };
    const onStaffDetailClose = () => {
        setStaffDetailsOpen(false);

    };
    
    const onStaffEditClose = () => {
        setEditStaffOpen(false);
    };

    const onRegister = () => {
        setImportStaffOpen(false);
        setEditStaffOpen(false);
        setCreateStaffOpen(false);
    };

   
    useEffect(() => {
    }, );

    return (
        <React.Fragment>
            <AdminManagementImportModal
                open={importStaffOpen}
                close={onStaffImportClose}
                register={onRegister}
                modalHeaderText={translate(localeJson, "staff_management_import")}
            />
            {/* <StaffManagementDetailModal
                open={staffDetailsOpen}
                close={onStaffDetailClose}
            /> */}
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
            />
            <HqEditModal
                open={editStaffOpen}
                close={onStaffEditClose}
                register={onRegister}
                registerModalAction={registerModalAction}
            />
            {/* <StaffManagementEditModal
                open={createStaffOpen}
                close={onStaffCreateClose}
                register={onRegister}
                
            /> */}
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'headquarters_staff_management')}</h5>
                        <hr />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    onClick: () => {
                                        setImportStaffOpen(true);
                                    },
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'create_staff'),
                                    onClick: () => {
                                        setRegisterModalAction("create")
                                        setEditStaffOpen(true);
                                    },
                                    severity: "success"
                                }} parentClass={"mt-1"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
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
                                </div>
                            </div>
                            <div className='mt-3'>
                                <NormalTable
                                    stripedRows={true}
                                    className={"custom-table-cell"}
                                    showGridlines={"true"}
                                    columns={columnsData}
                                    // value={staff}
                                    filterDisplay="menu"
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginator={true}
                                    paginatorLeft={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}