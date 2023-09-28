import React, { useState, useEffect, useContext } from 'react';

import { NormalTable } from '@/components';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import axios from '@/utils/api';
import { AdminDashboardService } from '@/helper/adminDashboardService';
import { dashboardTableColumns } from '@/utils/constant';

/**
 * Shelter user status List
 * @returns Table View 
 */

function AdminDashboard() {
    const [checked1, setChecked1] = useState(false);
    const { localeJson } = useContext(LayoutContext);
    const [lockedCustomers, setLockedCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);

    const rowClass = (data) => {
        return {
            'last-row': data.避難所 === translate(localeJson, 'total'),
            'font-bold': data.避難所 === translate(localeJson, 'total')
        };
    };

    useEffect(() => {
        axios.get('/admin/place')
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

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
                '満員切替': ''

            }
        ]);
    }, [])

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div>
                        <h5>
                            {translate(localeJson, 'evacuation_status_list')}
                        </h5>
                    </div>
                    <hr />
                    <div className='mt-3 '>
                        <NormalTable
                            rowClassName={rowClass}
                            size={"small"}
                            stripedRows={true}
                            rows={10}
                            className={"custom-table-cell"}
                            paginator={"true"}
                            showGridlines={"true"}
                            customActionsField="actions"
                            value={admins}
                            frozenValue={lockedCustomers}
                            columns={dashboardTableColumns}
                            filterDisplay="menu"
                            emptyMessage="No customers found."
                            paginatorLeft={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;