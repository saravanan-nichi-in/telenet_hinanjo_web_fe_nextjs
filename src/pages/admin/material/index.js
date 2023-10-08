import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DeleteModal, DividerComponent, NormalTable } from '@/components';
import { AdminMaterialService } from '@/helper/adminMaterialService';
import MaterialCreateEditModal from '@/components/modal/materialCreateEditModal';
import { AdminManagementDeleteModal } from '@/components/modal';

export default function AdminMaterialPage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const [checked1, setChecked1] = useState(false);
    const router = useRouter();
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const content = (
        <div>
            <p>一度削除したデータは、元に戻せません </p>
            <p>削除してもよろしいでしょうか？</p>
        </div>
    )
    const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
    const columns = [
        { field: 'ID', header: 'ID' },
        { field: '物資', header: '物資', minWidth: "20rem" },
        { field: '単位', header: '単位' },
        {
            field: 'actions',
            header: '削除',
            minWidth: "7rem",
            body: (rowData) => (
                 <div>
                 <Button buttonProps={{
                     text: translate(localeJson, 'delete'), buttonClass: "text-primary",
                     bg: "bg-white",
                     hoverBg: "hover:bg-primary hover:text-white",
                     onClick: () => setDeleteStaffOpen(true)
                 }} />
             </div>
            ),
        }
    ];

    const onStaffDeleteClose = () => {
        setDeleteStaffOpen(!deleteStaffOpen);
    };

     /**
     * Email setting modal close
    */
     const onEmailSettingsClose = () => {
        setEmailSettingsOpen(!emailSettingsOpen);
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEmailSettingsOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            await AdminMaterialService.getAdminsMaterialMedium().then((data) => setAdmins(data));
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <>
        <MaterialCreateEditModal
                open={emailSettingsOpen}
                close={onEmailSettingsClose}
                register={onRegister}
            />
             <AdminManagementDeleteModal
                        open={deleteStaffOpen}
                        close={onStaffDeleteClose}
                    />
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'material')}</h5>
                        <DividerComponent />
                        <div className="col-12">
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
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
                                    onClick: () => setEmailSettingsOpen(true),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div className='mt-3'>
                                <NormalTable paginator={"true"} showGridlines={"true"} rows={10} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}