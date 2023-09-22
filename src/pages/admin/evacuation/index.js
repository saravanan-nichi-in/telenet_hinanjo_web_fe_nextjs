import React, { useState, useContext, useEffect } from 'react';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { AdminEvacueesListService } from '@/helper/adminEvacueesListService';
import { InputFloatLabel } from '@/components/input';
import { SelectFloatLabel } from '@/components/dropdown';

export default function EvacuationPage() {
    const {localeJson } = useContext(LayoutContext);
    const options = [
        {name:"Vacant Test", code:"VT"},
        {name:"Starting To get Crowded", code:"SGT"},
        {name:"InActiveClosedDateNotPresent", code:"ICDP"},
        {name:"Crowded", code:"CD"},
        {name:"Closed", code:"CLD"},
        {name:"Nara", code:"NR"}
    ];
    const [totalSamari, setTotalSamari] = useState(57);
    const [selectedOption, setSelectedOption] = useState(null);
    const [admins, setAdmins] = useState([]);
    const columns = [
        { field: 'ID', header: 'ID', minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: '世帯人数', header: '世帯人数', minWidth: "15rem", sortable: true, textAlign: 'center' },
        { field: '世帯番号', header: '世帯番号', minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: '代表者', header: '代表者', minWidth: "12rem", sortable: true, textAlign: 'center' },
        { field: '氏名 (フリガナ)', header: '避難所名 (フリガナ)', minWidth: "12rem", sortable: true, textAlign: 'center' },
        { field: "氏名 (漢字)", header: "氏名 (漢字)", minWidth: "10rem", sortable: true, textAlign: 'center' },
        { field: "性別", header: "性別", minWidth: "10rem", sortable: true, textAlign: 'center' },
        { field: "生年月日", header: "生年月日", minWidth: "10rem", sortable: true, textAlign: 'center' },
        { field: "年齢", header: "年齢", minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: "年齢_月", header: "年齢_月", minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: "要配慮者番号", header: "要配慮者番号", minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: "紐付コード", header: "紐付コード", minWidth: "8rem", sortable: true, textAlign: 'center' },
        { field: "備考", header: "備考", minWidth: "7rem", sortable: true, textAlign: 'center' },
        { field: "避難所", header: "避難所", minWidth: "15rem", sortable: true, textAlign: 'center' },
        { field: "退所日時", header: "退所日時", minWidth: "15rem", sortable: true, textAlign: 'center' },
        { field: "現在の滞在場所", header: "現在の滞在場所", minWidth: "10rem", textAlign: 'center' },

    ];

    useEffect(() => {
        AdminEvacueesListService.getAdminsEvacueesListMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'list_of_evacuees')}</h5>
                        <hr />
                        <div>
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2'>
                                    <SelectFloatLabel 
                                        selectFloatLabelProps = {{
                                            inputId:"evacuationCity",
                                            value: selectedOption,
                                            options: options,
                                            optionLabel:"name",
                                            selectClass : "w-7rem lg:w-11rem md:w-14rem sm:w-8rem ",
                                            style: {height: "40px"},
                                            onChange: (e) => setSelectedOption(e.value),
                                            text: translate(localeJson, 'evacuation_site')
                                        }}
                                    />
                                    <InputFloatLabel 
                                        inputFloatLabelProps={{
                                            id:'householdNumber',
                                            inputClass: "w-7rem lg:w-11rem md:w-14rem sm:w-8rem",
                                            style:{height: "40px"},
                                            text: translate(localeJson, 'household_number')
                                        }}
                                    />
                                    <InputFloatLabel 
                                        inputFloatLabelProps={{
                                            id:'fullName',
                                            inputClass: "w-7rem lg:w-11rem md:w-14rem sm:w-8rem",
                                            style:{height: "40px"},
                                            text: translate(localeJson, 'full_name')
                                        }}
                                    />
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
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div>
                                    <p className='pt-4' style={{ fontSize: "18px", fontWeight: "bold" }}>合計（サマリ）: {totalSamari}</p>
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
                            columns={columns} 
                            paginatorLeft={true} />
                    </section>
                </div>
            </div>
        </div>
    )
}