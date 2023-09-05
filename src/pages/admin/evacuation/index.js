import React, { useRef, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, Select } from '@/components';
export default function EvacuationPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const options = ["--", "日比谷公園避難所", "芝公園避難所", "避難所1", "避難所A", "らくらく避難所", "八代総合会館", "芦川小学校", "笛吹市役所(避難場所連絡)", "EvacutionNew", "避難所避難所避難所避難所避難所避難所避難所避難所"];
    const [ totalSamari, setTotalSamari ] = useState(38);
    const [selectedOption, setSelectedOption] = useState(options[0]);
    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>{translate(localeJson, 'list_of_evacuees')}</h5>
                        <DividerComponent />
                        <div className="col-12">
                            <div>
                                <form>
                                    <div className="evacuation_form pt-3">
                                        <NormalLabel labelClass="pt-1 pr-5 evacuation_label" text={translate(localeJson, 'evacuation_site')} />
                                        <Select selectProps={{
                                            selectClass: "evacuation_dropdown",
                                            value: selectedOption,
                                            options: options,
                                            onChange: (e) => setSelectedOption(e.value)
                                        }}
                                        />
                                    </div>
                                    <div className='evacuation_form pt-3' >
                                        <NormalLabel labelClass="pt-1 pr-5 evacuation_label" text={translate(localeJson, 'household_number')} />
                                        <InputIcon inputIconProps={{
                                            keyfilter: "num",
                                            inputClass: "evacuation_dropdown"

                                        }} />
                                    </div>
                                    <div className='evacuation_form pt-3'>
                                        <NormalLabel labelClass="pt-1 pr-5 evacuation_label" text={translate(localeJson, 'full_name')} />
                                        <InputIcon inputIconProps={{
                                            inputClass: "evacuation_dropdown"
                                        }} />
                                    </div>
                                    <div>
                                        <Button buttonProps={{
                                            type: 'submit',
                                            text: "検索",
                                            rounded: "true",
                                            severity: "primary"
                                        }} parentStyle={{ paddingTop: "10px", paddingLeft: "60px" }} />
                                    </div>
                                </form>
                            </div>
                                <div>
                                    <p className='pt-5' style={{ fontSize: "14px", fontWeight: "bold" }}>合計（サマリ）: {totalSamari}</p>
                                </div>
                                <div className='' style={{textAlign:"end"}}>
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded:"true",
                                        text: translate(localeJson, 'export'),
                                        severity: "primary"
                                    }} parentClass={"mb-2"} />
                                </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}