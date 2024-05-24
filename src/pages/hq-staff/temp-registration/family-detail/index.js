import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import _ from 'lodash';
import { IoIosArrowBack } from "react-icons/io";

import {
    getValueByKeyRecursively as translate,
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getSpecialCareName
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CardSpinner, CustomHeader, NormalTable } from '@/components';
import { useAppSelector } from "@/redux/hooks";
import { AdminEvacueeTempServices, CommonServices } from '@/services';

export default function HQEvacueeTempFamilyDetail() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const param = useAppSelector((state) => state.familyReducer.tempFamily);

    const [tableLoading, setTableLoading] = useState(false);
    const [familyDetailData, setFamilyDetailData] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [place, setPlace] = useState([]);
    const [placeCreateData, setPlaceCreateData] = useState([]);
    const [overallQuestionnaires, setOverallQuestionnaires] = useState([]);

    /* Services */
    const { getPlaceList } = CommonServices;

    /* Services */
    const { getTempFamilyEvacueesDetail } = AdminEvacueeTempServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            getPlaceList((res) => {
                setPlace(res?.data?.model?.list);
            })
        };
        fetchData();
    }, [locale]);

    useEffect(() => {
        if (place !== null && place?.length > 0) {
            onGetEvacueesFamilyDetailOnMounting();
        }
    }, [place]);

    const onGetEvacueesFamilyDetailOnMounting = () => {
        getTempFamilyEvacueesDetail(param, getEvacueesFamilyDetail);
    }

    const getEvacueesFamilyDetail = (response) => {
        var familyDataList = [];
        var listOfIndividualQuestions = [];
        var listOfOverallQuestions = [];
        var admittedHistory = [];
        if (response.success && !_.isEmpty(response.data)) {
            const data = response.data.data;
            const individualQuestionArray = response.data?.individualQuestions;
            const overallQuestionArray = response.data.overallQuestions;
            const historyData = response.data.history.list;
            if (individualQuestionArray.length > 0) {
                individualQuestionArray.map((ques) => {
                    let data = {
                        id: ques.id,
                        question: (locale == "ja" ? ques.title : ques.title_en),
                        is_required: ques.isRequired,
                        display_order: ques.display_order
                    };
                    listOfIndividualQuestions.push(data);
                });
                if (listOfIndividualQuestions.length > 1) {
                    listOfIndividualQuestions.sort((a, b) => {
                        return a.display_order - b.display_order;
                    });
                }
            }
            data.map((person, index) => {
                let familyData = {
                    id: index + 1,
                    is_owner: person.person_is_owner == 0 ? translate(localeJson, 'representative') : "",
                    refugee_name: person.person_refugee_name,
                    name: person.person_name,
                    dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.person_dob) : getEnglishDateDisplayFormat(person.person_dob),
                    age: person.person_age,
                    age_month: person.person_month,
                    special_care_name: person.person_special_cares ? getSpecialCareName(person.person_special_cares, locale) : "",
                    connecting_code: person.person_connecting_code,
                    remarks: person.person_note,
                    gender: getGenderValue(person.person_gender),
                    address: translate(localeJson, 'post_letter') + person.person_postal_code + " " + person.prefecture_name + " " + person.person_address,
                    tel: person?.family_tel && person.family_tel != "00000000000" ? person.family_tel : "",
                    created_date: locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(person.person_created_at) : getEnglishDateTimeDisplayActualFormat(person.person_updated_at),
                    updated_date: locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(person.person_updated_at) : getEnglishDateTimeDisplayActualFormat(person.person_updated_at),
                    evacuation_date_time: locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(person.family_join_date) : getEnglishDateTimeDisplayActualFormat(person.family_join_date),
                    family_code: person.family_code,
                    yapple_id: person.yapple_id,
                    place_name: locale === "en" && !_.isNull(person.place_name_en) ? person.place_name_en : person.place_name,
                };
                if (data[0].place_id) {
                    let newObj1 = {
                        place_name: locale == 'ja' ? data[0].place_name : (data[0].place_name_en ?? data[0].place_name),
                        family_created_at: data[0].family_created_at && (locale === "ja" ? getJapaneseDateTimeDayDisplayActualFormat(data[0].family_created_at) : getEnglishDateTimeDisplayActualFormat(data[0].family_created_at)),
                    };
                    setPlaceCreateData([newObj1]);
                } else {
                    setPlaceCreateData([]);
                }
                let personAnswers = person.person_answers;
                if (listOfIndividualQuestions.length > 0) {
                    let preparedListOfIndividualQuestions = [...listOfIndividualQuestions];
                    preparedListOfIndividualQuestions.map((question) => {
                        let indexOfMatchingAnswer = personAnswers.length > 0 && personAnswers.find(answer => answer.question_id == question.id);
                        question['answer'] = indexOfMatchingAnswer ? getAnswerData(locale == "ja" ? indexOfMatchingAnswer.answer : indexOfMatchingAnswer.answer_en) : "";
                    })
                    familyData['individualQuestionnaires'] = preparedListOfIndividualQuestions;
                }
                familyDataList.push(familyData);
            })
            if (overallQuestionArray.length > 0) {
                overallQuestionArray.map((ques) => {
                    let data = {
                        id: ques.id,
                        question: (locale == "ja" ? ques.title : ques.title_en),
                        is_required: ques.isRequired,
                        display_order: ques.display_order
                    };
                    listOfOverallQuestions.push(data);
                });
                if (listOfOverallQuestions.length > 1) {
                    listOfOverallQuestions.sort((a, b) => {
                        return a.display_order - b.display_order;
                    });
                }
                if (data.length > 0 && data[0].family_answers.length > 0) {
                    let familyAnswers = data[0].family_answers;
                    listOfOverallQuestions.map((question, i) => {
                        let indexOfMatchingAnswer = familyAnswers.find(answer => answer.question_id == question.id);
                        question['answer'] = indexOfMatchingAnswer ? getAnswerData(locale == "ja" ? indexOfMatchingAnswer.answer : indexOfMatchingAnswer.answer_en) : "";
                    })
                }
            }
            if (historyData.length > 0) {
                historyData.map((item) => {
                    let historyItem = {
                        place_id: item.place_id,
                        shelter_place: item.place_name,
                        admission_date_time: item.checkin && (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkin) : getEnglishDateTimeDisplayActualFormat(item.checkin)),
                        discharge_date_time: item.checkout && (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkout) : getEnglishDateTimeDisplayActualFormat(item.checkout)),
                    };
                    admittedHistory.push(historyItem);
                });
            }
        }
        setTableLoading(false);
        setFamilyDetailData(familyDataList);
        setOverallQuestionnaires(listOfOverallQuestions);
        setFamilyAdmittedData(admittedHistory);
    }

    const placeCreatedColumns = [
        {
            field: "place_name",
            header: translate(localeJson, "place_name"),
            textAlign: "left",
            minWidth: "12rem",
            maxWidth: "7rem"
        },
        {
            field: "family_created_at",
            header: translate(localeJson, "temp_register_date"),
            textAlign: "left",
            minWidth: "7rem",
        },
    ];

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'others_count');
        }
    }

    const getAnswerData = (answer) => {
        let answerData = null;
        answer.map((item) => {
            answerData = answerData ? (answerData + ", " + item) : item
        });
        return answerData;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <Button buttonProps={{
                        buttonClass: "w-auto back-button-transparent mb-2 p-0",
                        text: translate(localeJson, "list_of_temp_registrants_back_title_admin"),
                        icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                        onClick: () => router.push('/hq-staff/temp-registration/'),
                    }} parentClass={"inline back-button-transparent"} />
                    <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
                    {tableLoading ? (
                        <CardSpinner />
                    ) : familyDetailData && familyDetailData.map((val, i) => (
                        val.is_owner === translate(localeJson, 'representative') && (
                            <div className='custom-card-info my-3' key={i}>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "name_kanji")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "name_phonetic")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.refugee_name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "dob")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.dob}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "age")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.age}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "age_month")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.age_month}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "tel")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.tel}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "address")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.address}</span>
                                    </div>
                                </div>
                                <div className='hidden align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.evacuation_date_time}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "family_code")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.family_code}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{translate(localeJson, "place_name")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.place_name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "notes")}:</div>
                                    <div className='page-header3-sub ml-1'>{val.remarks}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "c_special_care")}:</div>
                                    <div className='page-header3-sub ml-1'>{val.special_care_name}</div>
                                </div>
                                {/*Development <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "yapple_id")}:</div>
                                    <div className='page-header3-sub ml-1'>{val.yapple_id}</div>
                                </div> */}
                            </div>
                        )
                    ))}
                    <div className='section-space'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_overall")} />
                        <div className='custom-card-info my-3'>
                            {tableLoading ? (
                                <CardSpinner />
                            ) : overallQuestionnaires.length > 0 && overallQuestionnaires.map((val, i) => (
                                <div className='flex align-items-center' key={i}>
                                    <div className='details-text-overflow'>
                                        <span className='page-header3'>{val.question}</span>
                                        <span className={val.is_required == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                        <span className='page-header3-sub ml-1'>{val.answer}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='section-space'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_individual")} />
                        {tableLoading ? (
                            <CardSpinner />
                        ) : familyDetailData && familyDetailData.map((ques, i) => (
                            <div className='custom-card-info my-3' key={i}>
                                {ques['individualQuestionnaires'] && ques['individualQuestionnaires'].map((val, i) => (
                                    <div className='flex align-items-center' key={i}>
                                        <div className='details-text-overflow'>
                                            <span className='page-header3'>{val.question}</span>
                                            <span className={val.is_required == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                            <span className='page-header3-sub ml-1'>{val.answer}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-2" style={{ display: "none" }}>
                        <Button buttonProps={{
                            buttonClass: "w-8rem back-button",
                            text: translate(localeJson, 'back'),
                            onClick: () => router.push('/hq-staff/temp-registration'),
                        }} parentClass={"inline back-button"} />
                    </div>
                    <div className='flex flex-column mt-3 mb-2 justify-content-center align-items-center' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                        <NormalTable
                            lazy
                            id={"evacuation-list"}
                            className="mt-2 flex justify-content-center"
                            loading={tableLoading}
                            size={"small"}
                            stripedRows={true}
                            paginator={false}
                            showGridlines={"true"}
                            value={placeCreateData}
                            tableStyle={{ maxWidth: "30rem" }}
                            columns={placeCreatedColumns}
                            emptyMessage={translate(localeJson, "data_not_found")}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}