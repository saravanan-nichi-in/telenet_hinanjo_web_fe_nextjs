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

        AdminDashboardService.getAdminsDashboardMedium().then((data) => setAdmins(data));
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
                    <div className='mt-3'>
                        <NormalTable
                            rowClassName={rowClass}
                            size={"small"}
                            stripedRows={true}
                            rows={10}
                            paginator={"true"}
                            showGridlines={"true"}
                            customActionsField="actions"
                            value={admins}
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