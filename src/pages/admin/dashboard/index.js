import React, { useState, useEffect, useContext } from 'react';

import { DeleteModal, DividerComponent, NormalTable } from '@/components';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import axios from '@/utils/api';
import { AdminDashboardService } from '@/helper/adminDashboardService';

function AdminDashboard() {
    const [checked1, setChecked1] = useState(false);
    const { localeJson } = useContext(LayoutContext);
    const [lockedCustomers, setLockedCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const cols = [
        { field: '番号', header: '番号', minWidth: '6rem', headerClassName: "custom-header", sortable: true, textAlign: 'center' },
        { field: '避難所', header: '避難所', minWidth: '20rem', sortable: true, headerClassName: "custom-header" },
        { field: '避難可能人数', header: '避難可能人数', sortable: true, minWidth: '9rem', headerClassName: "custom-header" },
        { field: '現在の避難者数', header: '現在の避難者数', sortable: true, minWidth: '10rem', headerClassName: "custom-header" },
        { field: '避難者数', header: '避難者数', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: '避難中の世帯数', header: '避難中の世帯数', minWidth: '10rem', sortable: true, headerClassName: "custom-header" },
        { field: '個人情報なしの避難者数', header: '個人情報なしの避難者数', minWidth: '15rem', sortable: true, headerClassName: "custom-header" },
        { field: '男', header: '男', minWidth: '4rem', sortable: true, headerClassName: "custom-header" },
        { field: '女', header: '女', minWidth: '4rem', sortable: true, headerClassName: "custom-header" },
        { field: '答えたくない', header: '答えたくない', minWidth: '9rem', sortable: true, headerClassName: "custom-header" },
        { field: '妊産婦', header: '妊産婦', minWidth: '6rem', sortable: true, headerClassName: "custom-header" },
        { field: '乳幼児', header: '乳幼児', minWidth: '6rem', sortable: true, headerClassName: "custom-header" },
        { field: '障がい者', header: '障がい者', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: '要介護者', header: '要介護者', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: '医療機器利用者', header: '医療機器利用者', minWidth: '10rem', sortable: true, headerClassName: "custom-header" },
        { field: 'アレルギー', header: 'アレルギー', minWidth: '8rem', sortable: true, headerClassName: "custom-header" },
        { field: '外国籍', header: '外国籍', minWidth: '6rem', sortable: true, headerClassName: "custom-header" },
        { field: 'その他', header: 'その他', minWidth: '6rem', sortable: true, headerClassName: "custom-header" },
        { field: 'テーブル', header: 'テーブル', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: 's', header: 'S', minWidth: '4rem', sortable: true, headerClassName: "custom-header" },
        { field: '余力人数', header: '余力人数', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: '食糧等支援の人数', header: '食糧等支援の人数', minWidth: '11rem', sortable: true, headerClassName: "custom-header" },

        {
            field: 'actions',
            header: '満員切替',
            minWidth: "7rem",
            headerClassName:"custom-header" ,
            body: (rowData) => (
                <div className='input-switch-dashboard'>
                    <DeleteModal
                        // parentMainClass={"mt-2"}
                        // style={{ minWidth: "50px" }}
                        modalClass="w-50rem"
                        header="確認情報"
                        position="top"
                        content={"避難所の運営状態を変更しますか？"}
                        checked={checked1}
                        onChange={(e) => setChecked1(e.value)}
                        parentClass={"custom-switch"}
                    /> 
                </div>
            ),
        }
    ];
    const rowClass = (data) => {
        return {
            'last-row': data.避難所 === '合計',
            'font-bold': data.避難所 === '合計'
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
                    "避難所":'合計',
                   "避難可能人数": '66920人',
                    "現在の避難者数": '2134人',
                    "避難者数": '15.77%',
                    "避難中の世帯数": '450世帯'	,
                    "個人情報なしの避難者数":'1555人',
                    "男":'160人',
                    '女':'371人',
                    '答えたくない':'48人',
                    '妊産婦':'248人',
                    '乳幼児':'173人',
                    '障がい者':'86人',
                    '要介護者':'39人',
                    '医療機器利用者':'38人',
                    'アレルギー':'26人',
                    '外国籍':'36人',
                    'その他':'35人',
                    'テーブル':'71人',
                    's':'0人',
                    '余力人数':'64786人',
                    '食糧等支援の人数':'0人',
                    '満員切替':''
    
                }
            ]);
    }, [])

    return (
        <div className="grid">
            <div className="col-12">

                {/* Header */}

                <div className='card'>
                    <div>
                        <h5>
                            {translate(localeJson, 'evacuation_status_list')}
                        </h5>
                    </div>
                    <hr />
                    <div className='mt-3'>
                        <NormalTable
                            rowClassName={rowClass}
                            size={"small"}
                            stripedRows={true}
                            rows={10}
                            paginator={"true"}
                            showGridlines={"true"}
                            // columnStyle={{ textAlign: 'center',color:"#3c4b64" }}
                            customActionsField="actions"
                            value={admins}
                            frozenValue={lockedCustomers}
                            columns={cols}
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