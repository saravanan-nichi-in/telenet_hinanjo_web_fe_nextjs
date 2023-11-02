import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, NormalTable } from "@/components";
import { UserPlaceListServices } from '@/services';
import { useAppDispatch } from '@/redux/hooks';
import { setUserDetails } from '@/redux/layout';

export default function PublicEvacuees() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const columnsData = [
        { field: 'number', header: translate(localeJson, 's_no'), headerClassName: "custom-header", className: "sno_class", textAlign: 'left' },
        { field: 'name', header: translate(localeJson, 'place_name_list'), headerClassName: "custom-header", minWidth: "15rem", maxWidth: "15rem", textAlign: 'left' },
        { field: 'address_place', header: translate(localeJson, 'address_public_evacuees'), headerClassName: "custom-header", textAlign: 'left' },
        { field: 'total_capacity', header: translate(localeJson, 'place_capacity'), headerClassName: "custom-header", minWidth: "6rem", textAlign: 'left' },
        { field: 'percent', header: translate(localeJson, 'percent'), headerClassName: "custom-header", minWidth: "6rem", textAlign: 'left' },
        { field: 'status', header: translate(localeJson, 'status_public_evacuees'), headerClassName: "custom-header", className: "action_class", textAlign: 'center', }
    ];
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 5,
            sort_by: "",
            order_by: "desc",
        },
        search: "",
    });
    const [tableLoading, setTableLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

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
        let pageStart = Math.floor(getListPayload.filters.start / getListPayload.filters.limit) + 1;
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
        var additionalColumnsKeys = [];
        var additionalColumnsArrayWithOldData = [...columnsData];
        var preparedList = [];
        if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
            console.log(response);
            const data = response.data.model.list;
            // Preparing row data for specific column to display
            if (data.length > 0) {
                data.map((obj, i) => {
                    let preparedObj = {
                        number: getListPayload.filters.start + i + 1,
                        name: <div className={obj.active_flg === 1 ? "text-higlight clickable-row" : ""} onClick={() => onClickPlaceName(obj)}>{locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name}</div>,
                        address_place: obj.address_place,
                        total_capacity: getTotalCapacity(obj),
                        percent: obj.full_status == 1 ? "100%" : obj.percent > 100 ? "100%" : `${obj.percent}%`,
                        status: action(obj),
                    }
                    preparedList.push(preparedObj);
                })
            }
            // Update prepared list to the state
            setColumns(additionalColumnsArrayWithOldData);
            setList(preparedList);
            setTotalCount(response.data.model.total);
        }
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
                        <h5 className="page-header1">{translate(localeJson, "evacuation_center_management_system_list")}</h5>
                        <hr />
                        <div className="mt-3">
                            <NormalTable
                                lazy
                                totalRecords={totalCount}
                                loading={tableLoading}
                                stripedRows={true}
                                className={"custom-table-cell"}
                                showGridlines={"true"}
                                value={list}
                                columns={columns}
                                filterDisplay="menu"
                                emptyMessage={translate(localeJson, "data_not_found")}
                                paginator={true}
                                first={getListPayload.filters.start}
                                rows={getListPayload.filters.limit}
                                paginatorLeft={true}
                                onPageHandler={(e) => onPaginationChange(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
