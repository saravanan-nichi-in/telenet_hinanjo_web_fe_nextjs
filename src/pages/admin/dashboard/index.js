import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { NormalTable, DeleteModal } from '@/components';
import { getValueByKeyRecursively as translate, getTotalCountFromArray, getAveragePercentage } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { DashboardServices } from '@/services';

function AdminDashboard() {
    const { locale, localeJson } = useContext(LayoutContext);
    const [frozenArray, setFrozenArray] = useState([]);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 5,
            sort_by: "",
            order_by: "desc",
        },
        search: "",
    });
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [columns, setColumns] = useState(
        [
            { field: 'number', header: translate(localeJson, 'number'), minWidth: '5rem', headerClassName: "custom-header", textAlign: 'left' },
            { field: 'evacuation_place', header: translate(localeJson, 'evacuation_place'), minWidth: '15rem', headerClassName: "custom-header" },
            { field: 'max_capacity', header: translate(localeJson, 'max_capacity'), minWidth: '10rem', headerClassName: "custom-header" },
            { field: 'number_of_evacuees', header: translate(localeJson, 'number_of_evacuees'), minWidth: '10rem', headerClassName: "custom-header",fontWeight:"bold" },
            { field: 'accommodation_rate', header: translate(localeJson, 'accommodation_rate'), minWidth: '7rem', headerClassName: "custom-header" },
            { field: 'household', header: translate(localeJson, 'household'), minWidth: '10rem', headerClassName: "custom-header" },
            { field: 'number_of_people_count_only', header: translate(localeJson, 'number_of_people_count_only'), minWidth: '15rem', headerClassName: "custom-header" },
            { field: 'male', header: translate(localeJson, 'male'), minWidth: '5rem', headerClassName: "custom-header" },
            { field: 'female', header: translate(localeJson, 'female'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'left'},
            { field: 'others_count', header: translate(localeJson, 'others_count'), minWidth: "10rem", headerClassName: "custom-header", textAlign: 'left'},
            { field: 'remaining_number_people', header: translate(localeJson, 'remaining_number_people'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'left'},
            { field: 'food_assistance', header: translate(localeJson, 'food_assistance'), minWidth: "12rem", headerClassName: "custom-header", textAlign: 'left'},
            { field: 'switch_to_full', header: translate(localeJson, 'switch_to_full'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'center'},
        ]);

    /* Services */
    const { getList, updateFullStatus } = DashboardServices;

    useEffect(() => {
        onGetDashboardListOnMounting();
    }, [locale]);

    /**
     * Get dashboard list on mounting
     */
    const onGetDashboardListOnMounting = () => {
        // Get dashboard list
        getList(getListPayload, onGetDashboardList);
    }

    /**
     * Function will get data & update dashboard list
     * @param {*} data 
    */
    const onGetDashboardList = (response) => {
        var preparedList = [];
        var additionalColumnsKeys = [];
        var additionalColumnsArrayWithOldData = [...columns];
        var insertIndex = 10;
        var trimPeopleLength = locale == "ja" ? 1 : 6;
        var trimHouseholdLength = locale == "ja" ? 2 : 9;
        if (response.success && !_.isEmpty(response.data) && response.data.total > 0) {
            const data = response.data.list;
            const dataOfFirstObj = response.data.list[0].specialCare
            // Prepare table dynamic columns
            if (dataOfFirstObj) {
                dataOfFirstObj.map((obj, i) => {
                    let preparedColumnObjToMerge = { field: obj.name_en, header: locale == "ja" ? obj.name : obj.name_en, minWidth: "7rem", headerClassName: "custom-header", textAlign: 'left'};
                    additionalColumnsKeys.push(preparedColumnObjToMerge.field);
                    additionalColumnsArrayWithOldData.splice(insertIndex + i, 0, preparedColumnObjToMerge);
                })
            }
            // Preparing row data for specific column to display
            data.map((obj, i) => {
                let preparedObj = {
                    number: i + 1,
                    evacuation_place:  locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name,
                    max_capacity: `${obj.total_place}${translate(localeJson, 'people')}`,
                    number_of_evacuees: `${obj.totalPerson + obj.countPerson}${translate(localeJson, 'people')}`,
                    accommodation_rate: obj.full_status == 1 ? "100%" : obj.rateSheltered >= 100 ? "100%" : `${obj.rateSheltered}%`,
                    household: `${obj.countFamily}${translate(localeJson, 'household_title')}`,
                    number_of_people_count_only: `${obj.countPerson}${translate(localeJson, 'people')}`,
                    male: `${obj.countMale}${translate(localeJson, 'people')}`,
                    female: `${obj.countFemale}${translate(localeJson, 'people')}`,
                    others_count: `${obj.countOthers}${translate(localeJson, 'people')}`,
                    remaining_number_people: obj.full_status == 1 ? `0${translate(localeJson, 'people')}` : `${obj.rateSheltered}${translate(localeJson, 'people')}`,
                    food_assistance: `${obj.foodRequiredCount}${translate(localeJson, 'people')}`,
                    switch_to_full: action(obj),
                }
                dataOfFirstObj.map((obj, i) => {
                    preparedObj[obj.name_en] = `${obj.count}${translate(localeJson, 'people')}`;
                })
                preparedList.push(preparedObj);
            })
            // Update frozen data
            var frozenObj = {
                number: "",
                evacuation_place: translate(localeJson, 'total'),
                max_capacity: `${getTotalCountFromArray(preparedList, "max_capacity", trimPeopleLength)}${translate(localeJson, 'people')}`,
                number_of_evacuees: `${getTotalCountFromArray(preparedList, "number_of_evacuees", trimPeopleLength)}${translate(localeJson, 'people')}`,
                accommodation_rate: getAveragePercentage(preparedList, "accommodation_rate"),
                household: `${getTotalCountFromArray(preparedList, "household", trimHouseholdLength)}${translate(localeJson, 'household_title')}`,
                number_of_people_count_only: `${getTotalCountFromArray(preparedList, "number_of_people_count_only", trimPeopleLength)}${translate(localeJson, 'people')}`,
                male: `${getTotalCountFromArray(preparedList, "male", trimPeopleLength)}${translate(localeJson, 'people')}`,
                female: `${getTotalCountFromArray(preparedList, "female", trimPeopleLength)}${translate(localeJson, 'people')}`,
                others_count: `${getTotalCountFromArray(preparedList, "others_count", trimPeopleLength)}${translate(localeJson, 'people')}`,
                remaining_number_people: `${getTotalCountFromArray(preparedList, "remaining_number_people", trimPeopleLength)}${translate(localeJson, 'people')}`,
                food_assistance: `${getTotalCountFromArray(preparedList, "food_assistance", trimPeopleLength)}${translate(localeJson, 'people')}`,
                switch_to_full: "",
            };
            additionalColumnsKeys.map((obj, i) => {
                frozenObj[obj] = `${getTotalCountFromArray(preparedList, obj, trimPeopleLength)}${translate(localeJson, 'people')}`
            })
            // Update prepared list to the state
            setColumns(additionalColumnsArrayWithOldData);
            setFrozenArray([frozenObj]);
            setList([...preparedList]);
            setTotalCount(response.data.total);
        }
    };

    /**
     * Action column for dashboard list
     * @param {*} obj 
     * @returns 
     */
    const action = (obj) => {
        return (
            <div className='input-switch-parent'>
                <DeleteModal
                    header={translate(localeJson, 'confirmation_information')}
                    content={translate(localeJson, 'change_active_place')}
                    data={obj}
                    checked={obj.full_status == 1 ? true : false}
                    parentClass={"custom-switch"}
                    cancelButton={true}
                    updateButton={true}
                    updateCalBackFunction={(rowDataReceived) => getDataFromupdateButtonOnClick(rowDataReceived)}
                />
            </div>
        );
    };

    /**
     * Update full status by row id
     * @param {*} rowDataReceived 
     */
    const getDataFromupdateButtonOnClick = (rowDataReceived) => {
        if (rowDataReceived) {
            let updateFullStatusPayload = {
                id: rowDataReceived.id
            }
            updateFullStatus(updateFullStatusPayload, onGetDashboardListOnMounting);
        }
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div className=''>
                        <h5 className='page-header1'>  {translate(localeJson, 'evacuation_status_list')}</h5>
                    </div>
                    <hr />
                    <div className='mt-3 '>
                        <NormalTable
                            stripedRows={true}
                            className={"custom-table-cell"}
                            showGridlines={"true"}
                            value={list}
                            frozenValue={_.size(list) > 0 && frozenArray}
                            columns={columns}
                            filterDisplay="menu"
                            emptyMessage="No data found."
                            paginator={true}
                            rows={5}
                            paginatorLeft={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;