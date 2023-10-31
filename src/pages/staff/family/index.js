import React, { useContext, useEffect, useState } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, InputFloatLabel, InputNumberFloatLabel, NormalTable } from '@/components';
import { StaffFamilyService } from '@/helper/staffFamilyService';
import { InputSelectFloatLabel } from '@/components/dropdown';

function StaffFamily() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [staffFamilyValues, setStaffFamilyValues] = useState([]);
    const staffFamily = [
        { field: 'id', header: translate(localeJson, 's_no'),headerClassName: "custom-header", className: "sno_class" },
        { field: 'number_of_households', header: translate(localeJson, 'number_of_household'),headerClassName: "custom-header",minWidth: "7rem" },
        { field: 'family_code', header: translate(localeJson, 'family_code'),headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'household_representative', header: translate(localeJson, 'household_representative'),headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'name_phonetic', header: translate(localeJson, 'name_phonetic'),headerClassName: "custom-header", minWidth: "9rem", body: (rowData) => (
            <div className='text-link'>
                <a className='text-decoration'>
                    {rowData['name_phonetic']}
                </a>
            </div>
        )
    },
        { field: 'name_kanji', header: translate(localeJson, 'name_kanji'),headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'gender', header: translate(localeJson, 'gender'),headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'dob', header: translate(localeJson, 'dob'),headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'age', header: translate(localeJson, 'age'),headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'age_m', header: translate(localeJson, 'age_m'),headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'special_care_type', header: translate(localeJson, 'special_Care_type'),headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'connecting_code', header: translate(localeJson, 'connecting_code'),headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'),headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'date_created', header: translate(localeJson, 'date_created'),headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'evacuation_days', header: translate(localeJson, 'evacuation_days'),headerClassName: "custom-header", minWidth: "6rem" },

    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        StaffFamilyService.getStaffFamilyMedium().then((data) => setStaffFamilyValues(data));
        fetchData();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                        <h5 className='page-header1'>{translate(localeJson, 'list_of_evacuees')}</h5>
                        <span>{translate(localeJson, 'total_summary') + ": " + 12 + translate(localeJson, 'people')}</span>
                    </div>
                    <hr />
                    <div>
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                    <InputNumberFloatLabel
                                        inputNumberFloatProps={{
                                            id: "familyCode",
                                            inputId: "integeronly",
                                            name: "familyCode",
                                            text: translate(localeJson, "family_code"),
                                            inputNumberClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                        }}
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'name'),
                                            custom: "mobile-input custom_input",
                                        }}
                                    />
                                    <div className="">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input ",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            severity: "primary",
                                            type: "button",
                                            onClick: () => onSearchButtonClick()
                                        }} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'back_to_top'),
                                severity: "primary",
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'export'),
                                severity: "primary",
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'signup'),
                                severity: "success",
                            }} parentClass={"mr-1 mt-1"} />
                        </div>
                        <div className="mt-3">
                            <NormalTable
                                customActionsField="actions"
                                value={staffFamilyValues}
                                columns={staffFamily}
                                showGridlines={"true"}
                                stripedRows={true}
                                paginator={"true"}
                                columnStyle={{ textAlign: "center" }}
                                className={"custom-table-cell"}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                paginatorLeft={true}
                            />
                        </div>
                        {/* <div className="text-center mt-3">
                        <Button buttonProps={{
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'back_to_top'),
                            onClick: () => router.push('/staff/dashboard'),
                        }} parentClass={"inline"} />
                        <Button buttonProps={{
                            buttonClass: "w-8rem",
                            type: "button",
                            severity: "primary",
                            text: translate(localeJson, 'inventory'),
                        }} parentClass={"inline pl-2"} />
                    </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffFamily;

