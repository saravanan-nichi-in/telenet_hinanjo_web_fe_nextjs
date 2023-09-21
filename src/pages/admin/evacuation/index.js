import React, { useState, useContext, useEffect } from 'react';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, NormalTable, Select } from '@/components';
import { AdminEvacueesListService } from '@/helper/adminEvacueesListService';

export default function EvacuationPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const options = ["--", "Vacant Test", "Starting To get Crowded", "Crowded", "Closed", "InActiveClosedDateNotPresent", "Nara"];
    const [totalSamari, setTotalSamari] = useState(57);
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [admins, setAdmins] = useState([]);
    const columns = [
        { field: 'ID', header: 'ID', minWidth: "8rem", sortable: false, textAlign: 'center' },
        { field: '世帯人数', header: '世帯人数', minWidth: "15rem", sortable: false, textAlign: 'center' },
        { field: '世帯番号', header: '世帯番号', minWidth: "8rem", sortable: false, textAlign: 'center' },
        { field: '代表者', header: '代表者', minWidth: "12rem", sortable: false, textAlign: 'center' },
        { field: '氏名 (フリガナ)', header: '避難所名 (フリガナ)', minWidth: "12rem", sortable: false, textAlign: 'center' },
        { field: "氏名 (漢字)", header: "氏名 (漢字)", minWidth: "10rem", sortable: false, textAlign: 'center' },
        { field: "性別", header: "性別", minWidth: "10rem", sortable: false, textAlign: 'center' },
        { field: "生年月日", header: "生年月日", minWidth: "10rem", sortable: false, textAlign: 'center' },
        { field: "年齢", header: "年齢", minWidth: "8rem", sortable: false, textAlign: 'center' },
        { field: "年齢_月", header: "年齢_月", minWidth: "8rem", sortable: false, textAlign: 'center' },
        { field: "要配慮者番号", header: "要配慮者番号", minWidth: "8rem", sortable: false, textAlign: 'center' },
        { field: "紐付コード", header: "紐付コード", minWidth: "8rem", sortable: false, textAlign: 'center' },
        { field: "備考", header: "備考", minWidth: "7rem", sortable: false, textAlign: 'center' },
        { field: "避難所", header: "避難所", minWidth: "15rem", sortable: false, textAlign: 'center' },
        { field: "退所日時", header: "退所日時", minWidth: "15rem", sortable: false, textAlign: 'center' },
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
                        {/* Header */}
                        <h5 className='page_header'>{translate(localeJson, 'list_of_evacuees')}</h5>
                        {/* <DividerComponent /> */}
                        <hr />
                        <div>
                            <div>
                                <form>
                                    <div className="pt-3">
                                        <div className='pb-1'>
                                            <NormalLabel labelClass="pt-1 pr-5 evacuation_label" text={translate(localeJson, 'evacuation_site')} />
                                        </div>
                                        <Select selectProps={{
                                            selectClass: "create_input_stock",
                                            value: selectedOption,
                                            options: options,
                                            onChange: (e) => setSelectedOption(e.value)
                                        }}
                                        />
                                    </div>
                                    <div className='pt-3' >
                                        <div className='pb-1'>
                                            <NormalLabel labelClass="pt-1" text={translate(localeJson, 'household_number')} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            keyfilter: "num",
                                            inputClass: "create_input_stock",

                                        }} />
                                    </div>
                                    <div className='pt-3'>
                                        <div className='pb-1'>
                                            <NormalLabel labelClass="pt-1" text={translate(localeJson, 'full_name')} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            inputClass: "create_input_stock",

                                        }} />
                                    </div>
                                    <div className='flex pt-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                        <div >
                                            <Button buttonProps={{
                                                buttonClass: "evacuation_button_height",
                                                type: 'submit',
                                                text: "検索",
                                                rounded: "true",
                                                severity: "primary"
                                            }} parentClass={"mt-1"} />
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
                        <NormalTable size={"small"} stripedRows={true} rows={10} paginator={"true"} showGridlines={"true"} value={admins} columns={columns} paginatorLeft={true} alignHeader={'center'}  />
                    </section>
                </div>
            </div>
        </div>
    )
}