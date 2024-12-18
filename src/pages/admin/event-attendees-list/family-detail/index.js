import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import _ from 'lodash';
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowRightFromBracket } from 'react-icons/fa6';

import {
    getValueByKeyRecursively as translate,
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getJapaneseDateTimeDisplayFormat,
    getGeneralDateTimeDisplayFormat,
    showOverFlow,
    hideOverFlow
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CommonDialog, NormalTable, CardSpinner, CustomHeader, AdminManagementDeleteModal } from '@/components';
import { useAppSelector } from "@/redux/hooks";
import { prefecturesCombined } from '@/utils/constant';
import { EvacuationServices,AdminEventStatusServices } from '@/services';

export default function EventFamilyDetail() {
    const { locale, localeJson,setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const param = useAppSelector((state) => state.familyReducer.family);

    const [tableLoading, setTableLoading] = useState(false);
    const [familyDetailData, setFamilyDetailData] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const familyAdmissionColumns = [
        { field: 'shelter_place', header: translate(localeJson, 'staff_attendees_table_event_name'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time_attendees'), minWidth: "10rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time_attendees'), minWidth: "10rem", textAlign: 'left' },
    ];

    /* Services */
    const { getFamilyEvacueesAttendeesDetail, eventAttendeesCheckout } = EvacuationServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyAttendeesDetailOnMounting();
        };
        fetchData();
    }, [locale]);

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
                        // address: (personData[0].family_zip_code ? (translate(localeJson, 'post_letter') + personData[0].family_zip_code) : "") + " " + personData[0].family_address,
                        address: (personData[0].family_zip_code ? (translate(localeJson, 'post_letter') + personData[0].family_zip_code) : "") + " " + prefecturesCombined[personData[0].family_prefecture_id ?? 0][locale] + " " + personData[0].family_address,
                        tel: person?.family_tel && person.family_tel != "00000000000" ? person.family_tel : "",
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

    const updateEventCheckout = () => {
        eventAttendeesCheckout(param, (response) => {
            if (response.success) {
                router.push('/admin/event-attendees-list')
            }
            showOverFlow();
            setCheckoutVisible(false);
        })
    }

    const onConfirmDeleteRegisteredEvacuees = async () => {
        AdminEventStatusServices.bulkDelete(param, (res) => {
            if (res) {
                setLoader(false);
                router.push('/admin/event-attendees-list/');
            }
            else {
                setLoader(false);
            }

        });
    }
    const openDeleteDialog = () => {
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            onConfirmDeleteRegisteredEvacuees();
        }
        setDeleteOpen(false);
        showOverFlow();
    };

    return (
        <>
        <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
            />
            <CommonDialog
                open={checkoutVisible}
                dialogBodyClassName="p-3"
                header={translate(localeJson, "confirmation")}
                content={
                    <div className="text-center">
                        {translate(localeJson, "do_you_want_to_exit_the_shelter_event")}
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-full del_ok-button",
                            text: translate(localeJson, 'de_register_event'),
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
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information_attendees")} />
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
                                    <div className='page-header3'>{translate(localeJson, "gender")}:</div>
                                    <div className='page-header3-sub ml-1'>{familyDetailData[0].gender}</div>
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
                        <div className='section-space'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "checkin_checkout_history_attendees")} />
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
                        <div className='flex flex-column mt-3 mb-2 justify-content-center align-items-center flex-wrap'>
                            <Button buttonProps={{
                                buttonClass: "w-10rem exit-procedure-button ",
                                text: translate(localeJson, 'exit_procedures_attendees'),
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
                            <Button buttonProps={{
                                            type: "button",
                                            rounded: "true",
                                            delete: true,
                                            buttonClass: "w-10rem export-button",
                                            disabled: (familyDetailData?.length > 0 && familyDetailData[0].family_is_registered == 1) ? true : false,
                                            // disabled:isReg,
                                            text: translate(localeJson, 'delete_confirm'),
                                            severity: "primary",
                                            onClick: () => openDeleteDialog()
                                        }} parentClass={"mt-3 export-button"} />
                        </div>
                    </div>
                </div>
            </div >
        </>

    )
}