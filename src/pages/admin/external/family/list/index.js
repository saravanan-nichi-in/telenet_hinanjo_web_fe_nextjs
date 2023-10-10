import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { evacuationFoodSupport, evacuationSiteType, evacuationStatusOptions, externalEvacueesListColumns } from '@/utils/constant';
import { AdminExternalEvacueesList } from '@/helper/adminExternalEvacueesListService';

export default function ExteranalEvacuationPage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedSiteType, setSelectedSiteType] = useState(null);
    const [selectedFoodSupport, setSelectedFoodSupport] = useState(null);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        AdminExternalEvacueesList.getAdminsExternalEvacueesListMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                        <h5 className='page-header1'>{translate(localeJson, 'external_evacuee_details')}</h5>
                        <span>{translate(localeJson, 'external_evacuees_count') + ": 39人"}</span>
                    </div>
                    <hr />
                    <div className='flex justify-content-end'>
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'export'),
                            }} parentClass={"mb-3"} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <form>
                                <div className='mt-2 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            inputId: "evacueeSiteType",
                                            value: selectedSiteType,
                                            options: evacuationSiteType,
                                            optionLabel: "name",
                                            selectClass: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            style: { height: "40px" },
                                            onChange: (e) => setSelectedSiteType(e.value),
                                            text: translate(localeJson, 'shelter_site_type')
                                        }}
                                        parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            inputId: "evacuationCity",
                                            value: selectedOption,
                                            options: evacuationStatusOptions,
                                            optionLabel: "name",
                                            selectClass: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            style: { height: "40px" },
                                            onChange: (e) => setSelectedOption(e.value),
                                            text: translate(localeJson, 'shelter_place')
                                        }}
                                        parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            inputId: "evacueeFoodSupport",
                                            value: selectedFoodSupport,
                                            options: evacuationFoodSupport,
                                            optionLabel: "name",
                                            selectClass: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            style: { height: "40px" },
                                            onChange: (e) => setSelectedFoodSupport(e.value),
                                            text: translate(localeJson, 'food_support'),
                                            custom: "mobile-input"
                                        }}
                                        parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem"
                                    />
                                    <div>
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

                    </div>
                    <NormalTable
                        size={"small"}
                        stripedRows={true}
                        rows={10}
                        paginator={"true"}
                        showGridlines={"true"}
                        value={admins}
                        columns={externalEvacueesListColumns}
                        paginatorLeft={true}
                    />

                    <div className='mt-3 flex justify-content-center'>
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'return'),
                                onClick: () => router.push('/admin/external/family'),
                            }} parentClass={"mb-3"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}