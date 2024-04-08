import React, { useState, useContext, useEffect } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router'

import { useAppDispatch } from '@/redux/hooks';
import { setFamily } from '@/redux/family';
import {
    getEnglishDateDisplayFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getValueByKeyRecursively as translate
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, NormalTable } from '@/components';
import { Input, InputDropdown } from '@/components/input';
import { AdminEventStatusServices, CommonServices } from '@/services';
import { prefecturesCombined } from '@/utils/constant';

export default function EventAttendeesList() {
    const { locale, localeJson } = useContext(LayoutContext);
    const [selectedOption, setSelectedOption] = useState({
        name: "--",
        id: 0
    });
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [eventName, setEventName] = useState();
    const [eventDropdownList, setEventDropdownList] = useState([]);
    const [searchFieldName, setSearchFieldName] = useState('');
    const [columnValues, setColumnValues] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [familyCount, setFamilyCount] = useState(0);
    const [listPayload, setListPayload] = useState(
        {
            "filters": {
                "start": 0,
                "limit": 10,
                "sort_by": "",
                "order_by": "desc",
                "event_id": "",
                "family_code": "",
                "refugee_name": ""
            },
        }
    );
    const columnNames = [
        { field: 'number', header: translate(localeJson, 'staff_attendees_table_slno'), sortable: false, textAlign: 'center', className: "sno_class" },
        { field: "event_name", header: translate(localeJson, 'staff_attendees_table_event_name'), sortable: false, textAlign: 'left', minWidth: "8rem" },
        {
            field: 'person_refugee_name', header: translate(localeJson, 'name_public_evacuee'), sortable: true, alignHeader: "left", minWidth: "8rem", maxWidth: "8rem",
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
        { field: "family_code", header: translate(localeJson, 'staff_attendees_table_family_code'), sortable: true, textAlign: 'left', minWidth: "8rem", maxWidth: "8rem", },
        { field: "full_address", header: translate(localeJson, 'staff_attendees_table_adress'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: "8rem", maxWidth: "14rem" },
        { field: "person_dob", header: translate(localeJson, 'staff_attendees_table_dob'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "8rem", maxWidth: "8rem" },
        { field: "person_age", header: translate(localeJson, 'age'), sortable: true, textAlign: 'center', alignHeader: "center", minWidth: "5rem", maxWidth: "5rem" },
        { field: "person_gender", header: translate(localeJson, 'staff_attendees_table_gender'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "5rem", maxWidth: "5rem" },
        { field: "family_join_date", header: translate(localeJson, 'event_admission_date_time'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "8rem", maxWidth: "8rem" },
        { field: "family_out_date", header: translate(localeJson, 'discharge_date_time_attendees'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "9rem", maxWidth: "9rem" },
        { field: "yapple_id", header: translate(localeJson, 'yapple_id'), sortable: true, textAlign: 'left', alignHeader: "left", minWidth: "9rem", maxWidth: "9rem" }
    ];

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

    const getGenderValueFromInt = (gender) => {
        if (parseInt(gender) == 1) {
            return translate(localeJson, 'male');
        } else if (parseInt(gender) == 2) {
            return translate(localeJson, 'female');
        } else if (parseInt(gender) == 3) {
            return translate(localeJson, 'others_count');
        }
    }

    const listApiCall = async () => {
        let payload = {
            filters: {
                start: listPayload.filters.start,
                limit: listPayload.filters.limit,
                sort_by: listPayload.filters.sort_by,
                order_by: listPayload.filters.order_by,
                event_id: listPayload.filters.event_id,
                family_code: listPayload.filters.family_code,
                refugee_name: listPayload.filters.refugee_name,
            },
        }
        await AdminEventStatusServices.getAttendeesList(payload, (response) => {
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
                    // let full_address = (element.family_address ?? "") + "" + (element.family_zip_code ?? "")
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
            setColumnValues(tempList);
            setFamilyCount(familyTotalCount);
            setTotalCount(listTotalCount);
        });
    }

    const eventListApiCall = async () => {
        await CommonServices.getEventList({}, (response) => {
            let tempResponse = (response?.data?.model) ?? [];
            let tempList = [{
                id: 0,
                name: '--'
            }];
            let keyValues = {};
            tempResponse.forEach((val, index) => {
                tempList.push(val);
                keyValues[val.id] = val.name;
            })
            setEventName(keyValues);
            setEventDropdownList(tempList);
        })
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await eventListApiCall();
            await listApiCall();
        };
        fetchData();
    }, [locale, listPayload]);

    const searchListWithCriteria = () => {
        setListPayload({
            "filters": {
                "start": 0,
                "limit": 10,
                "sort_by": "",
                "order_by": "desc",
                "event_id": selectedOption.id ? selectedOption.id : "",
                "family_code": "",
                "refugee_name": searchFieldName
            },
        })
    }

    const downloadEvacueesListCSV = () => {
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div className="flex gap-2 align-items-center ">
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "attendee_list")} />
                        <div className='page-header1-sub mb-2'>{`(${totalCount}${translate(localeJson, "people")})`}</div>
                    </div>
                    <div>
                        <div>
                            <form>
                                <div className='modal-field-top-space modal-field-bottom-space flex flex-wrap align-items-end justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input'>
                                    <InputDropdown inputDropdownProps={{
                                        inputDropdownParentClassName: "w-full lg:w-14rem md:w-14rem sm:w-10rem mt-1",
                                        labelProps: {
                                            text: translate(localeJson, 'questionnaire_name'),
                                            inputDropdownLabelClassName: "block"
                                        },
                                        inputDropdownClassName: "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                                        customPanelDropdownClassName: "w-10rem",
                                        value: selectedOption,
                                        options: eventDropdownList,
                                        optionLabel: "name",
                                        onChange: (e) => {
                                            setSelectedOption(e.value)
                                        },
                                        emptyMessage: translate(localeJson, "data_not_found"),
                                    }}
                                    />
                                    <Input
                                        inputProps={{
                                            inputParentClassName: "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                                            labelProps: {
                                                text: translate(localeJson, 'name'),
                                                inputLabelClassName: "block",
                                            },
                                            inputClassName: "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                                            onChange: (e) => setSearchFieldName(e.target.value)
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <p className='pt-4 page-header2 font-bold'>{translate(localeJson, "totalSummary")}: {familyCount}</p>
                            </div>
                            {/* Development */}
                            {/* <div className='flex pt-3' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    export: true,
                                    buttonClass: "evacuation_button_height export-button",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => downloadEvacueesListCSV()
                                }} parentClass={"mb-3 export-button"} />
                            </div> */}
                        </div>
                    </div>
                    <div>
                        <NormalTable
                            stripedRows={true}
                            className={"custom-table-cell"}
                            showGridlines={"true"}
                            columns={columnNames}
                            value={columnValues}
                            filterDisplay="menu"
                            emptyMessage={translate(localeJson, "data_not_found")}
                            paginator={true}
                            paginatorLeft={true}
                            lazy
                            totalRecords={totalCount}
                            loading={tableLoading}
                            first={listPayload.filters.start}
                            rows={listPayload.filters.limit}
                            onPageHandler={(e) => onPaginationChange(e)}
                            onSort={(data) => {
                                setListPayload({
                                    ...listPayload,
                                    filters: {
                                        ...listPayload.filters,
                                        sort_by: data.sortField,
                                        order_by: listPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
                                    }
                                }
                                )
                            }}
                            selectionMode="single"
                            onSelectionChange={
                                (e) => {
                                    if (e.value.family_id) {
                                        dispatch(setFamily({
                                            lgwan_family_id: e.value.family_id,
                                            event_id: e.value.event_id
                                        }));
                                        router.push({
                                            pathname: '/admin/event-attendees-list/family-detail',
                                        });
                                    }
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}