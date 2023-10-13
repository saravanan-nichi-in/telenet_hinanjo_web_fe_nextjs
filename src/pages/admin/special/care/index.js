import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CommonDialog, NormalTable } from '@/components';
import { AdminSpecialCareService } from '@/helper/adminSpecialCareService';
import { AdminManagementImportModal, SpecialCareEditModal } from '@/components/modal';

export default function AdminSpecialCarePage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [specialCareCreateDialogVisible, setSpecialCareCreateDialogVisible] = useState(false);
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [specialCarCreateOpen, setSpecialCareCreateOpen] = useState(false);
    const [importSpecialCareOpen, setImportSpecialCareOpen] = useState(false);

    const onClickCancelButton = () => {
        console.log("cancel");
        setSpecialCareCreateDialogVisible(false);
    };
    const onClickOkButton = () => {
        setSpecialCareCreateDialogVisible(false);
    };
    const onSpecialCareEditSuccess = (response) => {
        setSpecialCareEditOpen(false);
        setSpecialCareCreateOpen(false);
    };
    const onSpecialCareImportClose = () => {
        setImportSpecialCareOpen(!importSpecialCareOpen);
    };
    const onRegister = (values) => {
        setImportSpecialCareOpen(false);
    }

    const columns = [
        { field: 'ID', header: 'ID' },
        {
            field: '要配慮者事項', header: translate(localeJson, 'special_care_name_jp'), minWidth: "10rem", body: (rowData) => (
                <div className='text-link'>
                    <a className='text-decoration' style={{ color: "grren" }} onClick={() => setSpecialCareEditOpen(true)}>
                        {rowData['要配慮者事項']}
                    </a>
                </div>
            )
        },
        { field: '要配慮者事項（英語)', header: translate(localeJson, 'special_care_name_en'), minWidth: "10rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'delete'),
            textAlign: "center",
            alignHeader: "center",
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'delete'), buttonClass: "text-primary",
                        bg: "bg-red-600 text-white",
                        hoverBg: "hover:bg-red-500 hover:text-white",
                        onClick: () => setSpecialCareCreateDialogVisible(true)
                    }} />
                </div>
            ),
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            await AdminSpecialCareService.getAdminsSpecialCareMedium().then((data) => setAdmins(data));
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <>
            <CommonDialog
                open={specialCareCreateDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'confirmation_information')}
                content={
                    <div>
                        <p>{translate(localeJson, 'once_deleted_cannot_restore')}</p>
                        <p>{translate(localeJson, 'do_you_want_to_delete')}</p>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => onClickCancelButton(),
                        },
                        parentClass: "inline"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-8rem",
                            type: "submit",
                            text: translate(localeJson, 'ok'),
                            severity: "danger",
                            onClick: () => onClickOkButton(),
                        },
                        parentClass: "inline"
                    }
                ]}
                close={() => {
                    setSpecialCareCreateDialogVisible(false);
                }}
            />
            <SpecialCareEditModal
                open={specialCareEditOpen}
                header={translate(localeJson, 'special_care_edit')}
                close={() => setSpecialCareEditOpen(false)}
                buttonText={translate(localeJson, 'update')}
                onSpecialCareEditSuccess={onSpecialCareEditSuccess}
            />
            <SpecialCareEditModal
                open={specialCarCreateOpen}
                header={translate(localeJson, 'special_care_create')}
                close={() => setSpecialCareCreateOpen(false)}
                buttonText={translate(localeJson, 'submit')}
                onSpecialCareEditSuccess={onSpecialCareEditSuccess}
            />
            <AdminManagementImportModal
                open={importSpecialCareOpen}
                close={onSpecialCareImportClose}
                register={onRegister}
                modalHeaderText={translate(localeJson, 'special_care_import')}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page_header'>{translate(localeJson, 'special_care_list')}</h5>
                        <hr />
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'import'),
                                onClick: () => setImportSpecialCareOpen(true),
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
                                text: translate(localeJson, 'create_special_care'),
                                onClick: () => setSpecialCareCreateOpen(true),
                                severity: "success"
                            }} parentClass={"mr-1 mt-1"} />
                        </div>
                        <div className='mt-3'>
                            <NormalTable tableStyle={{ minWidth: "40rem" }} paginatorLeft={true} paginator={"true"} showGridlines={"true"} rows={10} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}