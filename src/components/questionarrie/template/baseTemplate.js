import React, { useContext, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { Button } from '@/components/button';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { NormalCheckBox } from '@/components/checkbox';
import { InputSwitch } from '@/components/switch';
import { Input } from '@/components/input';
import { RadioBtn } from '@/components/radioButton';

const BaseTemplate = React.forwardRef((props, ref) => {
    const [item, setItem] = useState(props.item);
    const { removeQuestion, handleItemChange, triggerFinalSubmit, itemIndex } = props;
    const { localeJson } = useContext(LayoutContext);
    const [jpTitleError, setJpTitleError] = useState('');
    const [choiceError, setChoiceError] = useState('');

    const selectionMode = [
        {
            "key": 1,
            "name": translate(localeJson, 'selection')
        },
        {
            "key": 3,
            "name": translate(localeJson, 'description')
        },
        {
            "key": 4,
            "name": translate(localeJson, 'numeric')
        }
    ];

    const innerSelectionMode = [
        {
            "key": 1,
            "name": translate(localeJson, 'checkbox')
        },
        {
            "key": 2,
            "name": translate(localeJson, 'radio')
        },
        {
            "key": 5,
            "name": translate(localeJson, 'dropdown')
        }
    ];

    const updateInputFieldValue = (value, index, field) => {
        let updatedData = { ...item };
        if (field == "jp") {
            updatedData.option[index] = value;
            if (updatedData.selected_type == 1 && updatedData.option[0] == "") {
                setChoiceError(translate(localeJson, "option_is_required"))
            }
            else {
                setChoiceError("");
            }
        }
        else {
            updatedData.option_en[index] = value;
        }
        setItem(updatedData);
        handleItemChange(updatedData, itemIndex);
    }

    const validateInput = (value, field) => {
        let isValid = true;
        if (field == "jp_title" && !value.trim()) {
            setJpTitleError(translate(localeJson, 'item_title_is_required'));
            isValid = false;
        }
        return isValid;
    };

    const updateFormChangeData = (value, field) => {
        let updatedData = { ...item };
        if (field == "required") {
            updatedData.is_required = value;
        }
        if (field == "visible") {
            updatedData.is_visible = value;
        }
        if (field == "voice") {
            updatedData.is_voice_type = value;
        }
        if (field == "selection_mode") {
            updatedData.selected_type = value;
        }
        if (field == "sub_selection") {
            updatedData.inner_question_type = value;
        }
        if (field == "jp_title") {
            const isValid = validateInput(value, field);
            if (isValid) {
                setJpTitleError("");
                updatedData.questiontitle = value;
            } else {
                updatedData.questiontitle = value;
            }
        }
        if (field == "en_title") {
            updatedData.questiontitle_en = value;
        }
        if (field == "add") {
            updatedData.option.push("");
            updatedData.option_en.push("");
        }
        if (field == "delete") {
            updatedData.option.splice(value, 1)
            updatedData.option_en.splice(value, 1)
        }
        setItem(updatedData);
        handleItemChange(updatedData, itemIndex);
    }

    React.useImperativeHandle(ref, () => ({
        validateQuestionnaires,
    }));

    const validateQuestionnaires = (question) => {
        let validFlag = true;
        if (question.questiontitle == '' || (question.selected_type == 1 && question.option[0] == '')) {
            validFlag = false
        }
        if (question.questiontitle == "") {
            setJpTitleError(translate(localeJson, 'item_title_is_required'));
        }
        if (question.option[0] == "") {
            setChoiceError(translate(localeJson, "option_is_required"));
        }
        return validFlag;
    }

    const itemTemplate = (item) => {
        return (
            <div>
                <form>
                    <div>
                        <div className='mobile_questionaries mobile_accordion'>
                            <Accordion>
                                <AccordionTab header={`${translate(localeJson, 'item')} ${item.title}`}>
                                    {/* Questionnaires header */}
                                    <div className='mt-1' style={{
                                        backgroundColor: "#afe1f9",

                                    }}>
                                        <div className="" style={{ flexWrap: "wrap" }}>
                                            <div className=''>
                                                <div className='flex align-items-center pl-2 pt-2 pb-2'>
                                                    <NormalCheckBox checkBoxProps={{
                                                        checked: item.is_required,
                                                        labelClass: "pl-2",
                                                        onChange: (e) => updateFormChangeData(e.checked, "required")
                                                    }} />
                                                    {translate(localeJson, 'required')}
                                                </div>
                                                <div className='flex align-items-center gap-2 pt-2 pl-2 switch-align' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <InputSwitch inputSwitchProps={{
                                                        checked: item.is_visible,
                                                        style: { paddingLeft: '10px' },
                                                        onChange: (e) => updateFormChangeData(e.value, "visible")
                                                    }} />
                                                    {translate(localeJson, 'display_in_registration_screen')}
                                                </div>
                                            </div>
                                            <div className='flex align-items-center pt-1 pb-2'>
                                                <div className='align-items-center pl-2'>
                                                    {selectionMode.map((type) => {
                                                        return (
                                                            <div key={type.key} style={{ fontSize: "14px", paddingTop: '10px' }} >
                                                                <RadioBtn
                                                                    radioBtnProps={{
                                                                        checked: item.selected_type == type.key,
                                                                        inputId: type.key,
                                                                        name: type.name,
                                                                        value: type,
                                                                        labelClass: "pl-2 pr-2",
                                                                        onChange: (e) => updateFormChangeData(e.value.key, "selection_mode")
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {item.selected_type == 1 && (
                                                    <div className="align-items-center pl-2">
                                                        {innerSelectionMode.map((type) => {
                                                            return (
                                                                <div key={type.key} style={{ fontSize: "14px", paddingTop: "10px" }} >
                                                                    <RadioBtn
                                                                        radioBtnProps={{
                                                                            checked: item.inner_question_type == type.key,
                                                                            inputId: type.key,
                                                                            name: type.name,
                                                                            value: type,
                                                                            labelClass: "pl-2 pr-2",
                                                                            onChange: (e) => updateFormChangeData(e.value.key, "sub_selection")
                                                                        }}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='pt-2 pb-2 pl-2 flex gap-2 align-items-center justify-content-start' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                <InputSwitch inputSwitchProps={{
                                                    checked: item.is_voice_type,
                                                    onChange: (e) => updateFormChangeData(e.value, "voice"),
                                                    disabled: item.selected_type == 1 ? true : false
                                                }} />
                                                {translate(localeJson, 'voice_input')}
                                            </div>
                                        </div>
                                    </div>
                                    {item.selected_type == 1 && (
                                        Array.isArray(item.option) && item.option.map((option, i) => (
                                            <div key={i} className="flex" style={{
                                                borderRight: "1px solid #000",
                                                borderBottom: "1px solid #000",
                                                borderLeft: "1px solid #000",
                                            }}>

                                                <div className="col-fixed col-3 flex align-items-center justify-content-center">

                                                    {translate(localeJson, 'choice')} {i + 1}<span style={{
                                                        color: i < 1 ? "red" : "white"
                                                    }} >*</span>

                                                </div>
                                                <div className="col-4" style={{
                                                    borderLeft: "1px solid #000",
                                                }}>
                                                    <div className='gap-1 p-0 align-items-center'>
                                                        <Input inputProps={{
                                                            value: option,
                                                            inputClass: "w-full",
                                                            onChange: (e) => updateInputFieldValue(e.target.value, i, "jp")
                                                        }} />
                                                        <Input inputProps={{
                                                            value: item.option_en[i],
                                                            inputClass: "w-full",
                                                            onChange: (e) => updateInputFieldValue(e.target.value, i, "en")
                                                        }} />
                                                    </div>
                                                    {choiceError && (i == 0) && <div className="error-message">{choiceError}</div>}
                                                </div>
                                                <div className='col-5 flex align-items-center justify-content-center' style={{
                                                    borderLeft: "1px solid #000",
                                                }}>
                                                    {item.option.length == i + 1 ? (
                                                        <Button buttonProps={{
                                                            text: `＋ ${translate(localeJson, 'add_choice')}`,
                                                            severity: "success",
                                                            rounded: "true",
                                                            type: "button",
                                                            onClick: () => updateFormChangeData(i, "add")
                                                        }}
                                                        />
                                                    ) : (
                                                        <Button buttonProps={{
                                                            text: `－  ${translate(localeJson, 'del_choice')}`,
                                                            severity: "danger",
                                                            rounded: "true",
                                                            type: "button",
                                                            onClick: () => updateFormChangeData(i, 'delete')
                                                        }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                        <div className='col-8 flex gap-2 align-items-center justify-content-start'>
                                            <NormalCheckBox checkBoxProps={{
                                                checked: item.is_required,
                                                onChange: (e) => updateFormChangeData(e.checked, "required")
                                            }} />
                                            {translate(localeJson, 'required')}
                                        </div>
                                        <div className='col-4 flex  gap-2 align-items-center justify-content-start ' style={{ fontSize: "14px" }}>
                                            <InputSwitch inputSwitchProps={{
                                                checked: item.is_visible,
                                                onChange: (e) => updateFormChangeData(e.value, "visible")
                                            }} />
                                            {translate(localeJson, 'display_in_registration_screen')}
                                        </div>
                                    </div>
                                    <div className='flex align-items-center justify-content-between'>
                                        <div className='col-8 gap-3'>
                                            <div className="flex align-items-center">
                                                {selectionMode.map((type) => {
                                                    return (
                                                        <div key={type.key} style={{ fontSize: "14px" }} >
                                                            <RadioBtn
                                                                radioBtnProps={{
                                                                    checked: item.selected_type == type.key,
                                                                    inputId: type.key,
                                                                    name: type.name,
                                                                    value: type,
                                                                    labelClass: "pl-2 pr-2",
                                                                    onChange: (e) => updateFormChangeData(e.value.key, "selection_mode")
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {item.selected_type == 1 && (
                                                <div className="flex align-items-center pt-2">
                                                    {innerSelectionMode.map((type) => {
                                                        return (
                                                            <div key={type.key} style={{ fontSize: "14px" }} >
                                                                <RadioBtn
                                                                    radioBtnProps={{
                                                                        checked: item.inner_question_type == type.key,
                                                                        inputId: type.key,
                                                                        name: type.name,
                                                                        value: type,
                                                                        labelClass: "pl-2 pr-2",
                                                                        onChange: (e) => updateFormChangeData(e.value.key, "sub_selection")
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                        </div>
                                        <div style={{ paddingRight: "54px", fontSize: "14px" }} className='col-4 custom-switch flex gap-2 align-items-center justify-content-start'>
                                            <InputSwitch inputSwitchProps={{
                                                checked: item.is_voice_type,
                                                onChange: (e) => updateFormChangeData(e.value, "voice"),
                                                disabled: item.selected_type == 1 ? true : false
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
                                    {translate(localeJson, 'item_title')}<span style={{
                                        color: "red"
                                    }}>*</span>
                                </div>
                                <div className="col-7" style={{
                                    borderLeft: "1px solid #000",
                                }}>
                                    <div className='pb-2'>
                                        <Input inputProps={{
                                            inputClass: "w-full",
                                            value: item.questiontitle,
                                            onChange: (e) => {
                                                updateFormChangeData(e.target.value, 'jp_title')
                                            }

                                        }} />
                                        {jpTitleError && <div className="error-message">{jpTitleError}</div>}
                                    </div>
                                    <div className='align-items-center'>
                                        <Input inputProps={{
                                            inputClass: "w-full",
                                            value: item.questiontitle_en,
                                            onChange: (e) => {
                                                updateFormChangeData(e.target.value, 'en_title')
                                            }
                                        }} />
                                    </div>
                                </div>
                                <div className='col-3 flex align-items-center justify-content-center' style={{
                                    borderLeft: "1px solid #000",
                                }}>
                                    <Button buttonProps={{
                                        text: `－ ${translate(localeJson, 'del_item')}`,
                                        severity: "danger",
                                        rounded: "true",
                                        type: "button",
                                        onClick: () => removeQuestion()
                                    }} />
                                </div>
                            </div>
                            {/* Questionnaires options */}
                            {item.selected_type == 1 && (
                                Array.isArray(item.option) && item.option.map((option, i) => (
                                    <div key={i} className="flex" style={{
                                        borderRight: "1px solid #000",
                                        borderBottom: "1px solid #000",
                                        borderLeft: "1px solid #000",
                                    }}>

                                        <div className="col-fixed col-2 flex align-items-center justify-content-center">

                                            {translate(localeJson, 'choice')} {i + 1}<span style={{
                                                color: i < 1 ? "red" : "white"
                                            }} >*</span>

                                        </div>
                                        <div className="col-7" style={{
                                            borderLeft: "1px solid #000",
                                        }}>
                                            <div className='flex gap-1 p-0 align-items-center'>
                                                <Input inputProps={{
                                                    value: option,
                                                    inputClass: "w-full",
                                                    onChange: (e) => updateInputFieldValue(e.target.value, i, "jp")
                                                }} />
                                                <Input inputProps={{
                                                    value: item.option_en[i],
                                                    inputClass: "w-full",
                                                    onChange: (e) => updateInputFieldValue(e.target.value, i, "en")
                                                }} />
                                            </div>
                                            {choiceError && (i == 0) && <div className="error-message">{choiceError}</div>}
                                        </div>
                                        <div className='col-3 flex align-items-center justify-content-center' style={{
                                            borderLeft: "1px solid #000",
                                        }}>
                                            {item.option.length == i + 1 ? (
                                                <Button buttonProps={{
                                                    text: `＋ ${translate(localeJson, 'add_choice')}`,
                                                    severity: "success",
                                                    rounded: "true",
                                                    type: "button",
                                                    onClick: () => updateFormChangeData(i, "add")
                                                }}
                                                />
                                            ) : (
                                                <Button buttonProps={{
                                                    text: `－  ${translate(localeJson, 'del_choice')}`,
                                                    severity: "danger",
                                                    rounded: "true",
                                                    type: "button",
                                                    onClick: () => updateFormChangeData(i, 'delete')
                                                }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <>
            <div className="grid custom_orderlist">
                <div className="col-12 ">
                    {itemTemplate(item)}
                </div>
            </div>
        </>
    )
});
BaseTemplate.displayName = 'BaseTemplate';
export default BaseTemplate;