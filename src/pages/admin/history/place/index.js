import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { AdminHistoryPlaceService } from '@/helper/adminHistoryPlaceService';
import { SelectFloatLabel } from '@/components/dropdown';
import { DateTimeCalendarFloatLabel } from '@/components/date&time';

export default function AdminHistoryPlacePage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const columns = [
        { field: 'Sl No', header: 'No', minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: '報告日時', header: '報告日時', minWidth: "15rem", sortable: true },
        { field: '地区', header: '地区', minWidth: "6rem", sortable: true },
        { field: '避難所名', header: '避難所名', minWidth: "12rem", sortable: true },
        { field: '避難所名 (フリガナ)', header: '避難所名 (フリガナ)', minWidth: "12rem", sortable: true },
        { field: "所在地（経度）", header: "所在地（経度）", minWidth: "10rem", sortable: true },
        { field: "所在地（緯度）", header: "所在地（緯度）", minWidth: "10rem", sortable: true },
        { field: "所在地（経度1）", header: "所在地（経度）", minWidth: "10rem", sortable: true },
        { field: "外部公開", header: "外部公開", minWidth: "8rem", sortable: true },
        { field: "開設状況", header: "開設状況", minWidth: "8rem", sortable: true },
        { field: "避難者数", header: "避難者数", minWidth: "7rem", sortable: true },
        { field: "満空状況", header: "満空状況", minWidth: "7rem", sortable: true },
        { field: "開設日時", header: "開設日時", minWidth: "15rem", sortable: true },
        { field: "閉鎖日時", header: "閉鎖日時", minWidth: "15rem", sortable: true },
        { field: "備考", header: "備考", minWidth: "5rem" },

    ];

    useEffect(() => {
        AdminHistoryPlaceService.getAdminsHistoryPlaceMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div className='w-full flex flex-wrap sm:flex-no-wrap align-items-center justify-content-between gap-2'>
                        <div className='flex justify-content-center align-items-center gap-2'>
                            <h5 className='page_header'>{translate(localeJson, 'admin_management')}</h5>
                        </div>
                        <div className='w-full md:w-auto flex flex-grow justify-content-end align-items-center gap-2'>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "w-50",
                                text: translate(localeJson, 'export'),
                                severity: "primary"
                            }} />

                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "w-50",
                                text: "メール設定",
                                onClick: () => router.push('/admin/admin-management/create'),
                                severity: "success"
                            }} />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <form>
                            {/* <div className='w-full flex flex-wrap sm:flex-no-wrap align-items-center justify-content-between gap-2'> */}

                                <div className='mt-5 mb-3 flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow align-items-center justify-content-end gap-2' >
                                    <div  >
                                        <DateTimeCalendarFloatLabel dateTimeFloatLabelProps={{
                                            inputId: "開設日",
                                            selectionMode: "range",
                                            text: "開設日",
                                            dateTimeClass: ""
                                        }} parentClass={"custom-margin w-50"} />
                                    </div>
                                    <div>
                                        <SelectFloatLabel selectFloatLabelProps={{
                                            inputId: "dd-city",
                                            selectClass: "dropdown_width",
                                            value: selectedCity,
                                            options: cities,
                                            optionLabel: "name",
                                            onChange: (e) => setSelectedCity(e.value),
                                            text: "避難所名"
                                        }} parentClass="w-full" />
                                    </div>
                                    <div>
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button",
                                            text: "検索",
                                            icon: "pi pi-search",
                                            severity: "primary"
                                        }} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <NormalTable
                            size={"small"}
                            stripedRows={true}
                            rows={10}
                            paginator={"true"}
                            showGridlines={"true"}
                            value={admins}
                            columns={columns}
                            paginatorLeft={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}