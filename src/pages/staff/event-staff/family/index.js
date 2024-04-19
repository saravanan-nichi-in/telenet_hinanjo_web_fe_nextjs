import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import {
    getValueByKeyRecursively as translate,
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getJapaneseDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getEnglishDateTimeDisplayActualFormat,
    toastDisplay,
} from "@/helper";
import { Button, CustomHeader, NormalTable, Input, CommonDialog, PersonCountModal, YappleModal, BarcodeDialog } from '@/components';
import { setEventStaffFamily } from '@/redux/family';
import { useAppDispatch } from '@/redux/hooks';
import { CheckInOutServices, StaffEvacuationServices, TempRegisterServices } from '@/services';
import { setSelfID } from '@/redux/self_id';
import { prefecturesCombined } from '@/utils/constant';

function EventStaffFamily() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const [eventID, setEventID] = useState(!_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "")

    const [familyCount, setFamilyCount] = useState(0);
    const [columnValues, setColumnValues] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [familyCode, setFamilyCode] = useState(null);
    const [refugeeName, setRefugeeName] = useState(null);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [openBarcodeDialog, setOpenBarcodeDialog] = useState(false);
    const [openBasicDataInfoDialog, setOpenBasicDataInfoDialog] = useState(false);
    const [basicDataInfo, setBasicDataInfo] = useState(null);
    const [totalList, setTotalList] = useState([])
    const [fullListPayload, setFullListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc"
        },
        event_id: eventID,
        family_code: "",
        refugee_name: ""

    });
    const [listPayload, setListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc"
        },
        event_id: eventID,
        family_code: "",
        refugee_name: ""

    });
    const [barcode, setBarcode] = useState(null);
    const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] = useState(false);

    const columnNames = [
        { field: 'number', header: translate(localeJson, 'staff_attendees_table_slno'), sortable: false, textAlign: 'center', className: "sno_class" },
        {
            field: 'person_refugee_name', header: translate(localeJson, 'name_public_evacuee'), sortable: true, alignHeader: "left", minWidth: "8rem",
            body: (rowData) => {
                return <div className="flex flex-column">
                    <div className={"text-highlighter-user-list clickable-row"}>
                        {rowData.person_name}
                    </div>
                    <div className={"clickable-row"}>
                        {rowData.person_refugee_name}
                    </div>
                </div>
            },
        },
        { field: "family_code", header: translate(localeJson, 'staff_attendees_table_family_code'), sortable: true, textAlign: 'left', minWidth: "5rem" },
        { field: "full_address", header: translate(localeJson, 'staff_attendees_table_adress'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: "8rem" },
        { field: "person_dob", header: translate(localeJson, 'staff_attendees_table_dob'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "3rem" },
        { field: "person_age", header: translate(localeJson, 'age'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "3rem" },
        { field: "person_gender", header: translate(localeJson, 'staff_attendees_table_gender'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "3rem" },
        { field: "family_join_date", header: translate(localeJson, 'event_admission_date_time'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "3rem" },
        { field: "family_out_date", header: translate(localeJson, 'discharge_date_time_attendees'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "3rem" },
    ];

    /* Services */
    const { eventCheckIn } = CheckInOutServices;
    const { getBasicDetailsInfo } = TempRegisterServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await listApiCall();
            setLoader(false);
        };
        fetchData();
    }, [locale, listPayload]);


    /**
     * Pagination handler
     * @param {*} e 
     */
    const onPaginationChange = async (e) => {
        setTableLoading(true);
        if (!_.isEmpty(e)) {
            const newStartValue = e.first; // Replace with your desired page value
            const newLimitValue = e.rows; // Replace with your desired limit value
            await setListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

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
        setStaffFamilyDialogVisible(false);
    };

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: 0,
                limit: listPayload.filters.limit,
                sort_by: "",
                order_by: "desc"
            },
            event_id: eventID,
            family_code: familyCode,
            refugee_name: refugeeName
        }
        setListPayload(payload);
    }

    const getGenderValueFromInt = (gender) => {
        if (parseInt(gender) == 1) {
            return translate(localeJson, 'male');
        } else if (parseInt(gender) == 2) {
            return translate(localeJson, 'female');
        } else if (parseInt(gender) == 3) {
            return translate(localeJson, 'others_count');
        }
    }

    /**
     * Get Evacuees list on mounting
     */
    const listApiCall = () => {
        StaffEvacuationServices.getStaffAttendeesList(listPayload, (response) => {
            var tempList = [];
            var familyTotalCount = 0;
            var listTotalCount = 0;
            if (response && response?.success) {
                let eventsList = response.data.events;
                let actualList = response.data.list;
                actualList.forEach((element, index) => {
                    let event_name = ""
                    if (eventsList.length > 0) {
                        let filteredEvent = eventsList.filter(item => item.id == element.event_id);
                        if (filteredEvent.length > 0) {
                            event_name = locale === "en" && !_.isNull(filteredEvent[0].name_en) ? filteredEvent[0].name_en : filteredEvent[0].name;
                        }
                    }
                    let dob = element.person_dob ? (locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(element.person_dob) : getEnglishDateDisplayFormat(element.person_dob)) : "";
                    let check_in = element.family_join_date ? (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(element.family_join_date) : getEnglishDateTimeDisplayActualFormat(element.family_join_date)) : "";
                    let check_out = element.family_out_date ? (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(element.family_out_date) : getEnglishDateTimeDisplayActualFormat(element.family_out_date)) : "";
                    let full_address = (element.family_zip_code ?? "") + " " + prefecturesCombined[element.family_prefecture_id ?? 0][locale] + " " + (element.family_address ?? "")
                    let main_gender = getGenderValueFromInt(element.person_gender);
                    let age_gender = element.person_age + "/" + getGenderValueFromInt(element.person_gender)
                    let tempObj = { ...element, age_gender: age_gender, person_gender: main_gender, person_dob: dob, family_join_date: check_in, family_out_date: check_out, event_name: event_name, full_address: full_address, number: index + parseInt(listPayload.filters.start) + 1 };
                    tempList.push(tempObj);
                });
                familyTotalCount = response.data.total_family;
                listTotalCount = response.data.total;
            }
            setTableLoading(false);
            setFullListPayload((prev) => ({
                ...prev,
                filters: {
                    ...prev.filters,
                    limit: listTotalCount > 0 ? listTotalCount : 10
                }
            }))
            StaffEvacuationServices.getStaffAttendeesList(fullListPayload, (response) => {
                if (response && response?.success) {
                    setTotalList(response.data.list)
                }
            })
            setColumnValues(tempList);
            setFamilyCount(familyTotalCount);
            setTotalCount(listTotalCount);
        });
    }

    const yappleModalSuccessCallBack = (res) => {
        listApiCall();
    }

    const validateAndMoveToForm = (id) => {
        fetchBasicDetailsInfo(id);
        dispatch(setSelfID({
            id: id
        }));
    }

    const fetchBasicDetailsInfo = (id) => {
        let payload = {
            "yapple_id": "",
            "ppid": id ? id : "00000018"
        };
        getBasicDetailsInfo(payload, (response) => {
            if (response.success) {
                const data = response.data;
                setBasicDataInfo(data);
                setOpenBarcodeDialog(false);
                setOpenBasicDataInfoDialog(true);
            }
        })
    }

    const basicInfoContent = () => {
        return <div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "name_kanji")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.name}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "refugee_name")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.refugee_name}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex'>
                    <div className='page-header3' style={{ whiteSpace: 'nowrap' }}>{translate(localeJson, "address")}:</div>
                    <div className='page-header3-sub ml-1' style={{ whiteSpace: 'normal' }}>{basicDataInfo?.address}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "tel")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.tel}</div>
                </div>
            </div>
            <div className='hidden mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.join_date ? getJapaneseDateTimeDisplayActualFormat(basicDataInfo.join_date) : ""}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "evacuation_place")}:</div>
                    <div className='page-header3-sub ml-1'>{layoutReducer?.user?.place.name}</div>
                </div>
            </div>
        </div>
    }

    const confirmRegistrationBeforeCheckin = () => {
        if (basicDataInfo.is_registered == 0) {
            let eventID = layoutReducer?.user?.place?.type === "event" ? layoutReducer?.user?.place?.id : ""
            eventCheckIn({
                event_id: eventID,
                yapple_id: basicDataInfo.yapple_id
            }, (response) => {
                if (response.success) {
                    setOpenBasicDataInfoDialog(false);
                }
            });
        }
        else if (basicDataInfo.is_registered == 1) {
            toastDisplay(translate(localeJson, 'already_checked_in'), '', '', "error");
        }
        else {
            toastDisplay(translate(localeJson, 'not_pre_registered_yet'), '', '', "error");
        }
    }

    return (
        <>
            <PersonCountModal
                open={staffFamilyDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'evacuee_registration_for_household_family')}
                content={
                    <div>
                        <div className='pb-3'>
                            <h5 className='modal-page-header2'>{translate(localeJson, 'how_many_people_evacuated')}</h5>
                        </div>
                        <div className='pb-1'>
                            <p className='pb-0'>{translate(localeJson, 'please_tell_how_many_households')}
                            </p>
                            <p className='pb-1'>{translate(localeJson, 'do_not_register_each_member_family_individually')}
                            </p>
                        </div>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-8rem",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => onClickCancelButton(),
                        },
                        parentClass: "inline"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-8rem update-button",
                            type: "submit",
                            text: translate(localeJson, 'continue'),
                            onClick: () => onClickOkButton(),
                        },
                        parentClass: "inline update-button"
                    }
                ]}
                close={() => {
                    setStaffFamilyDialogVisible(false);
                }}
            />
            <YappleModal
                open={importModalOpen}
                close={() => {
                    setImportModalOpen(false);
                }}
                barcode={barcode}
                setBarcode={setBarcode}
                isCheckIn={true}
                successCallBack={yappleModalSuccessCallBack}
                successHeader={"checkin_info_event"}
                isEvent={true}
                eventList={totalList}
                setRefugeeName={setRefugeeName}
                dynamicButtonText={true}
                keyJson={"register_event_qr"}
                type={layoutReducer?.user?.place?.type}
            />
            <CommonDialog
                open={openBasicDataInfoDialog}
                dialogBodyClassName="p-0"
                header={translate(localeJson, "pre_registration_info")}
                content={basicInfoContent()}
                position={"center"}
                footerParentClassName={"mt-5 w-12"}
                dialogClassName={"w-10 sm:w-8 md:w-4 lg:w-4"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-12",
                            text: translate(localeJson, "yapple_modal_success_div_green_btn"),
                            onClick: () => {
                                confirmRegistrationBeforeCheckin()
                            },
                        },
                        parentClass: "mb-2",
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-12 back-button",
                            text: translate(localeJson, "yapple_modal_success_div_white_btn"),
                            onClick: () => {
                                setOpenBasicDataInfoDialog(false);
                                setOpenBarcodeDialog(false)
                            },
                        },
                        parentClass: "back-button",
                    },
                ]}
                close={() => {
                    setOpenBasicDataInfoDialog(false);
                }}
            />
            <BarcodeDialog header={translate(localeJson, "barcode_dialog_heading")}
                visible={openBarcodeDialog} setVisible={setOpenBarcodeDialog}
                title={translate(localeJson, 'barcode_mynumber_dialog_main_title')}
                subTitle={translate(localeJson, 'barcode_mynumber_dialog_sub_title')}
                validateAndMoveToTempReg={(data) => validateAndMoveToForm(data)}
            ></BarcodeDialog>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "event_list")} />
                            <span>{translate(localeJson, 'current_number_of_visitors') + ": " + familyCount + translate(localeJson, 'people')}</span>
                        </div>
                        <div>
                            <div>
                                {/* Future */}
                                {/* <div className="flex justify-between">
                                    <Button buttonProps={{
                                        buttonClass: "w-full p-4",
                                        text: translate(localeJson, "staff_temp_register_big_btn_one"),
                                        type: "button",
                                        icon: <img src="/layout/images/Card.png" width={'30px'} height={'30px'} alt="scanner" />,
                                    }} parentClass="flex-1 p-2" />
                                    <Button buttonProps={{
                                        buttonClass: "w-full p-4",
                                        text: translate(localeJson, 'staff_temp_register_big_btn_two'),
                                        type: "button",
                                        icon: <img src="/layout/images/Scanner.png" width={'30px'} height={'30px'} alt="scanner" />,
                                        onClick: () => { setImportModalOpen(true) },
                                    }} parentClass="flex-1 p-2" />
                                </div> */}
                                <form>
                                    <div className='modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input'>
                                        <Input
                                            inputProps={{
                                                inputParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                                labelProps: {
                                                    text: translate(localeJson, 'name'),
                                                    inputLabelClassName: "block",
                                                },
                                                inputClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                                value: refugeeName,
                                                onChange: (e) => setRefugeeName(e.target.value)
                                            }}
                                        />
                                        <div className="flex align-items-end">
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                type: "button",
                                                onClick: () => searchListWithCriteria()
                                            }} parentClass={"search-button"} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="mt-3">
                                <NormalTable
                                    lazy
                                    id={"evacuation-list"}
                                    className="evacuation-list"
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    size={"small"}
                                    stripedRows={true}
                                    paginator={"true"}
                                    showGridlines={"true"}
                                    value={columnValues}
                                    columns={columnNames}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    first={listPayload.filters.start}
                                    rows={listPayload.filters.limit}
                                    paginatorLeft={true}
                                    onPageHandler={(e) => onPaginationChange(e)}
                                    selectionMode="single"
                                    onSelectionChange={
                                        (e) => {
                                            dispatch(setEventStaffFamily({ family_id: e.value.family_id, event_id: e.value.event_id }));
                                            router.push({
                                                pathname: '/staff/event-staff/family/family-detail'
                                            });
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventStaffFamily;