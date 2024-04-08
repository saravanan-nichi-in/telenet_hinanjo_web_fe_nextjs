import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from "@/redux/hooks";
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { BaseTemplate, Button, CustomHeader } from '@/components';
import { QuestionnaireServices } from '@/services/questionnaire.services';
import { IoIosArrowBack } from 'react-icons/io';

export default function IndividualQuestionnaire() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const param = useAppSelector((state) => state.eventReducer.event);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            order_by: "desc",
            sort_by: "updated_at"
        },
        search: "",
        event_id: param.event_id
    });
    const [questionnaires, setQuestionnaires] = useState([]);
    const [deletedQuestionnaire, setDeletedQuestionnaire] = useState([]);

    const router = useRouter();
    const baseTemplateRefs = useRef([]);

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
                    "display_order": item.display_order,
                    "db_data": true
                };
                questionList.push(question);
            });
            if (questionList.length > 1) {
                questionList.sort((a, b) => {
                    return a.display_order - b.display_order;
                });
            }
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
                    <li key={index} style={{ display: 'block', flexDirection: 'column' }}>
                        <div className='list-border'>
                            <div className='ml-1 mr-1 p-3' >
                                <BaseTemplate
                                    ref={(el) => baseTemplateRefs.current[index] = el}
                                    item={item}
                                    itemIndex={index}
                                    removeQuestion={() => removeQuestionData(item, index)}
                                    handleItemChange={handleItemChange}
                                />
                            </div>
                        </div>
                        {questionnaires.length - 1 != index &&
                            <div className='flex align-items-center justify-content-center'>
                                <a className='ml-2 pt-2 pb-2 flex align-items-center justify-content-center cursor-pointer' onClick={() => { handleClick(index) }}>
                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.5 13V5.825L5.925 8.4L4.5 7L9.5 2L14.5 7L13.075 8.4L10.5 5.825V13H8.5ZM15.5 22L10.5 17L11.925 15.6L14.5 18.175V11H16.5V18.175L19.075 15.6L20.5 17L15.5 22Z" fill="#D31720" />
                                    </svg>
                                    <span className=''>{translate(localeJson, 'swap_question')}</span>
                                </a>
                            </div>
                        }
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

    const handleClick = (index) => {
        let fromIndex = index;
        let toIndex = index + 1;
        const prepareData = [...questionnaires];
        const item = prepareData.splice(fromIndex, 1)[0];
        prepareData.splice(toIndex, 0, item);
        setQuestionnaires([]);
        setTimeout(() => {
            setQuestionnaires(() => {
                return prepareData
            });
        }, 100);
    }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "return_to_questionnaire_master"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push("/admin/questionnaire"),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "individual_questionaries")} />
                        <div className='w-full questionnaire'>
                            <div>
                                {bindQuestion()}
                            </div>
                        </div>
                        <div className='questionnaire text-center pb-3'>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "w-6 create-button-questionnaire",
                                text: `＋ ${translate(localeJson, 'add_item')}`,
                                onClick: handleAddNewItem
                            }} parentClass={"mr-1 mt-1 create-button-questionnaire"} />
                            <Button buttonProps={{
                                type: 'button',
                                rounded: "true",
                                buttonClass: "w-6 update-button",
                                text: translate(localeJson, 'save'),
                                onClick: triggerSubmitCall
                            }} parentClass={"mr-1 pt-3 update-button"} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
