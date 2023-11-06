import React, { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { BaseTemplate } from '@/components/questionarrie';
import { AiOutlineDrag } from 'react-icons/ai';
import { Button, DND } from '@/components';
import { QuestionnaireServices } from '@/services/questionnaire.services';

export default function IndividualQuestionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            order_by: "asc",
            sort_by: "updated_at"
        },
        search: ""
    });
    const [questionnaires, setQuestionnaires] = useState([]);
    const [deletedQuestionnaire, setDeletedQuestionnaire] = useState([]);

    const router = useRouter();
    const baseTemplateRef = useRef();

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const prepareData = [...questionnaires];
            const item = prepareData.splice(fromIndex, 1)[0];
            prepareData.splice(toIndex, 0, item);
            setQuestionnaires(prepareData);
        },
        nodeSelector: 'li',
        handleSelector: 'a'
    };

    const triggerSubmitCall = () => {
        if (baseTemplateRef.current) {
            // Call the function in the child component using the ref
            baseTemplateRef.current.validateQuestionnaires(questionnaires);
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

        setQuestionnaires(prevQuestionnaires => {
            const newQuestionnaires = [...prevQuestionnaires];
            newQuestionnaires.splice(index, 1);
            console.log(newQuestionnaires);
            return newQuestionnaires;
        });
    }

    const handleItemChange = (item, index) => {
        setQuestionnaires((prevQuestionnaires) => {
            const updatedQuestionnaires = [...prevQuestionnaires];
            updatedQuestionnaires[index] = item;
            return updatedQuestionnaires;
        });
    }

    /* Services */
    const { getList, registerIndividualQuestionnaire } = QuestionnaireServices;

    const onGetQuestionnaireListMounting = () => {
        getList(getListPayload, getQuestionnaireList)
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
                    "option": item.type == 1 ? (item.options.length > 0 ? item.options : [""]): item.options,
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
            setQuestionnaires(questionList);
            console.log(questionList)
        }
        else {
            setQuestionnaires([
                {
                    "id": questionnaires.length + 1,
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
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await onGetQuestionnaireListMounting();
        };
        fetchData();
    }, []);

    const bindQuestion = () => {
        return (
            questionnaires.length > 0 && 
            <ol>
                {questionnaires.map((item, index) => (
                    <li key={index}>
                        <div className='ml-1 mr-1' style={{ width: "95%" }}>
                            <BaseTemplate
                                ref={baseTemplateRef}
                                item={item}
                                itemIndex={index}
                                removeQuestion={removeQuestionData}
                                handleItemChange={handleItemChange}
                                triggerFinalSubmit={sumbitQuestionnaire}
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

        registerIndividualQuestionnaire({
            question: [...payloadData]
        }, ((response) => {
            getList(getListPayload, getQuestionnaireList)
        }))
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
    console.log(questionnaires);
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'master_questionaries')}</h5>
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