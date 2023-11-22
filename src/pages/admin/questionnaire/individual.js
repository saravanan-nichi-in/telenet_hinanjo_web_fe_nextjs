import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from "@/redux/hooks";
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { BaseTemplate } from '@/components/questionarrie';
import { AiOutlineDrag } from 'react-icons/ai';
import { Button, DND } from '@/components';
import { QuestionnaireServices } from '@/services/questionnaire.services';

export default function IndividualQuestionnaire() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const param = useAppSelector((state) => state.eventReducer.event);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            order_by: "asc",
            sort_by: "updated_at"
        },
        search: "",
        event_id: param.event_id
    });
    const [questionnaires, setQuestionnaires] = useState([]);
    const [deletedQuestionnaire, setDeletedQuestionnaire] = useState([]);

    const router = useRouter();
    const baseTemplateRefs = useRef([]);

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...questionnaires];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            setQuestionnaires([]);
            setTimeout(() => {
                setQuestionnaires(() => {
                    return prepareData
                });
            }, 100);
        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    const triggerSubmitCall = () => {
        let validationFlag = true;
        questionnaires.map((item, index) => {
            if (baseTemplateRefs.current[index]) {
                let validFlag = baseTemplateRefs.current[index].validateQuestionnaires(item);
                if (!validFlag) {
                    validationFlag = validFlag
                }
            }
        })
        if (validationFlag) {
            sumbitQuestionnaire();
        }
    };

    const sumbitQuestionnaire = () => {
        registerQuestionnaireList();
    }

    const removeQuestionData = (data, index) => {
        if (questionnaires[index].db_data) {
            setDeletedQuestionnaire(prevQuestionnaires => {
                const newQuestionarrie = [...prevQuestionnaires];
                newQuestionarrie.push(questionnaires[index]);
                return newQuestionarrie;
            })
        }

        const updatedQuestionnaires = questionnaires.filter((_, item) => item !== index);
        setQuestionnaires([]);
        setTimeout(() => {
            setQuestionnaires(updatedQuestionnaires)
        }, 100);
    }

    const handleItemChange = (item, index) => {
        setQuestionnaires((prevQuestionnaires) => {
            const updatedQuestionnaires = [...prevQuestionnaires];
            updatedQuestionnaires[index] = item;
            return updatedQuestionnaires;
        });
    }

    /* Services */
    const { getIndividualList, registerIndividualQuestionnaire } = QuestionnaireServices;

    const onGetQuestionnaireListMounting = () => {
        getIndividualList(getListPayload, getQuestionnaireList)
    }

    const getQuestionnaireList = (response) => {
        if (response.success && !_.isEmpty(response.data) && response.data.list.length > 0) {
            const data = response.data.list;
            let questionList = [];
            data.map((item, index) => {
                let question = {
                    "id": item.id,
                    "title": "",
                    "questiontitle": item.title,
                    "questiontitle_en": item.title_en,
                    "option": item.options,
                    "option_en": item.options_en,
                    "selected_type": (item.type == 3 || item.type == 4) ? item.type : 1,
                    "inner_question_type": !(item.type == 3 || item.type == 4) ? item.type : 1,
                    "is_required": item.isRequired == 1 ? true : false,
                    "is_visible": item.isVisible == 1 ? true : false,
                    "is_voice_type": item.isVoiceRequired == 1 ? true : false,
                    "db_data": true
                };
                questionList.push(question);
            });
            setQuestionnaires([]);
            setTimeout(() => {
                setQuestionnaires(questionList);
                setLoader(false)
            }, 100);

        }
        else {
            setQuestionnaires([
                {
                    "title": "",
                    "questiontitle": "",
                    "questiontitle_en": "",
                    "option": [""],
                    "option_en": [""],
                    "selected_type": 1,
                    "inner_question_type": 1,
                    "is_required": true,
                    "is_visible": false,
                    "is_voice_type": false,
                    "db_data": false
                }
            ]);
            setLoader(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await onGetQuestionnaireListMounting();
        };
        fetchData();
    }, [locale]);

    const bindQuestion = () => {
        return (
            <ol>
                {questionnaires.map((item, index) => (
                    <li key={index}>
                        <div className='ml-1 mr-1' style={{ width: "95%" }}>
                            <BaseTemplate
                                ref={(el) => baseTemplateRefs.current[index] = el}
                                item={item}
                                itemIndex={index}
                                removeQuestion={() => removeQuestionData(item, index)}
                                handleItemChange={handleItemChange}
                            />
                        </div>
                        <a className='ml-2'>
                            <AiOutlineDrag />
                        </a>
                    </li>
                ))}
            </ol>
        )
    }

    const registerQuestionnaireList = () => {
        let payloadData = [];
        questionnaires.map((item) => {
            let question = {
                "event_id": param.event_id,
                "selectionOptions": "" + item.selected_type,
                "questiontitle": item.questiontitle,
                "questiontitle_en": item.questiontitle_en,
                "option": item.selected_type == 1 ? item.option : [],
                "option_en": item.selected_type == 1 ? item.option_en : [],
                "qRequire": item.is_required ? 1 : 0,
                "isVoiceRequire": item.is_voice_type ? 1 : 0,
                "qVisibility": item.is_visible ? 1 : 0
            };
            if (item.db_data) {
                question['id'] = item.id
            }
            if (item.selected_type == 1) {
                question["choice"] = item.selected_type == 1 ? item.inner_question_type : 1;
            }
            payloadData.push(question);
        });

        deletedQuestionnaire.map((item) => {
            let question = {
                "event_id": param.event_id,
                "selectionOptions": "" + item.selected_type,
                "questiontitle": item.questiontitle,
                "questiontitle_en": item.questiontitle_en,
                "option": item.selected_type == 1 ? item.option : [],
                "option_en": item.selected_type == 1 ? item.option_en : [],
                "qRequire": item.is_required ? 1 : 0,
                "isVoiceRequire": item.is_voice_type ? 1 : 0,
                "qVisibility": item.is_visible ? 1 : 0
            };
            if (item.db_data) {
                question['id'] = item.id;
                question['delete'] = item.id;
            }
            if (item.selected_type == 1) {
                question["choice"] = item.selected_type == 1 ? item.inner_question_type : 1;
            }
            payloadData.push(question);
        })

        if (payloadData.length > 0) {
            registerIndividualQuestionnaire({
                question: [...payloadData]
            }, (() => {
                setLoader(true);
                getIndividualList(getListPayload, getQuestionnaireList)
            }))
        }

    }

    const handleAddNewItem = () => {
        // Add the new item to the questionnaires state
        let newItem = {
            // "id": questionnaires.length + 1,
            "title": "",
            "questiontitle": "",
            "questiontitle_en": "",
            "option": [""],
            "option_en": [""],
            "selected_type": 1,
            "inner_question_type": 1,
            "is_required": false,
            "is_visible": false,
            "is_voice_type": false,
            "db_data": false
        }
        setQuestionnaires([...questionnaires, newItem]);
        // Clear the newItem state for the next addition
    };
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'individual_questionaries')}</h5>
                        <hr />
                        <div className='w-full'>
                            <DND dragProps={dragProps}>
                                {bindQuestion()}
                            </DND>
                        </div>
                        <div className='flex pt-3 pb-3' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                bg: "bg-white",
                                hoverBg: "hover:surface-500 hover:text-white",
                                onClick: () => {
                                    router.push("/admin/questionnaire")
                                },
                                buttonClass: "text-600 evacuation_button_height",
                                text: translate(localeJson, 'back'),
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'button',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'submit'),
                                severity: "primary",
                                onClick: triggerSubmitCall
                            }} parentClass={"mr-1 mt-1"} />

                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'add_item'),
                                severity: "success",
                                onClick: handleAddNewItem
                            }} parentClass={"mr-1 mt-1"} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}