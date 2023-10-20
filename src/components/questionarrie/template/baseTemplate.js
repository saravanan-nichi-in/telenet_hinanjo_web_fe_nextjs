import React, { useContext } from 'react';
import { OrderList } from 'primereact/orderlist';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { Button } from '@/components/button';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { NormalCheckBox } from '@/components/checkbox';
import { InputSwitch } from '@/components/switch';
import { Input } from '@/components/input';
import { RadioBtn } from '@/components/radioButton';
import { ValidationError } from '@/components/error';
// import { props } from 'cypress/types/bluebird';
// import useItems from 'antd/es/menu/hooks/useItems';
const BaseTemplate = (props) => {
    const { item } = props;
    console.log(item, "questionarrie");
    const { localeJson } = useContext(LayoutContext);
    const itemTemplate = (item) => {
        return (
            <div>
                <form>
                    <div>
                        <div className='mobile_questionaries mobile_accordion '>
                            <Accordion>
                                <AccordionTab header={`${translate(localeJson, 'item')} ${item.title}`}>
                                    {/* Questionnaires header */}
                                    <div className='mt-1' style={{
                                        backgroundColor: "#afe1f9"
                                    }}>
                                        <div className="col flex" style={{
                                            flexWrap: "wrap"
                                        }}>
                                            <div className=''>
                                                <div className='align-items-center pb-2'>
                                                    <NormalCheckBox checkBoxProps={{
                                                        checked: true,
                                                        labelClass: "pl-2",
                                                        value: translate(localeJson, 'required')
                                                    }} />
                                                </div>
                                                <div className='flex align-items-center pt-2 pb-2 switch-align' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <InputSwitch inputSwitchProps={{
                                                        checked: true
                                                    }} parentClass={"pr-2"} />
                                                    {translate(localeJson, 'display_in_registration_screen')}
                                                </div>
                                            </div>
                                            <div className='align-items-center pt-2 pb-2'>
                                                <div className=''>
                                                    <div className=" pb-2 flex align-items-center">
                                                        <RadioBtn radioBtnProps={{
                                                            checked: true
                                                        }} parentClass={"pr-2"}
                                                        />
                                                        {translate(localeJson, 'selection')}
                                                    </div>
                                                    <div className='pb-2 flex align-items-center '>
                                                        <RadioBtn radioBtnProps={{
                                                            checked: true
                                                        }} parentClass={"pr-2"}
                                                        />
                                                        {translate(localeJson, 'description')}
                                                    </div>
                                                    <div className='pb-2 flex align-items-center'>
                                                        <RadioBtn radioBtnProps={{
                                                            checked: true
                                                        }} parentClass={"pr-2"}
                                                        />
                                                        {translate(localeJson, 'numeric')}
                                                    </div>
                                                </div>
                                                <div className='pt-2 flex align-items-center justify-content-start' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <InputSwitch inputSwitchProps={{
                                                        checked: true
                                                    }} parentClass={"pr-2"} />
                                                    {translate(localeJson, 'voice_input')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Questionnaires */}
                                    <div className="p-2">
                                        <div className="align-items-center justify-content-center content-align">
                                            {translate(localeJson, 'item_title')}
                                        </div>
                                        <div >
                                            <div className='col-12 align-items-center'>
                                                <Input inputProps={{
                                                    inputClass: "col-12 p-inputtext-sm",
                                                    value: item.questiontitle,
                                                }} />
                                            </div>
                                            <div className='col-12 align-items-center'>
                                                <Input inputProps={{
                                                    inputClass: "col-12",
                                                    value: item.questiontitle_en,
                                                }} />
                                            </div>
                                        </div>
                                        <div className='align-items-center justify-content-center content-align' >
                                            <Button buttonProps={{
                                                text: `－ ${translate(localeJson, 'del_item')}`,
                                                severity: "danger",
                                                rounded: "true",
                                                // buttonClass: "evacuation_button_height",
                                            }} />
                                        </div>
                                    </div>
                                    {/* Questionnaires options */}
                                    {Array.isArray(item.option) && item.option.map((option, i) => (
                                        <div key={i} className="p-2">
                                            <div className=" align-items-center content-align">
                                                {translate(localeJson, 'choice')}{i + 1}<span style={{
                                                    color: "red"
                                                }}>*</span>
                                            </div>
                                            <div>
                                                <div className='col-12 align-items-center'>
                                                    <Input inputProps={{
                                                        inputClass: "col-12 p-inputtext-sm mb-3",
                                                        value: option
                                                    }} />
                                                    {item.option_en.map((arr, j) => (
                                                        <div key={j}>
                                                            <Input inputProps={{
                                                                inputClass: "col-12 p-inputtext-sm",
                                                                value: i == j ? arr : ""
                                                            }} />
                                                        </div>))}
                                                </div>
                                            </div>
                                            <div className='align-items-center content-align'>
                                                {i < 2 ? (
                                                    <Button buttonProps={{
                                                        text: `－ ${translate(localeJson, 'del_choice')}`,
                                                        severity: "danger",
                                                        // buttonClass: "evacuation_button_height",
                                                        rounded: "true"
                                                    }}
                                                    />
                                                ) : (
                                                    <Button buttonProps={{
                                                        text: `＋  ${translate(localeJson, 'add_choice')}`,
                                                        severity: "success",
                                                        rounded: "true",
                                                        // buttonClass: "evacuation_button_height"
                                                    }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </AccordionTab>
                            </Accordion>
                        </div>


                        <div className='hidden sm:block'>
                            {/* Questionnaires header */}
                            <div className="flex " style={{
                                backgroundColor: "#afe1f9",
                                border: "1px solid #000",
                            }}>
                                <div className="col-fixed col-2 flex align-items-center justify-content-center">
                                    {translate(localeJson, 'item')} {item.title}
                                </div>
                                <div className="col" style={{
                                    borderLeft: "1px solid #000"
                                }}>
                                    <div className='flex'>
                                        <div className='col-6 flex gap-2 align-items-center justify-content-start'>
                                            <NormalCheckBox checkBoxProps={{
                                                checked: true,

                                            }} />
                                            {translate(localeJson, 'required')}
                                        </div>
                                        <div className='col-6 flex  gap-2 align-items-center justify-content-end '>
                                            <InputSwitch inputSwitchProps={{
                                                checked: true
                                            }} />
                                            {translate(localeJson, 'display_in_registration_screen')}
                                        </div>
                                    </div>
                                    <div className='flex align-items-center justify-content-between'>
                                        <div className='col-6 xl:flex gap-3'>
                                            <div className='flex pb-2 gap-2 align-items-center justify-content-start'>
                                                <RadioBtn radioBtnProps={{
                                                    checked: true
                                                }}
                                                />
                                                {translate(localeJson, 'selection')}
                                            </div>
                                            <div className='flex  pb-2 gap-2 align-items-center justify-content-start'>
                                                <RadioBtn radioBtnProps={{
                                                    checked: true
                                                }}
                                                />
                                                {translate(localeJson, 'description')}
                                            </div>
                                            <div className='flex pb-2 gap-2 align-items-center justify-content-start'>
                                                <RadioBtn radioBtnProps={{
                                                    checked: true
                                                }}
                                                />
                                                {translate(localeJson, 'numeric')}
                                            </div>
                                        </div>
                                        <div style={{ paddingRight: "54px" }} className='col-6 custom-switch flex gap-2 align-items-center justify-content-end'>
                                            <InputSwitch inputSwitchProps={{
                                                checked: true
                                            }} />
                                            {translate(localeJson, 'voice_input')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Questionnaires */}
                            <div className="flex" style={{
                                borderRight: "1px solid #000",
                                borderBottom: "1px solid #000",
                                borderLeft: "1px solid #000",
                            }}>
                                <div className="col-fixed col-2 flex align-items-center justify-content-center">
                                    {translate(localeJson, 'item_title')}
                                </div>
                                <div className="col-7" style={{
                                    borderLeft: "1px solid #000",
                                }}>
                                    <div className='col-12'>
                                        <Input inputProps={{
                                            inputClass: "col-12",
                                            value: item.questiontitle
                                        }} />
                                    </div>
                                    <div className='col-12 align-items-center'>
                                        <Input inputProps={{
                                            inputClass: "col-12 p-inputtext-lg",
                                            value: item.questiontitle_en,
                                        }} />
                                    </div>
                                </div>
                                <div className='col-3 flex align-items-center justify-content-center' style={{
                                    borderLeft: "1px solid #000",
                                }}>
                                    <Button buttonProps={{
                                        text: `－ ${translate(localeJson, 'del_item')}`,
                                        severity: "danger",
                                        // buttonClass: "evacuation_button_height",
                                        rounded: "true"
                                    }} />
                                </div>
                            </div>
                            {/* Questionnaires options */}
                            {Array.isArray(item.option) && item.option.map((option, i) => (
                                <div key={i} className="flex" style={{
                                    borderRight: "1px solid #000",
                                    borderBottom: "1px solid #000",
                                    borderLeft: "1px solid #000",
                                }}>
                                    <div className="col-fixed col-2 flex align-items-center justify-content-center">
                                        {translate(localeJson, 'choice')} {i + 1}<span style={{
                                            color: "red"
                                        }}>*</span>
                                    </div>
                                    <div className="col-7" style={{
                                        borderLeft: "1px solid #000",
                                    }}>
                                        <div className='col-12 xl:flex gap-1 p-0 align-items-center ' style={{ justifyContent: "start", flexWrap: "wrap" }}>
                                            <Input inputProps={{
                                                name: "choice",
                                                value: option,
                                                inputClass: "w-full"
                                            }} parentClass={'col p-inputtext-lg md:w-full'} />
                                            {Array.isArray(item.option_en) && item.option_en.map((option_en, j) => (

                                                <div key={j}>
                                                    <Input inputProps={{
                                                        value: i == j ? option_en : "",
                                                        inputClass: "w-full"
                                                    }} parentClass="col p-inputtext-lg md:w-full " />
                                                </div>))}
                                        </div>
                                    </div>
                                    <div className='col-3 flex align-items-center justify-content-center' style={{
                                        borderLeft: "1px solid #000",
                                    }}>
                                        {i < 2 ? (
                                            <Button buttonProps={{
                                                text: `－ ${translate(localeJson, 'del_choice')}`,
                                                severity: "danger",
                                                onClick: () => handleDeleteChoice(i),
                                                // buttonClass: "evacuation_button_height",
                                                rounded: "true",

                                            }}
                                            />
                                        ) : (
                                            <Button buttonProps={{
                                                text: `＋  ${translate(localeJson, 'add_choice')}`,
                                                severity: "success",
                                                // buttonClass: "evacuation_button_height",
                                                rounded: "true",
                                            }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    return (
        // questionnaires && (
            <>
        <div className="grid custom_orderlist">
            <div className="col-12 ">
                {itemTemplate(item)}
            </div>
        </div>
        </>
        // ));
    )
};

export default BaseTemplate;