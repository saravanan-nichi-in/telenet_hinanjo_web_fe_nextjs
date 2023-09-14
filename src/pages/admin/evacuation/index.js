import React, { useState, useContext } from 'react';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, Select } from '@/components';

export default function EvacuationPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const options = ["--", "日比谷公園避難所", "芝公園避難所", "避難所1", "避難所A", "らくらく避難所", "八代総合会館", "芦川小学校", "笛吹市役所(避難場所連絡)", "EvacutionNew", "避難所避難所避難所避難所避難所避難所避難所避難所"];
    const [totalSamari, setTotalSamari] = useState(57);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>{translate(localeJson, 'list_of_evacuees')}</h5>
                        <DividerComponent />
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
                                            }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div>
                                <p className='pt-5' style={{ fontSize: "14px", fontWeight: "bold" }}>合計（サマリ）: {totalSamari}</p>
                            </div>
                            <div className='flex pt-3' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                }} parentClass={"mb-2"} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}