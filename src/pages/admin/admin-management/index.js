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
        { field: '氏名', header: <span data-tip="Tooltip text for 氏名">氏名</span>, minWidth: "15rem" },

        // { field: '氏名', header: '氏名', minWidth: "15rem" },
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
                                    <div className="pt-3 ">
                                        <div className='pb-1'>
                                            <NormalLabel labelClass="pt-1" text={translate(localeJson, 'full_name')} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            inputClass: "create_input_stock"
                                        }} />
                                    </div>
                                    <div className='flex pt-3 pb-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                        <div >
                                            <Button buttonProps={{
                                                buttonClass: "evacuation_button_height",
                                                type: 'submit',
                                                text: "検索",
                                                rounded: "true",
                                                severity: "primary"
                                            }} parentStyle={{ paddingLeft: "10px" }} />
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
    )
}