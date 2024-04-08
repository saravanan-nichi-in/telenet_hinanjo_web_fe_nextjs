import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

import {
    getValueByKeyRecursively as translate,
    getEnglishDateDisplayFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getJapaneseDateTimeDisplayFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getSpecialCareName
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CardSpinner } from '@/components';
import { TemporaryStaffRegistrantServices } from '@/services/staff_temporary_registrants.services';
import { CommonServices } from '@/services';
import CustomHeader from '@/components/customHeader';
import { useAppSelector } from "@/redux/hooks";
import { IoIosArrowBack } from 'react-icons/io';

export default function TemporaryFamilyDetail() {
    const router = useRouter();
    const { locale, localeJson } = useContext(LayoutContext);
    // Getting storage data with help of reducers
    const layoutReducer = useAppSelector((state) => state.layoutReducer);
    const familyReducer = useAppSelector((state) => state.familyReducer);
    const [tableLoading, setTableLoading] = useState(false);
    const [familyCode, setFamilyCode] = useState(null);
    const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [overallQuestionnaires, setOverallQuestionnaires] = useState([]);
    const [place, setPlace] = useState([]);
    const familyAdmissionColumns = [
        { field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time_temp_register'), minWidth: "10rem", textAlign: 'left' },
    ];
    const param = {
        place_id: !_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "",
        lgwan_family_id: familyReducer?.staffTempFamily?.lgwan_family_id,
    };

    /* Services */
    const { getPlaceList } = CommonServices;
    const { getFamilyTemporaryEvacueesDetail, updateCheckInDetail } = TemporaryStaffRegistrantServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            getPlaceList(async (res) => {
                await setPlace(res?.data?.model?.list);
            })
        };
        fetchData();
    }, [locale]);

    useEffect(() => {
        if (place !== null) {
            getTemporaryEvacueesFamilyDetail();
        }
    }, [place]);

    const getTemporaryEvacueesFamilyDetail = () => {
        getFamilyTemporaryEvacueesDetail(param, getTemporaryEvacueesFamilyDetailSuccess);
    }

    const getTemporaryEvacueesFamilyDetailSuccess = (response) => {
        var basicDetailList = [];
        var familyCode = "";
        var familyDataList = [];
        var admittedHistory = [];
        var listOfIndividualQuestions = [];
        var listOfOverallQuestions = [];
        if (response.success && !_.isEmpty(response.data)) {
            const data = response.data.data;
            const overallQuestionArray = response.data.overallQuestions || [];
            const individualQuestionArray = response.data?.individualQuestions || [];
            if (data.length > 0) {
                let getPlaceName = place?.find((val) => { return val.id == data[0].place_id });
                let basicData = {
                    evacuation_date_time: data[0].family_join_date ? getJapaneseDateTimeDayDisplayActualFormat(data[0].family_join_date) : "",
                    place_name: locale == "ja" ? getPlaceName?.name : getPlaceName?.name_en,
                    address: (data[0].family_zip_code ? translate(localeJson, 'post_letter') + data[0].family_zip_code : "") + " " + (data[0].prefecture_name) + " " + data[0].family_address,
                    representative_number: data[0].family_tel,
                    registered_lang_environment: getRegisteredLanguage(data[0].family_language_register)
                };
                basicDetailList.push(basicData);
            }
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
                    gender: getGenderValue(person.person_gender),
                    created_date: person.person_created_at ? getJapaneseDateTimeDayDisplayActualFormat(person.person_created_at) : "",
                    updated_date: person.person_updated_at ? getJapaneseDateTimeDayDisplayActualFormat(person.person_updated_at) : "",
                    address: (person.person_postal_code ? translate(localeJson, 'post_letter') + person.person_postal_code : "") + " " +person.prefecture_name +" "+person.person_address,
                    special_care_name: person.person_special_cares ? getSpecialCareName(person.person_special_cares, locale) : "",
                    connecting_code: person.person_connecting_code || "",
                    remarks: person.person_note || "",
                    evacuation_date_time: locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(person.family_join_date) : getEnglishDateTimeDisplayActualFormat(person.family_join_date),
                    family_code: person.family_code,
                    tel: person.family_tel,
                    place_name: locale === "en" && !_.isNull(person.place_name_en) ? person.place_name_en : person.place_name,
                    yapple_id: person.yapple_id,
                };
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
            familyCode = data[0].family_code;
        }
        setTableLoading(false);
        setFamilyCode(familyCode);
        setBasicFamilyDetail(familyDataList);
        setOverallQuestionnaires(listOfOverallQuestions);
    }

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'others_count');
        }
    }

    const getRegisteredLanguage = (language) => {
        if (language == "en") {
            return translate(localeJson, 'english');
        }
        else {
            return translate(localeJson, 'japanese');
        }
    }

    const getAnswerData = (answer) => {
        let answerData = null;
        answer.map((item) => {
            answerData = answerData ? (answerData + ", " + item) : item
        });
        return answerData;
    }

    const updateCheckInStatus = () => {
        updateCheckInDetail(param, (response) => {
            if (response.success) {
                router.push('/staff/temporary/family');
            }
        });
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <Button buttonProps={{
                        buttonClass: "w-auto back-button-transparent mb-2 p-0 -ml-2",
                        text: translate(localeJson, "list_of_temp_registrants_back_title"),
                        icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                        onClick: () => router.push('/staff/temporary/family'),
                    }} parentClass={"inline back-button-transparent"} />
                    <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
                    {tableLoading ? (
                        <CardSpinner />
                    ) : basicFamilyDetail && basicFamilyDetail.map((val, i) => (
                        val.is_owner === translate(localeJson, 'representative') && (
                            <div className='custom-card-info my-3' key={i}>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "name_kanji")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "name_phonetic")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.refugee_name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "dob")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.dob}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "age")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.age}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "age_month")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.age_month}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "tel")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.tel}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "address")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.address}</span>
                                    </div>
                                </div>
                                <div className='hidden align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.evacuation_date_time}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "family_code")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.family_code}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "place_name")}:</span>
                                        <span className='page-header3-sub ml-1'>{val.place_name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='page-header3'>{translate(localeJson, "notes")}:</div>
                                    <div className='page-header3-sub ml-1'>{val.remarks}</div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='page-header3'>{translate(localeJson, "c_special_care")}:</div>
                                    <div className='page-header3-sub ml-1'>{val.special_care_name}</div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div className='page-header3'>{translate(localeJson, "yapple_id")}:</div>
                                    <div className='page-header3-sub ml-1'>{val.yapple_id}</div>
                                </div>
                            </div>
                        )
                    ))}
                    <div className='section-space'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_overall")} />
                        {tableLoading ? (
                            <CardSpinner />
                        ) : overallQuestionnaires.length > 0 && (
                            <div className='custom-card-info my-3'>
                                {overallQuestionnaires.map((val, i) => (
                                    <div className='flex align-items-center' key={i}>
                                        <div >
                                            <span className='page-header3'>{val.question}</span>
                                            <span className={val.is_required == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                            <span className='page-header3-sub ml-1'>{val.answer}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Development */}
                    <div className='section-space'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_individual")} />
                        {tableLoading ? (
                            <CardSpinner />
                        ) : basicFamilyDetail.length > 0 && (
                            <div className='custom-card-info my-3'>
                                {basicFamilyDetail.map((ques) => (
                                    ques['individualQuestionnaires'] && ques['individualQuestionnaires'].map((val, i) => (
                                        <div className='flex align-items-center' key={i}>
                                            <div >
                                                <span className='page-header3'>{val.question}</span>
                                                <span className={val.is_required == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                                <span className='page-header3-sub ml-1'>{val.answer}</span>
                                            </div>
                                        </div>
                                    ))
                                ))}
                            </div>
                        )}
                    </div>
                    {/* 
                    Development
                    <div className='mt-2 flex justify-content-center overflow-x-auto'>
                        <NormalTable
                            id="evacuee-family-detail"
                            size={"small"}
                            loading={tableLoading}
                            emptyMessage={translate(localeJson, "data_not_found")}
                            stripedRows={true}
                            paginator={false}
                            showGridlines={true}
                            tableStyle={{ maxWidth: "20rem" }}
                            value={familyAdmittedData}
                            columns={familyAdmissionColumns}
                        />
                    </div> */}
                    <div className='flex mt-2' style={{ justifyContent: "center", flexWrap: "wrap", gap: '.5rem' }}>
                        {/* 
                        development
                        <Button buttonProps={{
                            buttonClass: "w-12 update-button",
                            text: translate(localeJson, 'edit'),
                        }} parentClass={"update-button"} /> */}
                        <Button buttonProps={{
                            buttonClass: "w-12 search-button",
                            text: translate(localeJson, 'check_in'),
                            onClick: () => updateCheckInStatus()
                        }} parentClass={"search-button"} />
                    </div>
                </div>
            </div>
        </div>
    )
}