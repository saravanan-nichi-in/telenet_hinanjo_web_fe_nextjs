import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { NormalTable, DeleteModal } from '@/components';
import { getValueByKeyRecursively as translate, getTotalCountFromArray, getAveragePercentage } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { AdminDashboardService } from '@/helper/adminDashboardService';
// import { dashboardTableColumns } from '@/utils/constant';
import { DashboardServices } from '@/services';

function AdminDashboard() {
    const { localeJson } = useContext(LayoutContext);
    const [lockedCustomers, setLockedCustomers] = useState([]);
    const [frozenArray, setFrozenArray] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const dashboardTableColumns = [
        { field: 'number', header: translate(localeJson, 'number'), minWidth: '5rem', headerClassName: "custom-header", sortable: true, textAlign: 'left' },
        { field: 'evacuation_place', header: translate(localeJson, 'evacuation_place'), minWidth: '15rem', sortable: true, headerClassName: "custom-header" },
        { field: 'max_capacity', header: translate(localeJson, 'max_capacity'), sortable: true, minWidth: '10rem', headerClassName: "custom-header" },
        { field: 'number_of_evacuees', header: translate(localeJson, 'number_of_evacuees'), sortable: true, minWidth: '10rem', headerClassName: "custom-header" },
        { field: 'accommodation_rate', header: translate(localeJson, 'accommodation_rate'), minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: 'household', header: translate(localeJson, 'household'), minWidth: '10rem', sortable: true, headerClassName: "custom-header" },
        { field: 'number_of_people_count_only', header: translate(localeJson, 'number_of_people_count_only'), minWidth: '15rem', sortable: true, headerClassName: "custom-header" },
        { field: 'male', header: translate(localeJson, 'male'), minWidth: '5rem', sortable: true, headerClassName: "custom-header" },
        { field: 'female', header: translate(localeJson, 'female'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'center', sortable: true },
        { field: 'others_count', header: translate(localeJson, 'others_count'), minWidth: "10rem", headerClassName: "custom-header", textAlign: 'center', sortable: true },
        { field: 'remaining_number_people', header: translate(localeJson, 'remaining_number_people'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'center', sortable: true },
        { field: 'food_assistance', header: translate(localeJson, 'food_assistance'), minWidth: "12rem", headerClassName: "custom-header", textAlign: 'center', sortable: true },
        { field: 'switch_to_full', header: translate(localeJson, 'switch_to_full'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'center', sortable: true },
    ];

    /* Services */
    const { getList } = DashboardServices;

    useEffect(() => {
        setLockedCustomers([
            {
                "番号": '',
                "避難所": '合計',
                "避難可能人数": '66920人',
                "現在の避難者数": '2134人',
                "避難者数": '15.77%',
                "避難中の世帯数": '450世帯',
                "個人情報なしの避難者数": '1555人',
                "男": '160人',
                '女': '371人',
                '答えたくない': '48人',
                '妊産婦': '248人',
                '乳幼児': '173人',
                '障がい者': '86人',
                '要介護者': '39人',
                '医療機器利用者': '38人',
                'アレルギー': '26人',
                '外国籍': '36人',
                'その他': '35人',
                'テーブル': '71人',
                's': '0人',
                '余力人数': '64786人',
                '食糧等支援の人数': '0人',
                '満員切替': null
            }
        ]);

        let getListPayload = {
            filters: {
                start: 0,
                limit: 50,
                sort_by: "",
                order_by: "desc",
            },
            search: "",
        }

        // Get dashboard list
        getList(getListPayload, onGetDashboardList);
    }, []);

    /**
     * Function will get data & update dashboard list
     * @param {*} data 
    */
    const onGetDashboardList = (response) => {
        var preparedList = [];
        var locale = localStorage.getItem("locale");
        if (response.success && !_.isEmpty(response.data) && response.data.total > 0) {
            // Preparing row data for specific column to display
            const data = response.data.list;
            data.map((obj, i) => {
                let preparedObj = {
                    number: i,
                    evacuation_place: locale == "ja" ? obj.name : obj.name_en,
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
                preparedList.push(preparedObj);
            })

            // Update frozen array
            var frozenArray = [{
                number: "",
                evacuation_place: '合計',
                max_capacity: `${getTotalCountFromArray(preparedList, "max_capacity", 1)}${translate(localeJson, 'people')}`,
                number_of_evacuees: `${getTotalCountFromArray(preparedList, "number_of_evacuees", 1)}${translate(localeJson, 'people')}`,
                accommodation_rate: getAveragePercentage(preparedList, "accommodation_rate"),
                household: `${getTotalCountFromArray(preparedList, "household", 2)}${translate(localeJson, 'household_title')}`,
                number_of_people_count_only: `${getTotalCountFromArray(preparedList, "number_of_people_count_only", 1)}${translate(localeJson, 'people')}`,
                male: `${getTotalCountFromArray(preparedList, "male", 1)}${translate(localeJson, 'people')}`,
                female: `${getTotalCountFromArray(preparedList, "female", 1)}${translate(localeJson, 'people')}`,
                others_count: `${getTotalCountFromArray(preparedList, "others_count", 1)}${translate(localeJson, 'people')}`,
                remaining_number_people: `${getTotalCountFromArray(preparedList, "remaining_number_people", 1)}${translate(localeJson, 'people')}`,
                food_assistance: `${getTotalCountFromArray(preparedList, "food_assistance", 1)}${translate(localeJson, 'people')}`,
                switch_to_full: "",
            }];

            // Update prepared list to the state
            setFrozenArray(frozenArray);
            setList(preparedList);
            setTotalCount(response.data.total);
        }
        console.log(preparedList);
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
                    modalClass="w-50rem"
                    header="確認情報"
                    position="top"
                    content={"避難所の運営状態を変更しますか？"}
                    checked={obj.full_status == 1 ? true : false}
                    parentClass={"custom-switch"}
                />
            </div>
        );
    };

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
                            columns={dashboardTableColumns}
                            filterDisplay="menu"
                            emptyMessage="No customers found."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;