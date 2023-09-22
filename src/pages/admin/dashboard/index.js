import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { DeleteModal, DividerComponent, NormalTable } from '@/components';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import axios from '@/utils/api';
import { AdminDashboardService } from '@/helper/adminDashboardService';

function AdminDashboard() {
    const [checked1, setChecked1] = useState(false);
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const cols = [
        { field: '番号', header: '番号', minWidth: '6rem', headerClassName: "custom-header", sortable: true, textAlign: 'center' },
        { field: '避難所', header: '避難所', minWidth: '20rem', sortable: true, headerClassName: "custom-header" },
        { field: '避難可能人数', header: '避難可能人数', sortable: true, minWidth: '9rem', headerClassName: "custom-header" },
        { field: '現在の避難者数', header: '現在の避難者数', sortable: true, minWidth: '10rem', headerClassName: "custom-header" },
        { field: '避難者数', header: '避難者数', minWidth: '7rem', sortable: true, headerClassName: "custom-header" },
        { field: '避難中の世帯数', header: '避難中の世帯数', minWidth: '10rem', sortable: true, headerClassName: "custom-header" },
        { field: '個人情報なしの避難者数', header: '個人情報なしの避難者数', minWidth: '15rem', sortable: true, headerClassName: "custom-header" },
        { field: '男', header: '男', minWidth: '5rem', sortable: true, headerClassName: "custom-header" },
        // {
        //     field: 'actions',
        //     header: '削除',
        //     minWidth: "7rem",
        //     headerClassName:"custom-header" ,
        //     body: (rowData) => (
        //         <div>
        //             <DeleteModal
        //                 // parentMainClass={"mt-2"}
        //                 style={{ minWidth: "50px" }}
        //                 modalClass="w-50rem"
        //                 header="確認情報"
        //                 position="top"
        //                 content={"避難所の運営状態を変更しますか？"}
        //                 checked={checked1}
        //                 onChange={(e) => setChecked1(e.value)}
        //                 parentClass={"custom-switch"}
        //             />
        //         </div>
        //     ),
        // }
    ];

    useEffect(() => {
        // setProducts(sampleProducts);
        axios.get('/admin/place')
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

        AdminDashboardService.getAdminsDashboardMedium().then((data) => setAdmins(data));
    }, [])


    const rowClass = (data) => {
        return {
            'last-row': data.避難所 === '合計',
            'font-bold': data.避難所 === '合計'
        };
    };

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