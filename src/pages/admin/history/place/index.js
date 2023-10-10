import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router'

import { getGeneralDateTimeDisplayFormat, getJapaneseDateTimeDisplayFormat, getYYYYMMDDHHSSSSDateTimeFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { DateTimeCalendarFloatLabel } from '@/components/date&time';
import { EmailSettings } from '@/components/modal';
import { HistoryServices } from '@/services/history.services';
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';

/**
 * Shelter Place History Status
 * @param reportedDate, shelterPlaceName
 * @returns Table View 
 */

export default function AdminHistoryPlacePage() {
    const { localeJson, locale, setLoader } = useContext(LayoutContext);
    const [historyPlaceList, setHistoryPlaceList] = useState([]);
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const [historyPlaceDropdown, setHistoryPlaceDropdown] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [emptyTableMessage, setEmptyTableMessage] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
        },
        start_date: "",
        end_date: "",
        place_name: ""
    });
    const historyTableColumns = [
        { field: 'si_no', header: translate(localeJson, 'si_no'), minWidth: "5rem", sortable: false, textAlign: 'left' },
        { field: 'created_at', header: translate(localeJson, 'report_date_time'), minWidth: "15rem", sortable: false },
        { field: 'prefecture_name', header: translate(localeJson, 'prefecture'), minWidth: "6rem", sortable: false },
        { field: 'place_name', header: translate(localeJson, 'place_name'), minWidth: "12rem", sortable: false },
        { field: 'place_name_en', header: translate(localeJson, 'place_name_furigana'), minWidth: "12rem", sortable: false },
        { field: "place_address", header: translate(localeJson, 'address'), minWidth: "10rem", sortable: false },
        { field: "place_latitude", header: translate(localeJson, 'location_latitude'), minWidth: "10rem", sortable: false },
        { field: "place_longitude", header: translate(localeJson, 'location_longitude'), minWidth: "10rem", sortable: false },
        { field: "place_public_availability", header: translate(localeJson, 'place_public_availability'), minWidth: "8rem", sortable: false },
        { field: "place_opened_status", header: translate(localeJson, 'opened_status'), minWidth: "8rem", sortable: false },
        { field: "place_evacuees_count", header: translate(localeJson, 'evacuees_count'), minWidth: "7rem", sortable: false },
        { field: "place_full_status", header: translate(localeJson, 'availability_status'), minWidth: "7rem", sortable: false },
        { field: "place_opening_date_time", header: translate(localeJson, 'opened_date_time'), minWidth: "15rem", sortable: false },
        { field: "place_closing_date_time", header: translate(localeJson, 'closed_date_time'), minWidth: "15rem", sortable: false },
        { field: "place_remarks", header: translate(localeJson, 'remarks'), minWidth: "5rem" }
    ];

    /* Services */
    const { getList, getPlaceDropdownList, exportPlaceHistoryCSVList, registerEmailConfiguration } = HistoryServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetHistoryPlaceListOnMounting();
            await onGetHistoryPlaceDropdownListOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    /**
     * Get History Place list on mounting
     */
    const onGetHistoryPlaceListOnMounting = () => {
        getList(getListPayload, onGetHistoryPlaceList);
    }

    /**
     * Get History Place Dropdown list on mounting
     */
    const onGetHistoryPlaceDropdownListOnMounting = () => {
        // Get dashboard list
        getPlaceDropdownList({}, onGetHistoryPlaceDropdownList);
    }

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: 0,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc",
            },
            start_date: selectedDate ? getGeneralDateTimeDisplayFormat(selectedDate[0]) : "",
            end_date: selectedDate ? getGeneralDateTimeDisplayFormat(selectedDate[1]) : "",
            place_name: selectedCity ? selectedCity.name : ""
        }
        getList(payload, onGetHistoryPlaceList);
        setGetListPayload(payload);
    }

    /**
     * Function will get data & update History Place list
     * @param {*} data 
    */
    const onGetHistoryPlaceDropdownList = (response) => {
        let historyPlaceCities = [];
        if (response.success && !_.isEmpty(response.data)) {
            const data = response.data.model;
            data.map((obj, i) => {
                let placeDropdownList = {
                    name: response.locale == 'ja' ? obj.name : obj.name_en,
                    code: obj.id
                }
                historyPlaceCities.push(placeDropdownList)
            })
            setHistoryPlaceDropdown(historyPlaceCities);
        }
    }
    /**
     * Function will get data & update History Place list
     * @param {*} data 
    */
    const onGetHistoryPlaceList = (response) => {
        if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
            const data = response.data.model.list;
            console.log(data);
            let historyPlaceListData = [];
            data.map((obj, i) => {
                let historyData = {
                    "si_no": i + 1,
                    "created_at": obj.created_at ? getJapaneseDateTimeDisplayFormat(obj.created_at) : "",
                    "prefecture_name": obj.prefecture_name,
                    "place_name": obj.place_name,
                    "place_name_en": obj.place_name_en,
                    "place_address": obj.place_address,
                    "place_latitude": obj.place_latitude,
                    "place_longitude": obj.place_longitude,
                    "place_public_availability": obj.place_public_availability,
                    "place_opened_status": obj.place_opened_status,
                    "place_evacuees_count": obj.place_evacuees_count,
                    "place_full_status": obj.place_full_status,
                    "place_opening_date_time": obj.place_opening_date_time ? getJapaneseDateTimeDisplayFormat(obj.place_opening_date_time) : "",
                    "place_closing_date_time": obj.place_closing_date_time ? getJapaneseDateTimeDisplayFormat(obj.place_closing_date_time) : "",
                    "place_remarks": obj.place_remarks,
                };
                historyPlaceListData.push(historyData);
            });
            setTotalCount(response.data.model.total);
            setTableLoading(false);
            setHistoryPlaceList(historyPlaceListData);
        }
        else {
            setHistoryPlaceList([]);
            setEmptyTableMessage(response.message);
        }
    }

    const downloadPlaceHistoryCSV = () => {
        exportPlaceHistoryCSVList(getListPayload, exportPlaceHistoryCSV);
    }

    const exportPlaceHistoryCSV = (response) => {
        if (response.success) {
            const downloadLink = document.createElement("a");
            const fileName = "Place_history" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
            downloadLink.href = response.result.file;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    }

    /**
     * Email setting modal close
    */
    const onEmailSettingsClose = () => {
        setEmailSettingsOpen(!emailSettingsOpen);
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        console.log(values);
        const emailList = values.email.split(",");
        if (Object.keys(values.errors).length == 0 && values.email.length > 0) {
            let payload = {
                email: emailList,
                frequency: values.transmissionInterval,
                prefecture_id: values.outputTargetArea
            }
            registerEmailConfiguration(payload, registerEmailConfig)
            setEmailSettingsOpen(false);
        }
    };

    const registerEmailConfig = (response) => {
        console.log(response);
    }

    /**
     * Pagination handler
     * @param {*} e 
     */
    const onPaginationChange = async (e) => {
        setTableLoading(true);
        if (!_.isEmpty(e)) {
            const newStartValue = e.first; // Replace with your desired page value
            const newLimitValue = e.rows; // Replace with your desired limit value
            await setGetListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    return (
        <React.Fragment>
            <EmailSettings
                open={emailSettingsOpen}
                close={onEmailSettingsClose}
                register={onRegister}
                intervalFrequency={MailSettingsOption1}
                prefectureList={MailSettingsOption2}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <div className='w-full flex flex-wrap sm:flex-no-wrap align-items-center justify-content-between gap-2'>
                            <div className='flex justify-content-center align-items-center gap-2'>
                                <h5 className='page-header1'>{translate(localeJson, 'history_place')}</h5>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <div>
                                <div className='w-full md:w-auto flex flex-grow justify-content-end align-items-center gap-2'>
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        buttonClass: "w-50",
                                        text: translate(localeJson, 'export'),
                                        severity: "primary",
                                        onClick: () => downloadPlaceHistoryCSV()
                                    }} />
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        buttonClass: "w-50",
                                        text: translate(localeJson, 'mail_setting'),
                                        onClick: () => setEmailSettingsOpen(true),
                                        severity: "success"
                                    }} />
                                </div>
                                <form>
                                    <div className='mt-5 mb-3 flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow align-items-center justify-content-end gap-2 mobile-input ' >
                                        <DateTimeCalendarFloatLabel dateTimeFloatLabelProps={{
                                            inputId: "settingStartDate",
                                            selectionMode: "range",
                                            text: translate(localeJson, "report_date_time"),
                                            dateTimeClass: "w-full lg:w-22rem md:w-20rem sm:w-14rem ",
                                            onChange: (e) => setSelectedDate(e.value)
                                        }} parentClass="w-20rem lg:w-22rem md:w-20rem sm:w-14rem input-align" />
                                        <InputSelectFloatLabel dropdownFloatLabelProps={{
                                            inputId: "shelterCity",
                                            inputSelectClass: "w-20rem lg:w-13rem md:w-14rem sm:w-14rem",
                                            value: selectedCity,
                                            options: historyPlaceDropdown,
                                            optionLabel: "name",
                                            onChange: (e) => setSelectedCity(e.value),
                                            text: translate(localeJson, "shelter_place_name"),
                                            custom: "mobile-input custom-select"
                                        }} parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-14rem" />
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button mobile-input",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary",
                                                type: "button",
                                                onClick: () => searchListWithCriteria()
                                            }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <NormalTable
                                lazy
                                totalRecords={totalCount}
                                loading={tableLoading}
                                size={"small"}
                                stripedRows={true}
                                paginator={"true"}
                                showGridlines={"true"}
                                value={historyPlaceList}
                                columns={historyTableColumns}
                                emptyMessage={emptyTableMessage}
                                first={getListPayload.filters.start}
                                rows={getListPayload.filters.limit}
                                paginatorLeft={true}
                                onPageHandler={(e) => onPaginationChange(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}