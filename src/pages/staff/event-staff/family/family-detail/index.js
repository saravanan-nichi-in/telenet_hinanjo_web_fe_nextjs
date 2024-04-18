import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { IoIosArrowBack } from 'react-icons/io';

import {
    getEnglishDateDisplayFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getJapaneseDateTimeDisplayFormat,
    getGeneralDateTimeDisplayFormat,
    getValueByKeyRecursively as translate
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable, CardSpinner, CustomHeader } from '@/components';
import { prefecturesCombined } from '@/utils/constant';
import { StaffEvacuationServices } from '@/services';

export default function EventStaffFamilyDetail() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    // Getting storage data with help of reducers
    const familyReducer = useSelector((state) => state.familyReducer);

    const [tableLoading, setTableLoading] = useState(false);
    const [familyDetailData, setFamilyDetailData] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);

    const param = {
        event_id: familyReducer?.eventStaffFamily?.event_id ?? 0,
        lgwan_family_id: familyReducer?.eventStaffFamily?.family_id ?? 0
    };

    const familyAdmissionColumns = [
        { field: 'shelter_place', header: translate(localeJson, 'questionnaire_name'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time_attendees'), minWidth: "12rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time_attendees'), minWidth: "12rem", textAlign: 'left' },
    ];

    /* Services */
    const { getStaffFamilyEvacueesDetail } = StaffEvacuationServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyDetailOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    const onGetEvacueesFamilyDetailOnMounting = () => {
        getStaffFamilyEvacueesDetail(param, getEvacueesFamilyDetail)
    }

    const getEvacueesFamilyDetail = (response) => {
        var familyDataList = [];
        var admittedHistory = [];
        if (response.success && !_.isEmpty(response.data)) {
            const personData = response.data.data;
            const historyData = response.data.history.list;
            if (personData.length > 0) {
                personData.map((person, index) => {
                    let familyData = {
                        id: index + 1,
                        refugee_name: person.person_refugee_name,
                        name: person.person_name ?? "",
                        dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.person_dob) : getEnglishDateDisplayFormat(person.person_dob),
                        age: person.person_age,
                        age_month: person.person_month ? person.person_month : "",
                        gender: person.person_gender,//getGenderValue(person.person_gender),
                        address: (person.family_zip_code ? (translate(localeJson, 'post_letter') + personData[0].family_zip_code) : "") + " " + prefecturesCombined[personData[0].family_prefecture_id ?? 0][locale] + " " + personData[0].family_address,
                        tel: person.family_tel,
                        evacuation_date_time: locale == "ja" ? getJapaneseDateTimeDisplayFormat(person.family_join_date) : getGeneralDateTimeDisplayFormat(person.family_join_date),
                        family_code: person.family_code,
                        family_is_registered: person.family_is_registered,
                    };
                    familyDataList.push(familyData);
                })
            }
            if (historyData.length > 0) {
                historyData.map((item) => {
                    let historyItem = {
                        event_id: item.event_id,
                        shelter_place: item.event_name,
                        admission_date_time: item.checkin && (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkin) : getEnglishDateTimeDisplayActualFormat(item.checkin)),
                        discharge_date_time: item.checkout && (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkout) : getEnglishDateTimeDisplayActualFormat(item.checkout)),
                    };
                    admittedHistory.push(historyItem);
                });
            }
        }
        setTableLoading(false);
        setFamilyDetailData(familyDataList);
        setFamilyAdmittedData(admittedHistory);
    }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "attendee_list_detail_back"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/staff/event-staff/family'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "attendee_info")} />
                        {tableLoading ? (
                            <CardSpinner />
                        ) : familyDetailData && familyDetailData[0] && (
                            <div className='custom-card-info my-3' >
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "name_kanji")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].name}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "name_phonetic")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].refugee_name}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "dob")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].dob}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "age")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].age}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "age_month")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].age_month}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "tel")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].tel}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "address")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].address}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "checkin_date_time")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].evacuation_date_time}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "family_code")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].family_code}</div>
                                </div>
                                {familyAdmittedData && familyAdmittedData[0] && (
                                    <div className='flex align-items-center details-text-overflow'>
                                        <div className='page-header3'>{translate(localeJson, "staff_attendees_table_event_name")}:</div>
                                        <div className='page-header3-sub ml-1'>{familyAdmittedData[0].shelter_place}</div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className='mt-2 flex justify-content-center overflow-x-auto'>
                            <NormalTable
                                id="evacuee-family-detail"
                                size={"small"}
                                loading={tableLoading}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                stripedRows={true}
                                paginator={false}
                                showGridlines={true}
                                value={familyAdmittedData}
                                columns={familyAdmissionColumns}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}