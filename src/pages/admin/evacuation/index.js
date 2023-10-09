import React, { useState, useContext, useEffect } from 'react';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { AdminEvacueesListService } from '@/helper/adminEvacueesListService';
import { InputFloatLabel } from '@/components/input';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { evacuationStatusOptions, evacuationTableColumns } from '@/utils/constant';

/**
 * Display Evacuees List 
 * @param `shelterPlaceName, HouseHoldNumber, Evacuee Name`
 * @returns Table view
 */

export default function EvacuationPage() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [totalSamari, setTotalSamari] = useState(57);
    const [selectedOption, setSelectedOption] = useState(null);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await AdminEvacueesListService.getAdminsEvacueesListMedium().then((data) => setAdmins(data));
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'list_of_evacuees')}</h5>
                    <hr />
                    <div>
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            inputId: "evacuationCity",
                                            value: selectedOption,
                                            options: evacuationStatusOptions,
                                            optionLabel: "name",
                                            inputSelectClass: "w-20rem lg:w-14rem md:w-14rem sm:w-10rem",
                                            onChange: (e) => setSelectedOption(e.value),
                                            text: translate(localeJson, 'evacuation_site')
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            id: 'householdNumber',
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'household_number'),
                                        }}
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            id: 'fullName',
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'full_name'),
                                            custom: "mobile-input custom_input"
                                        }}
                                    />
                                    <div className="">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input ",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            severity: "primary"
                                        }} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <p className='pt-4 page-header2 font-bold'>{translate(localeJson, "totalSummary")}: {totalSamari}</p>
                            </div>
                            <div className='flex pt-3' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                }} parentClass={"mb-3"} />
                            </div>
                        </div>
                    </div>
                    <NormalTable
                        size={"small"}
                        stripedRows={true}
                        rows={10}
                        paginator={"true"}
                        showGridlines={"true"}
                        value={admins}
                        columns={evacuationTableColumns}
                        paginatorLeft={true} />
                </div>
            </div>
        </div>
    )
}