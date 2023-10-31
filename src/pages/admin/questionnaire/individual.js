import React, { useEffect, useState, useContext } from 'react';
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

    const router = useRouter();

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

    const removeQuestionData = (data) => {
        alert(data.id)
        let index = questionnaires.findIndex((obj) => obj.id === data.id);
        alert(index)
        let questionnaireList = [...questionnaires];
        questionnaireList.splice(index, 1);
        setQuestionnaires(questionnaireList);
    }

    const handleItemChange = (item) => {
        // Find the index of the item to update
        let index = questionnaires.findIndex((obj) => obj.id === item.id);

        // Update the item in the list
        const updatedQuestionnaires = [...questionnaires];
        updatedQuestionnaires[index] = item;
        
        // Set the updated list
        setQuestionnaires(updatedQuestionnaires);
        console.log(questionnaires);
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
                    "selected_type": item.type,
                    "inner_question_type": item.type == 1 ? 1 : 2,
                    "is_required": item.isRequired == 1 ? true : false,
                    "is_visible": item.isVisible == 1 ? true : false,
                    "is_voice_type": item.isVoiceRequired == 1 ? true : false,
                    "db_data": true
                };
                questionList.push(question);
            });
            setQuestionnaires(questionList);
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

    const map = (
        <ol>
            {questionnaires.map((item, index) => (
                <li key={index}>
                    <div className='ml-1 mr-1' style={{ width: "95%" }}>
                        <BaseTemplate
                            item={item}
                            removeQuestion={removeQuestionData}
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

    const registerQuestionnaireList = () => {
        let payloadData = [];
        questionnaires.map((item) => {
            let question = {
                "selectionOptions": "" + item.selected_type,
                "choice": item.inner_question_type,
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
            payloadData.push(question);
        });
        registerIndividualQuestionnaire({
            question: [...payloadData]
        }, ((response) => {
            getIndividualList(getListPayload, getQuestionnaireList)
        }))
    }

    const handleAddNewItem = () => {
        // Add the new item to the questionnaires state
        let newItem = {
            "id": questionnaires.length + 1,
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
                        <h5 className='page-header1'>{translate(localeJson, 'master_questionaries')}</h5>
                        <hr />
                        <div className='w-full'>
                            <DND dragProps={dragProps}>
                                {map}
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
                                onClick: registerQuestionnaireList
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