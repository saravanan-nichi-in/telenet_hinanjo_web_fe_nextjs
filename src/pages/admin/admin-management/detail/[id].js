import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, NormalTable } from '@/components';
import { AdminManagementService } from '@/helper/adminManagementService';

export default function StaffManagementEditPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admin, setAdmins] = useState([]);
    const router = useRouter();

    const columns = [
        { field: '氏名', header: '氏名', minWidth: "8rem" },
        { field: 'メール', header: 'メール' },
    ];

    useEffect(() => {
        AdminManagementService.getAdminsMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>スタッフ詳細情報</h5>
                        <DividerComponent />
                        <div>
                            <div>
                                <NormalTable tableStyle={{ maxWidth: "30rem" }} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admin} columns={columns} />
                            </div>
                            <div className='flex pt-3 pb-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                <div>
                                    <Button buttonProps={{
                                        buttonClass: "text-600 border-500 evacuation_button_height",
                                        bg: "bg-white",
                                        type: "button",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        text: translate(localeJson, 'cancel'),
                                        rounded: "true",
                                        severity: "primary"
                                    }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                </div>
                                <div >
                                    <Button buttonProps={{
                                        buttonClass: "evacuation_button_height",
                                        type: 'button',
                                        onClick: () => router.push('/admin/admin-management/edit/1'),
                                        text: translate(localeJson, 'renew'),
                                        rounded: "true",
                                        severity: "primary"
                                    }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}