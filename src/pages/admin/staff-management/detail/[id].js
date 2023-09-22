import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, NormalTable } from '@/components';
import { CustomerService } from '@/helper/datatableservice';
import { AdminStaffDetailService } from '@/helper/adminStaffDetail';

export default function StaffManagementEditPage() {
    const { localeJson } = useContext(LayoutContext);
    const [customers, setCustomers] = useState([]);
    const [admin, setAdmin] = useState([]);
    const router = useRouter();
    const columns = [
        {
            field: '氏名',
            header: '氏名',
            minWidth: "2rem"
        },
        { field: '電話番号', header: '電話番号', minWidth: "2rem" },
    ];
    const cols = [
        { field: 'No', header: 'No.', minWidth: "1rem" },
        { field: '避難所', header: '避難所', minWidth: "20rem" },
        { field: "ログイン日時", header: "ログイン日時", minWidth: "12rem" }
    ];

    useEffect(() => {
        CustomerService.getCustomersMedium().then((data) => setCustomers(data));
        AdminStaffDetailService.getAdminsStaffDetailMedium().then((data) => setAdmin(data));
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
                                <NormalTable tableStyle={{ maxWidth: "30rem" }} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={customers} columns={columns} />
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
                                        onClick: () => router.push('/admin/staff-management/edit/1'),
                                        text: translate(localeJson, 'renew'),
                                        rounded: "true",
                                        severity: "primary"
                                    }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                </div>
                            </div>
                            <div >
                                <h5 className='page_header pt-3'>ログイン履歴</h5>
                                <div>
                                    <NormalTable paginator={"true"} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} value={admin} columns={cols} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}