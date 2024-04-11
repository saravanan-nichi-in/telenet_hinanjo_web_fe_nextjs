import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, CustomHeader, NormalTable } from "@/components";
import { UserPlaceListServices } from '@/services';
import { useAppDispatch } from '@/redux/hooks';
import { setUserDetails } from '@/redux/layout';

export default function HinanjoList() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const [tableLoading, setTableLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
        },
        search: "",
    });

    const columnsData = [
        { field: 'sl_no', header: translate(localeJson, 'event_places_list_column_header_sl_no'), headerClassName: "custom-header", className: "sno_class", textAlign: 'center' },
        { field: 'name', header: translate(localeJson, 'event_places_list_column_header_name'), headerClassName: "custom-header", minWidth: "13rem", maxWidth: "13rem", textAlign: 'left' },
        { field: 'name_en', header: translate(localeJson, 'event_places_list_column_header_name_en'), headerClassName: "custom-header", minWidth: "10rem", textAlign: 'left' },
        { field: 'tel', header: translate(localeJson, 'event_places_list_column_header_tel'), headerClassName: "custom-header", minWidth: "6rem" },
        { field: 'total_place', header: translate(localeJson, 'event_places_list_column_header_total_place'), headerClassName: "custom-header", minWidth: "6rem", textAlign: "center", alignHeader: "center" },
        { field: 'full_status', header: translate(localeJson, 'event_places_list_column_header_full_status'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'altitude', header: translate(localeJson, 'event_places_list_column_header_full_status'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'refugee_name', header: translate(localeJson, 'event_places_list_column_header_refugee_name'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'full_status', header: translate(localeJson, 'event_places_list_column_header_full_status'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'opening_date_time', header: translate(localeJson, 'event_places_list_column_header_opening_date_time'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'closing_date_time', header: translate(localeJson, 'event_places_list_column_header_closing_date_time'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'public_availability', header: translate(localeJson, 'event_places_list_column_header_public_availability'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        { field: 'remarks', header: translate(localeJson, 'event_places_list_column_header_remarks'), headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
        {
            field: 'actions',
            header: translate(localeJson, 'event_list_column_header_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            minWidth: "2rem",
            body: (rowData) => (
                <>
                    <Button parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: 'View',
                            buttonClass: "delete-button ml-2 danger",
                            // onClick: () => openDeleteDialog(rowData.id)
                        }} parentClass={"delete-button"} />
                </>
            ),
        }
    ];

    /* Services */
    const { getList } = UserPlaceListServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getPublicEvacueesList();
        };
        fetchData();
    }, [locale, getListPayload]);

    /**
     * Get public evacuees list
     */
    const getPublicEvacueesList = () => {
        let pageStart = Math.floor(getListPayload.filters.start / getListPayload.filters.limit);
        let payload = {
            filters: {
                start: pageStart,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc",
            },
            search: "",
        }
        getList(payload, onGetPublicEvacueesList);
    }

    /**
     * Function will get data & update dashboard list
     * @param {*} response 
     */
    const onGetPublicEvacueesList = (response) => {
        setColumns([
            { "sl_no": 1, "name": "Event A", "name_en": "Event A (EN)", "tel": "123-456-7890", "total_place": 100, "full_status": "Not Full", "altitude": 500, "refugee_name": "Refugee 1", "opening_date_time": "2022-01-01T10:00:00", "closing_date_time": "2022-01-01T18:00:00", "public_availability": "Yes", "remarks": "Example Remark A" },
            { "sl_no": 2, "name": "Event B", "name_en": "Event B (EN)", "tel": "987-654-3210", "total_place": 150, "full_status": "Full", "altitude": 600, "refugee_name": "Refugee 2", "opening_date_time": "2022-02-15T11:30:00", "closing_date_time": "2022-02-15T20:00:00", "public_availability": "No", "remarks": "Example Remark B" },
            { "sl_no": 3, "name": "Event C", "name_en": "Event C (EN)", "tel": "555-123-7890", "total_place": 120, "full_status": "Not Full", "altitude": 700, "refugee_name": "Refugee 3", "opening_date_time": "2022-03-20T09:45:00", "closing_date_time": "2022-03-20T17:30:00", "public_availability": "Yes", "remarks": "Example Remark C" },
            { "sl_no": 4, "name": "Event D", "name_en": "Event D (EN)", "tel": "111-222-3333", "total_place": 200, "full_status": "Full", "altitude": 800, "refugee_name": "Refugee 4", "opening_date_time": "2022-05-10T13:15:00", "closing_date_time": "2022-05-10T22:00:00", "public_availability": "No", "remarks": "Example Remark D" },
            { "sl_no": 5, "name": "Event E", "name_en": "Event E (EN)", "tel": "999-888-7777", "total_place": 80, "full_status": "Not Full", "altitude": 900, "refugee_name": "Refugee 5", "opening_date_time": "2022-06-25T08:00:00", "closing_date_time": "2022-06-25T16:45:00", "public_availability": "Yes", "remarks": "Example Remark E" }
        ]);
        // setList(preparedList);
        setTotalCount(5);
        setTableLoading(false);
    }

    /**
     * Place name callback function
     * @param {*} obj 
     * @returns 
     */
    const onClickPlaceName = async (obj) => {
        if (obj) {
            let payload = Object.assign({}, layoutReducer?.user);
            payload['place'] = obj;
            await dispatch(setUserDetails(payload));
            router.push('/user/dashboard');
        }
    }

    /**
     * Get total capacity
     * @param {*} obj 
     * @returns value
     */
    const getTotalCapacity = (obj) => {
        if (obj && obj.full_status == 1) {
            return `${obj.total_place} / ${obj.total_place} ${translate(localeJson, 'people')}`;
        } else {
            if (obj.total_person > obj.total_place) {
                return `${obj.total_place} / ${obj.total_place} ${translate(localeJson, 'people')}`
            } else {
                return `${obj.total_person} / ${obj.total_place} ${translate(localeJson, 'people')}`
            }
        }
    }

    /**
     * Action column for dashboard list
     * @param {*} obj 
     * @returns view
     */
    const action = (obj) => {
        return (
            <div>
                <Button buttonProps={{
                    text: obj.active_flg === 1 ? translate(localeJson, 'active') : translate(localeJson, 'inactive'), buttonClass: "text-white w-9",
                    bg: obj.active_flg === 1 ? "bg-red-500" : "bg-grey-500",
                    style: { cursor: "not-allowed" },
                }} />
            </div>
        );
    };

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
                },
                search: ""
            }));
        }
    }

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "event_list_main_header")} />
                        <div className="mt-3">
                            <NormalTable
                                lazy
                                totalRecords={totalCount}
                                loading={tableLoading}
                                stripedRows={true}
                                className={"custom-table-cell"}
                                showGridlines={"true"}
                                value={columns}
                                columns={columnsData}
                                filterDisplay="menu"
                                emptyMessage={translate(localeJson, "data_not_found")}
                                paginator={true}
                                // first={getListPayload.filters.start}
                                // rows={getListPayload.filters.limit}
                                paginatorLeft={true}
                                tableStyle={{ minWidth: "70rem" }}
                            // onPageHandler={(e) => onPaginationChange(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}