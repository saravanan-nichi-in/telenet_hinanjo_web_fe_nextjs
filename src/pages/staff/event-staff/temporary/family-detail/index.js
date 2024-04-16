import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { getEnglishDateDisplayFormat, getEnglishDateTimeDisplayActualFormat, getJapaneseDateDisplayYYYYMMDDFormat, getJapaneseDateTimeDisplayActualFormat, getJapaneseDateTimeDisplayFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable, CommonDialog, RowExpansionTable, CustomHeader } from '@/components';
import { prefectures } from '@/utils/constant';
import { TemporaryStaffRegistrantServices } from '@/services';

export default function EventStaffTemporaryFamilyDetail() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [familyCode, setFamilyCode] = useState(null);
    const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
    const [familyDetailData, setfamilyDetailData] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [neighbourData, setNeighbourData] = useState(null);
    const [townAssociationColumn, setTownAssociationColumn] = useState([]);
    const [evacueePersonInnerColumns, setEvacueePersonInnerColumns] = useState([]);
    const param = {
        place_id: !_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "",
        family_id: router.query.family_id
    };

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
        { field: "special_care_name", header: translate(localeJson, 'special_care_type'), minWidth: "8rem" },
        { field: "connecting_code", header: translate(localeJson, 'connecting_code'), minWidth: "7rem" },
        { field: "remarks", header: translate(localeJson, 'remarks'), minWidth: "7rem" },
    ];

    const familyAdmissionColumns = [
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem" },
        { field: 'admission_date_time', header: translate(localeJson, 'temporary_admission_time'), minWidth: "10rem", textAlign: 'left' },
    ];

    /* Services */
    const { getFamilyTemporaryEvacueesDetail, updateCheckInDetail } = TemporaryStaffRegistrantServices;
 
    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetTemporaryEvacueesFamilyDetailOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    /**
     * CommonDialog modal close
     */
    const onClickCancelButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    /**
     * CommonDialog modal open
     */
    const onClickOkButton = () => {
        updateCheckInDetail(param, (response) => {
            if (response.success) {
                router.push("/staff/event-staff/temporary/family");
            }
        });
        setStaffFamilyDialogVisible(false);
    };

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

    const onGetTemporaryEvacueesFamilyDetailOnMounting = () => {
        getFamilyTemporaryEvacueesDetail(param, getEvacueesFamilyDetail)
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
                    dob: person.dob ? (locale === "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.dob) : getEnglishDateDisplayFormat(person.dob)) : "",
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
                    admission_date_time: item.status == 0 ? (item.access_datetime ? (locale == "ja" ? getJapaneseDateTimeDisplayActualFormat(item.access_datetime) : getEnglishDateTimeDisplayActualFormat(item.access_datetime)) : "") : "",
                };
                admittedHistory.push(historyItem);

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

    return (
        <>
            <CommonDialog
                open={staffFamilyDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'confirmation_information')}
                content={
                    <div>
                        <p>{translate(localeJson, 'do_you_want_to_enter_the_shelter')}</p>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-8rem back-button",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => onClickCancelButton(),
                        },
                        parentClass: "inline back-button"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-8rem update-button",
                            type: "submit",
                            text: translate(localeJson, 'submit'),
                            onClick: () => onClickOkButton(),
                        },
                        parentClass: "inline update-button"
                    }
                ]}
                close={() => {
                    setStaffFamilyDialogVisible(false);
                }}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information_details")} />
                        <div>
                            <div className='mb-2'>
                                <div className='flex justify-content-end' style={{ fontWeight: "bold" }}>
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
                                parentClass="mb-4"
                            />
                            <div className='mb-2'>
                                <CustomHeader headerClass={"page-header2"} header={translate(localeJson, "household_list")} />
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
                            <div className='flex mt-2 mb-2' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height back-button",
                                    text: translate(localeJson, 'cancel'),
                                    onClick: () => router.push('/staff/event-staff/temporary/family'),
                                }} parentClass={"mr-1 mt-1 back-button"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height edit-button",
                                    text: translate(localeJson, 'edit'),
                                }} parentClass={"mr-1 mt-1 edit-button"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height create-button",
                                    text: translate(localeJson, 'check_in'),
                                    onClick: () => setStaffFamilyDialogVisible(true)
                                }} parentClass={"mr-1 mt-1 create-button"} />
                            </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}