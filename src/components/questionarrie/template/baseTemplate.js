import React from 'react';
import { OrderList } from 'primereact/orderlist';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { Button } from '@/components/button';
import { NormalCheckBox } from '@/components/checkbox';
import { InputSwitch } from '@/components/switch';
import { Input } from '@/components/input';
import { RadioBtn } from '@/components/radioButton';
// import useItems from 'antd/es/menu/hooks/useItems';

const BaseTemplate = ({ questionnaires, handleOnDrag }) => {
    const itemTemplate = (item) => {
        return (
            <div>
                <div className='mobile_questionaries mobile_accordion '>
                    <Accordion>
                        <AccordionTab header={`項目${item.title}`}>
                            {/* Questionnaires header */}
                            <div style={{
                                backgroundColor: "#afe1f9"
                            }}>
                                <div className="col flex" style={{
                                    flexWrap: "wrap"
                                }}>
                                    <div className=' '>
                                        <div className='align-items-center pb-2'>
                                            <NormalCheckBox checkBoxProps={{
                                                checked: true,
                                                value: "必須"
                                            }} />
                                        </div>
                                        <div className='flex align-items-center pt-2 pb-2 switch-align' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                            <InputSwitch inputSwitchProps={{
                                                checked: true
                                            }} />
                                            避難者登録画面表示
                                        </div>
                                    </div>
                                    <div className='align-items-center pt-2 pb-2'>
                                        <div className=''>
                                            <div className=" pb-2 flex align-items-center">
                                                <RadioBtn radioBtnProps={{
                                                    checked: true
                                                }}
                                                />
                                                選択形式
                                            </div>
                                            <div className='pb-2 flex align-items-center '>
                                                <RadioBtn radioBtnProps={{
                                                    checked: true
                                                }}
                                                />
                                                記述形式
                                            </div>
                                            <div className='pb-2 flex align-items-center'>
                                                <RadioBtn radioBtnProps={{
                                                    checked: true
                                                }}
                                                />
                                                数値形式
                                            </div>
                                        </div>
                                        <div className='pt-2 flex align-items-center justify-content-start' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                            <InputSwitch inputSwitchProps={{
                                                checked: true
                                            }} />
                                            避難者登録画面表示
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Questionnaires */}
                            <div className="p-2">
                                <div className="align-items-center justify-content-center content-align">
                                    項目タイトル
                                </div>
                                <div >
                                    <div className='col-12 align-items-center'>
                                        <Input inputProps={{
                                            inputClass: "col-12 p-inputtext-sm",
                                            value:item.questiontitle,
                                        }} />
                                    </div>
                                    <div className='col-12 align-items-center'>
                                        <Input inputProps={{
                                            inputClass: "col-12 p-inputtext-sm",
                                            placeholder: "項目（英語）",
                                            value:item.questiontitle_en,
                                        }} />
                                    </div>
                                </div>
                                <div className='align-items-center justify-content-center content-align' >
                                    <Button buttonProps={{
                                        text: "－ 項目削除",
                                        severity: "danger",
                                        rounded: "true"
                                    }} />
                                </div>
                            </div>
                            {/* Questionnaires options */}
                            {Array.isArray(item.option) && item.option.map((option, i) => (
                                <div key={i} className="p-2">
                                    <div className=" align-items-center content-align">
                                        選択肢{i + 1}<span style={{
                                            color: "red"
                                        }}>*</span>
                                    </div>
                                    <div>
                                        <div className='col-12 align-items-center'>
                                            <Input inputProps={{
                                                inputClass: "col-12 p-inputtext-sm mb-3",
                                                value: option
                                            }} />
                                            {item.option_en.map((arr, i) => (
                                                <div key={i}>
                                                    <Input inputProps={{
                                                        placeholder: "項目（英語）",
                                                        inputClass: "col-12 p-inputtext-sm",
                                                        value: arr
                                                    }} />
                                                </div>))}
                                        </div>
                                    </div>
                                    <div className='align-items-center content-align'>
                                        {i < 2 ? (
                                            <Button buttonProps={{
                                                text: " － 項目削除",
                                                severity: "danger",
                                                rounded: "true"
                                            }}
                                            />
                                        ) : (
                                            <Button buttonProps={{
                                                text: "＋ 選択肢追加",
                                                severity: "success",
                                                rounded: "true"
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
                            項目{item.title}
                        </div>
                        <div className="col" style={{
                            borderLeft: "1px solid #000"
                        }}>
                            <div className='flex'>
                                <div className='col-6 flex gap-2 align-items-center justify-content-start'>
                                    <NormalCheckBox checkBoxProps={{
                                        checked: true,

                                    }} />
                                    必須
                                </div>
                                <div className='col-6 flex  gap-2 align-items-center justify-content-end '>
                                    <InputSwitch inputSwitchProps={{
                                        checked: true
                                    }} />
                                    避難者登録画面表示
                                </div>
                            </div>
                            <div className='flex align-items-center justify-content-between'>
                                <div className='col-6 xl:flex gap-3'>
                                    <div className='flex pb-2 gap-2 align-items-center justify-content-start'>
                                        <RadioBtn radioBtnProps={{
                                            checked: true
                                        }}
                                        />
                                        選択形式
                                    </div>
                                    <div className='flex  pb-2 gap-2 align-items-center justify-content-start'>
                                        <RadioBtn radioBtnProps={{
                                            checked: true
                                        }}
                                        />
                                        記述形式
                                    </div>
                                    <div className='flex pb-2 gap-2 align-items-center justify-content-start'>
                                        <RadioBtn radioBtnProps={{
                                            checked: true
                                        }}
                                        />
                                        数値形式
                                    </div>
                                </div>
                                <div className='col-6 custom-switch flex gap-2 align-items-center justify-content-end'>
                                    <InputSwitch inputSwitchProps={{
                                        checked: true
                                    }} />
                                    避難者登録画面表示
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
                            項目タイトル
                        </div>
                        <div className="col-7" style={{
                            borderLeft: "1px solid #000",
                        }}>
                            <div className='col-12'>
                                <Input inputProps={{
                                    inputClass: "col-12 p-inputtext-lg",
                                    value: item.questiontitle
                                }} />
                            </div>
                            <div className='col-12 align-items-center'>
                                <Input inputProps={{
                                    inputClass: "col-12 p-inputtext-lg",
                                    value:item.questiontitle_en,
                                    placeholder: '項目（英語）'
                                }} />
                            </div>
                        </div>
                        <div className='col-3 flex align-items-center justify-content-center' style={{
                            borderLeft: "1px solid #000",
                        }}>
                            <Button buttonProps={{
                                text: "－ 項目削除",
                                severity: "danger",
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
                                選択肢{i + 1}<span style={{
                                    color: "red"
                                }}>*</span>
                            </div>
                            <div className="col-7" style={{
                                borderLeft: "1px solid #000",
                            }}>
                                <div className='col-12 xl:flex gap-3 p-0 align-items-center ' style={{ justifyContent: "start", flexWrap: "wrap" }}>
                                    <Input inputProps={{
                                        value:option,
                                        inputClass: "w-full"
                                    }} parentClass="col p-inputtext-lg md:w-full" />
                                                        {Array.isArray(item.option_en) && item.option_en.map((option_en, i) => (
                                        <div key={i}>
                                            <Input inputProps={{
                                                value: option_en,
                                                placeholder: `選択肢${i + 1}（英語）`,
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
                                        text: " － 項目削除",
                                        severity: "danger",
                                        rounded: "true",

                                    }}
                                    />
                                ) : (
                                    <Button buttonProps={{
                                        text: "＋ 選択肢追加",
                                        severity: "success",
                                        rounded: "true",
                                    }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        questionnaires && (
            <div className="grid custom_orderlist">
                <div className="col-12 mb-4">
                    <div className='xl:flex xl:justify-content-center"'>
                        <OrderList
                            value={questionnaires}
                            onChange={(e) => handleOnDrag(e)}
                            itemTemplate={itemTemplate}
                            draggable="true"
                            // className='col questionnaires_orderList'
                        >
                        </OrderList>
                    </div>
                </div>
            </div>
        ));
    // );
};

export default BaseTemplate;