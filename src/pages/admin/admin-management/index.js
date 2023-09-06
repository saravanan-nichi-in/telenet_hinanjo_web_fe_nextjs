import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, NormalTable } from '@/components';
import { AdminManagementService } from '@/helper/adminManagementService';

export default function AdminManagementPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();

    const columns = [
        { field: 'No.', header: 'No.' },
        { field: '氏名', header: '氏名', minWidth: "15rem" },
        { field: 'メール', header: 'メール' },
        {
            field: 'actions',
            header: '編集',
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: "編集", buttonClass: "text-primary",
                        bg: "bg-white",
                        onClick: () => router.push('/admin/admin-management/edit/1'),
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

    useEffect(() => {
        AdminManagementService.getAdminsMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'admin_management')}</h5>
                        <DividerComponent />
                        <div className="col-12">
                            <div>
                                <form>
                                    <div className="evacuation_form pt-3 ">
                                        <NormalLabel labelClass="pt-1 pr-5 evacuation_label" text={translate(localeJson, 'full_name')} />
                                        <InputIcon inputIconProps={{
                                            inputClass: "evacuation_dropdown"
                                        }} />
                                    </div>
                                    <div>
                                        <Button buttonProps={{
                                            type: 'submit',
                                            text: "検索",
                                            rounded: "true",
                                            severity: "primary"
                                        }} parentStyle={{ paddingTop: "10px", paddingLeft: "60px" }} />
                                    </div>
                                </form>
                            </div>
                            <div>
                            </div>
                            <div className='col-12'>
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
                            <NormalTable showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}