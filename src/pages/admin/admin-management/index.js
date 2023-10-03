import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputFloatLabel, InputIcon, NormalLabel, NormalTable } from '@/components';
import { AdminManagementService } from '@/helper/adminManagementService';
import { AdmiinManagementDetailModal, AdmiinManagementEditModal } from '@/components/modal';

export default function AdminManagementPage() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [editAdminOpen, setEditAdminOpen] = useState(false);
    const [adminDetailsOpen, setAdminDetailsOpen] = useState(false);


    useEffect(() => {
        AdminManagementService.getAdminsMedium().then((data) => setAdmins(data));
    }, []);
    /**
    * Email setting modal close
   */
    const onAdminClose = () => {
        setEditAdminOpen(!editAdminOpen);
    };

    const onAdminDetailClose = () => {
        setAdminDetailsOpen(!adminDetailsOpen);
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEditAdminOpen(false);
    };

    const columns = [
        { field: 'No.', header: 'No.' },
        {
            field: '氏名', header: <span data-tip="Tooltip text for 氏名">氏名</span>, minWidth: "15rem", body: (rowData) => (
                <a className='text-decoration' onClick={() => setAdminDetailsOpen(true)}>
                    {rowData['氏名']}
                </a>
            )
        },
        { field: 'メール', header: 'メール' },
        {
            field: 'actions',
            header: '編集',
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: "編集", buttonClass: "text-primary",
                        bg: "bg-white",
                        onClick: () => setEditAdminOpen(true),
                        hoverBg: "hover:bg-primary hover:text-white",
                    }} />
                </div>
            ),
        }, {
            field: 'actions',
            header: '削除',
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: "削除", buttonClass: "text-primary",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                    }} />
                </div>
            ),
        },
    ];



    return (
        <React.Fragment>
            {/* Place history email settings modal */}
            <AdmiinManagementEditModal
                open={editAdminOpen}
                close={onAdminClose}
                register={onRegister}
            />
            <AdmiinManagementDetailModal
                open={adminDetailsOpen}
                close={onAdminDetailClose}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <section className='col-12'>
                            <h5 className='page-header1'>{translate(localeJson, 'admin_management')}</h5>
                            <hr/>
                            <div >
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
                                        onClick: () => router.push('/admin/admin-management/create'),
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
                                                    inputClass: "w-17rem lg:w-22rem md:w-20rem sm:w-14rem "
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
                                <NormalTable showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}