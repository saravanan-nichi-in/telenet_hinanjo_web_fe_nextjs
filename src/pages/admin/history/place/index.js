import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DateTimeCalendar, DividerComponent, InputIcon, NormalLabel, NormalTable, Select } from '@/components';
import { AdminHistoryPlaceService } from '@/helper/adminHistoryPlaceService';

export default function AdminHistoryPlacePage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();

    const columns = [
        { field: 'Sl No', header: 'Sl No', minWidth: "5rem" },
        { field: '報告日時', header: '報告日時', minWidth: "15rem" },
        { field: '地区', header: '地区', minWidth: "6rem" },
        { field: '避難所名', header: '避難所名', minWidth: "12rem" },
        { field: '避難所名 (フリガナ)', header: '避難所名 (フリガナ)', minWidth: "12rem" },
        { field: "所在地（経度）", header: "所在地（経度）", minWidth: "10rem" },
        { field: "所在地（緯度）", header: "所在地（緯度）", minWidth: "10rem" },
        { field: "所在地（経度1）", header: "所在地（経度）", minWidth: "10rem" },
        { field: "外部公開", header: "外部公開", minWidth: "8rem" },
        { field: "開設状況", header: "開設状況", minWidth: "8rem" },
        { field: "避難者数", header: "避難者数", minWidth: "7rem" },
        { field: "満空状況", header: "満空状況", minWidth: "7rem" },
        { field: "開設日時", header: "開設日時", minWidth: "15rem" },
        { field: "閉鎖日時", header: "閉鎖日時", minWidth: "15rem" },
        { field: "備考", header: "備考", minWidth: "5rem" },

    ];

    useEffect(() => {
        AdminHistoryPlaceService.getAdminsHistoryPlaceMedium().then((data) => setAdmins(data));
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
                                    text: translate(localeJson, 'export'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />

                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: "メール設定",
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
                                            <NormalLabel labelClass="pt-1" text={"開設日"} />
                                        </div>
                                        <DateTimeCalendar dateTimeProps={{
                                            selectionMode: "range",
                                            dateTimeClass: "create_input_stock"
                                        }} />
                                        <div className='pt-3'>
                                            <div className='pb-1'>
                                                <NormalLabel labelClass="pt-1" text={"避難所名"} />
                                            </div>
                                            <Select selectProps={{
                                                selectClass: "custom_dropdown_items create_input_stock",
                                            }}

                                            />
                                        </div>
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

                            <NormalTable rows={10} paginator={"true"} showGridlines={"true"} columnStyle={{ textAlign: 'center' }} value={admins} columns={columns} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}