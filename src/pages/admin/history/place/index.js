import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { AdminHistoryPlaceService } from '@/helper/adminHistoryPlaceService';
import { SelectFloatLabel } from '@/components/dropdown';
import { DateTimeCalendarFloatLabel } from '@/components/date&time';
import { historyPageCities, historyTableColumns } from '@/utils/constant';

/**
 * Shelter Place History Status
 * @param reportedDate, shelterPlaceName
 * @returns Table View 
 */

export default function AdminHistoryPlacePage() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState(null);

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
                    </div>
                    <hr />
                    <div>
                        <div>
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
                                    text: translate(localeJson, 'mail_setting'),
                                    onClick: () => router.push('/admin/admin-management/create'),
                                    severity: "success"
                                }} />
                            </div>
                            <form>
                                <div className='mt-5 mb-3 flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow align-items-center justify-content-end gap-2 mobile-input' >
                                    <DateTimeCalendarFloatLabel dateTimeFloatLabelProps={{
                                        inputId: "settingStartDate",
                                        selectionMode: "range",
                                        text: translate(localeJson, "setting_start_date"),
                                        dateTimeClass: "w-full lg:w-13rem md:w-14rem sm:w-14rem"
                                    }} parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-14rem" />
                                    <SelectFloatLabel selectFloatLabelProps={{
                                        inputId: "shelterCity",
                                        selectClass: "w-full lg:w-13rem md:w-14rem sm:w-14rem",
                                        value: selectedCity,
                                        options: historyPageCities,
                                        optionLabel: "name",
                                        onChange: (e) => setSelectedCity(e.value),
                                        text: translate(localeJson, "shelter_place_name"),
                                        custom: "mobile-input custom-select"
                                    }} parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-14rem" />
                                    <div>
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input",
                                            text: translate(localeJson, "search_text"),
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
                            columns={historyTableColumns}
                            paginatorLeft={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}