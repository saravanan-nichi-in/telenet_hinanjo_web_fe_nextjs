import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useAppSelector } from "@/redux/hooks";
import _ from 'lodash';
import { IoIosArrowBack } from "react-icons/io";

import {
    getValueByKeyRecursively as translate,
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    showOverFlow,
    hideOverFlow
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { EvacuationServices } from '@/services/evacuation.services';
import { Button, CommonDialog, NormalTable, CardSpinner } from '@/components';
import CustomHeader from '@/components/customHeader';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

export default function EventFamilyDetail() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const param = useAppSelector((state) => state.familyReducer.family);
    const [tableLoading, setTableLoading] = useState(false);
    const [yappleID, setYappleID] = useState(null);
    const [familyDetailData, setFamilyDetailData] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [checkoutVisible, setCheckoutVisible] = useState(false);

    const familyAdmissionColumns = [
        { field: 'shelter_place', header: translate(localeJson, 'staff_attendees_table_event_name'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time'), minWidth: "10rem", textAlign: 'left' },
    ];

    /* Services */
    const { getFamilyEvacueesAttendeesDetail, eventAttendeesCheckout } = EvacuationServices;

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'others_count');
        }
    }

    const onGetEvacueesFamilyAttendeesDetailOnMounting = () => {
        getFamilyEvacueesAttendeesDetail(param, getEvacueesFamilyAttendeesDetail)
    }

    const getEvacueesFamilyAttendeesDetail = (response) => {
        var familyDataList = [];
        var admittedHistory = [];
        if (response.success && !_.isEmpty(response.data)) {
            const personData = response.data.data;
            const historyData = response.data.history.list;
            setYappleID(personData[0].yapple_id);
            if (personData.length > 0) {
                personData.map((person, index) => {
                    let familyData = {
                        id: index + 1,
                        refugee_name: person.person_refugee_name,
                        name: person.person_name,
                        dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.person_dob) : getEnglishDateDisplayFormat(person.person_dob),
                        age: person.person_age,
                        age_month: person.person_month ? person.person_month : "",
                        gender: getGenderValue(person.person_gender),
                        is_owner: person.person_is_owner == 0 ? translate(localeJson, 'representative') : "",
                        address: (personData[0].family_zip_code ? (translate(localeJson, 'post_letter') + personData[0].family_zip_code) : "") + " " + personData[0].family_address,
                        tel: person.family_tel,
                        evacuation_date_time: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.family_join_date) : getEnglishDateDisplayFormat(person.family_join_date),
                        family_code: person.family_code,
                        family_is_registered: person.family_is_registered
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

    const updateEventCheckout = () => {
        let payload = {
            event_id: param.event_id,
            yapple_id: yappleID
        }
        eventAttendeesCheckout(payload, (response) => {
            if (response.success) {
                setCheckoutVisible(false);
                showOverFlow();
                router.push('/admin/event-attendees-list')
            }
        })
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyAttendeesDetailOnMounting();
        };
        fetchData();
    }, [locale]);

    return (
        <>
            <CommonDialog
                open={checkoutVisible}
                dialogBodyClassName="p-3"
                header={translate(localeJson, "confirmation")}
                content={
                    <div className="text-center">
                        {translate(localeJson, "do_you_want_to_exit_the_shelter")}
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-full del_ok-button",
                            text: translate(localeJson, 'submit'),
                            onClick: () => updateEventCheckout(),
                        },
                        parentClass: "del_ok-button modal-button-footer-space",
                        type: "button"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-full back-button",
                            text: translate(localeJson, "cancel"),
                            onClick: () => {
                                setCheckoutVisible(false);
                                showOverFlow();
                            },

                        },
                        parentClass: "back-button",
                        type: "button"
                    },

                ]}
                close={() => {
                    setCheckoutVisible(false);
                    showOverFlow();
                }}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "attendee_list_detail_back_admin"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/admin/event-attendees-list/'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
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
                                    <div className='page-header3'>{translate(localeJson, "address")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].address}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "evacuation_date_time_new")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].evacuation_date_time}</div>
                                </div>
                                <div className='flex align-items-center details-text-overflow'>
                                    <div className='page-header3'>{translate(localeJson, "family_code")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].family_code}</div>
                                </div>
                            </div>
                        )}
                        <div className='section-space'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "checkin_checkout_history")} />
                            <div className='mt-2 flex overflow-x-auto'>
                                <NormalTable
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
                        <div className="flex mt-2 gap-2 justify-content-center">
                            <Button buttonProps={{
                                buttonClass: "w-10rem exit-procedure-button ",
                                text: translate(localeJson, 'exit_procedures'),
                                icon: <FaArrowRightFromBracket className='mr-1' />,
                                disabled: (familyDetailData?.length > 0 && familyDetailData[0].family_is_registered == 1) ? false : true,
                                onClick: () => {
                                    if (familyDetailData?.length > 0 && familyDetailData[0].family_is_registered == 1) {
                                        setCheckoutVisible(true)
                                        hideOverFlow();
                                    } else {
                                        return null;
                                    }
                                }
                            }
                            } parentClass={"inline exit-procedure-button "} />
                        </div>
                    </div>
                </div>
            </div >
        </>

    )
}