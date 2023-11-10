import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import _ from 'lodash';

import { getJapaneseDateTimeDisplayFormat, getJapaneseDateDisplayFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { EvacuationServices } from '@/services/evacuation.services';
import { Button, NormalTable, RowExpansionTable } from '@/components';
import { prefectures } from '@/utils/constant';

export default function EvacueeFamilyDetail() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const param = router.query;
    const [tableLoading, setTableLoading] = useState(false);
    const [familyCode, setFamilyCode] = useState(null);
    const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
    const [familyDetailData, setfamilyDetailData] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [neighbourData, setNeighbourData] = useState(null);
    const [townAssociationColumn, setTownAssociationColumn] = useState([]);
    const [evacueePersonInnerColumns, setEvacueePersonInnerColumns] = useState([]);

    const evacueeFamilyDetailColumns = [
        { field: "id", header: translate(localeJson, 'number'), minWidth: "5rem", className: "sno_class" },
        { field: "is_owner", header: translate(localeJson, 'representative'), minWidth: "10rem" },
        { field: "refugee_name", header: translate(localeJson, 'refugee_name'), minWidth: "10rem" },
        { field: "name", header: translate(localeJson, 'name_kanji'), minWidth: "10rem" },
        { field: "dob", header: translate(localeJson, 'dob'), minWidth: "10rem" },
        { field: "age", header: translate(localeJson, 'age'), minWidth: "4rem" },
        { field: "age_month", header: translate(localeJson, 'age_month'), minWidth: "5rem" },
        { field: "gender", header: translate(localeJson, 'gender'), minWidth: "8rem" },
        { field: "created_date", header: translate(localeJson, 'created_date'), minWidth: "10rem" },
        { field: "updated_date", header: translate(localeJson, 'updated_date'), minWidth: "10rem" },
    ];

    const familyDetailColumns = [
        { field: 'evacuation_date_time', header: translate(localeJson, 'evacuation_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'address', header: translate(localeJson, 'address'), minWidth: "10rem", textAlign: 'left' },
        { field: 'representative_number', header: translate(localeJson, 'representative_number'), minWidth: "10rem", textAlign: 'left' },
        { field: 'registered_lang_environment', header: translate(localeJson, 'registered_lang_environment'), minWidth: "10rem", textAlign: 'left' },
    ];

    const evacueeFamilyDetailRowExpansionColumns = [
        { field: "address", header: translate(localeJson, 'address'), minWidth: "10rem" },
        { field: "special_care_name", header: translate(localeJson, 'special_care_name'), minWidth: "8rem" },
        { field: "connecting_code", header: translate(localeJson, 'connecting_code'), minWidth: "7rem" },
        { field: "remarks", header: translate(localeJson, 'remarks'), minWidth: "7rem" },
    ];

    const familyAdmissionColumns = [
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time'), minWidth: "10rem", textAlign: 'left' },
    ];

    /* Services */
    const { getFamilyEvacueesDetail } = EvacuationServices;

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

    const getSpecialCareName = (nameList) => {
        let specialCareName = null;
        nameList.map((item) => {
            specialCareName = specialCareName ? (specialCareName + ", " + item) : item;
        });
        return specialCareName;
    }

    const getAnswerData = (answer) => {
        let answerData = null;
        answer.map((item) => {
            answerData = answerData ? (answerData + ", " + item) : item
        });
        return answerData;
    }

    const getPrefectureName = (id) => {
        if (id) {
            let p_name = prefectures.find((item) => item.value === id);
            return p_name.name;
        }
        return "";
    }

    const onGetEvacueesFamilyDetailOnMounting = () => {
        getFamilyEvacueesDetail(param, getEvacueesFamilyDetail)
    }

    const getEvacueesFamilyDetail = (response) => {
        if (response.success && !_.isEmpty(response.data)) {
            const data = response.data.data;
            const historyData = response.data.history.list;
            let basicDetailList = [];
            let basicData = {
                evacuation_date_time: data.join_date_modified,
                address: translate(localeJson, 'post_letter') + data.zip_code + " " + getPrefectureName(data.prefecture_id) + " " + data.address,
                representative_number: data.tel,
                registered_lang_environment: getRegisteredLanguage(data.language_register)
            };
            basicDetailList.push(basicData);
            setBasicFamilyDetail(basicDetailList);
            setFamilyCode(data.family_code);

            const personList = data.person;
            const familyDataList = [];
            let personInnerColumns = [...evacueeFamilyDetailRowExpansionColumns];
            let individualQuestion = personList[0].individualQuestions;
            if (individualQuestion.length > 0) {
                individualQuestion.map((ques, index) => {
                    let column = {
                        field: "question_" + index,
                        header: (locale == "ja" ? ques.title : ques.title_en),
                        minWidth: "10rem"
                    };
                    personInnerColumns.push(column);
                });
            }
            setEvacueePersonInnerColumns(personInnerColumns);

            personList.map((person, index) => {
                let familyData = {
                    id: index + 1,
                    is_owner: person.is_owner == 0 ? translate(localeJson, 'representative') : "",
                    refugee_name: person.refugee_name,
                    name: person.name,
                    dob: getJapaneseDateDisplayFormat(person.dob),
                    age: person.age,
                    age_month: person.month,
                    gender: getGenderValue(person.gender),
                    created_date: person.created_at_day,
                    updated_date: data.updated_at_day,
                    orders: [{
                        address: person.address ? person.address : "",
                        special_care_name: person.specialCareName ? getSpecialCareName(person.specialCareName) : "",
                        connecting_code: person.connecting_code,
                        remarks: person.note,
                    },
                    ]
                };

                let question = person.individualQuestions;
                if (question.length > 0) {
                    question.map((ques, index) => {
                        familyData.orders[0][`question_${index}`] = ques.answer ? getAnswerData(ques.answer.answer) : "";
                    })
                }
                familyDataList.push(familyData);
            })
            setfamilyDetailData(familyDataList);

            let admittedHistory = [];
            historyData.map((item) => {
                let historyItem = {
                    place_id: item.place_id,
                    shelter_place: item.placeName,
                    admission_date_time: item.status == 0 ? (item.access_datetime ? getJapaneseDateTimeDisplayFormat(item.access_datetime) : "") : "",
                };
                let index = admittedHistory.findLastIndex((obj) => obj.place_id == item.place_id);
                if (index >= 0 && item.status == 1) {
                    admittedHistory[index]['discharge_date_time'] = getJapaneseDateTimeDisplayFormat(item.access_datetime);
                }
                else {
                    admittedHistory.push(historyItem);
                }

            });
            setFamilyAdmittedData(admittedHistory);

            let neighbourDataList = [];

            const questionnaire = data.question;
            let townAssociateColumnSet = [];
            questionnaire.map((ques, index) => {
                let column = {
                    field: "question_" + index,
                    header: (locale == "ja" ? ques.title : ques.title_en),
                    minWidth: "10rem"
                };
                townAssociateColumnSet.push(column);
            });
            setTownAssociationColumn(townAssociateColumnSet);

            let neighbourData = {};
            questionnaire.map((ques, index) => {
                neighbourData[`question_${index}`] = ques.answer ? getAnswerData(ques.answer.answer) : "";
            });
            neighbourDataList.push(neighbourData);
            setNeighbourData(neighbourDataList);
            setTableLoading(false)
        }
        else {
            setTableLoading(false);
        }
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyDetailOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'house_hold_information_details')}</h5>
                    <hr />
                    <div className='mb-2'>
                        <div className='flex justify-content-end household-number'>
                            {translate(localeJson, 'household_number')} {familyCode}
                        </div>
                    </div>
                    <NormalTable
                        id="evacuee-family-detail"
                        size={"small"}
                        tableLoading={tableLoading}
                        emptyMessage={translate(localeJson, "data_not_found")}
                        stripedRows={true}
                        paginator={false}
                        showGridlines={true}
                        value={basicFamilyDetail}
                        columns={familyDetailColumns}
                        parentClass="mb-2"
                    />
                    <div className='mb-2'>
                        <h5 className='page-header2'>{translate(localeJson, 'household_list')}</h5>
                    </div>
                    <RowExpansionTable
                        id={"evacuation-detail-list"}
                        rows={10}
                        paginatorLeft={true}
                        tableLoading={tableLoading}
                        emptyMessage={translate(localeJson, "data_not_found")}
                        paginator="true"
                        customRowExpansionActionsField="actions"
                        value={familyDetailData}
                        innerColumn={evacueePersonInnerColumns}
                        outerColumn={evacueeFamilyDetailColumns}
                        rowExpansionField="orders"
                    />
                    {townAssociationColumn.length > 0 &&
                        <div className='mt-2'>
                            <NormalTable
                                id="evacuee-family-detail"
                                size={"small"}
                                tableLoading={tableLoading}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                stripedRows={true}
                                paginator={false}
                                showGridlines={true}
                                value={neighbourData}
                                columns={townAssociationColumn}
                            />
                        </div>
                    }
                    <div className='mt-2 flex justify-content-center overflow-x-auto'>
                        <NormalTable
                            id="evacuee-family-detail"
                            size={"small"}
                            tableLoading={tableLoading}
                            emptyMessage={translate(localeJson, "data_not_found")}
                            stripedRows={true}
                            paginator={false}
                            showGridlines={true}
                            tableStyle={{ maxWidth: "20rem" }}
                            value={familyAdmittedData}
                            columns={familyAdmissionColumns}
                        />
                    </div>
                    <div className="text-center mt-2">
                        <Button buttonProps={{
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'back'),
                            onClick: () => router.push('/admin/evacuation/'),
                        }} parentClass={"inline"} />
                    </div>
                </div>
            </div>
        </div>
    )
}