import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { NormalTable, DeleteModal } from '@/components';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { AdminDashboardService } from '@/helper/adminDashboardService';
import { dashboardTableColumns } from '@/utils/constant';
import { DashboardServices } from '@/services';

function AdminDashboard() {
    const { localeJson } = useContext(LayoutContext);
    const [lockedCustomers, setLockedCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    /* Services */
    const { getList } = DashboardServices;

    useEffect(() => {
        AdminDashboardService.getAdminDashboardsMedium().then((data) => setAdmins(data));
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
    }, [])

    /**
     * Function will get data & update dashboard list
     * @param {*} data 
    */
    const onGetDashboardList = (response) => {
        if (response.success && !_.isEmpty(response.data) && response.data.total > 0) {
            setList(response.data.list);
            setTotalCount(response.data.total);
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
                            customActionsField="actions"
                            value={admins}
                            frozenValue={lockedCustomers}
                            columns={dashboardTableColumns}
                            filterDisplay="menu"
                            emptyMessage="No customers found."
                            customBody={(rowData, { rowIndex, column }) => (
                                <div className='input-switch-parent'>
                                    <DeleteModal
                                        modalClass="w-50rem"
                                        header="確認情報"
                                        position="top"
                                        content={"避難所の運営状態を変更しますか？"}
                                        checked={false}
                                        parentClass={"custom-switch"}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;