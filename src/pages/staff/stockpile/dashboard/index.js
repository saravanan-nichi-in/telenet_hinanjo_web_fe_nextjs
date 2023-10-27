import React, { useContext, useEffect, useState } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, NormalTable } from '@/components';
import { StaffStockpileDashboardService } from '@/helper/staffStockpileDashboardService';
import { AiFillEye } from 'react-icons/ai';
import { useRouter } from 'next/router';

function StockpileDashboard() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [staffStockpileDashboardValues, setStaffStockpileDashboardValues] = useState([]);

    const staffStockpileDashboard = [
        { field: 'id', header: translate(localeJson, 's_no'), className: "sno_class" },
        { field: 'product_type', header: translate(localeJson, 'product_type'), sortable: true, minWidth: "5rem" },
        { field: 'product_name', header: translate(localeJson, 'product_name'), minWidth: "7rem" },
        { field: 'quantity', header: translate(localeJson, 'quantity'), minWidth: "5rem" },
        { field: 'inventory_date', header: translate(localeJson, 'inventory_date'), minWidth: "7rem" },
        { field: 'confirmer', header: translate(localeJson, 'confirmer'), minWidth: "5rem" },
        { field: 'expiry_date', header: translate(localeJson, 'expiry_date'), minWidth: "7rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), minWidth: "5rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'image'),
            textAlign: "center",
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <AiFillEye style={{ fontSize: '20px' }} />
                </div>
            ),
        },
        {
            field: 'actions',
            header: translate(localeJson, 'edit'),
            textAlign: "center",
            minWidth: "7rem",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'edit'),
                        buttonClass: "text-primary ",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                    }} />
                </div>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        StaffStockpileDashboardService.getStaffStockpileDashboardMedium().then((data) => setStaffStockpileDashboardValues(data));
        fetchData();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'stockpile_list')}</h5>
                    <hr />
                    <div>
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'stockpile_history'),
                                severity: "primary",
                                onClick: () => router.push("/staff/stockpile/history?hinan=1")
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'import'),
                                severity: "primary",
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'export'),
                                severity: "primary",
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'add_stockpile'),
                                severity: "success"
                            }} parentClass={"mr-1 mt-1"} />
                        </div>
                        <div className="mt-3">
                            <NormalTable
                                customActionsField="actions"
                                value={staffStockpileDashboardValues}
                                columns={staffStockpileDashboard}
                                showGridlines={"true"}
                                stripedRows={true}
                                paginator={"true"}
                                columnStyle={{ textAlign: "center" }}
                                className={"custom-table-cell"}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                paginatorLeft={true}
                            />
                        </div>
                        <div className="text-center mt-3">
                            <Button buttonProps={{
                                buttonClass: "w-8rem",
                                severity: "primary",
                                text: translate(localeJson, 'back_to_top'),
                                onClick: () => router.push('/staff/dashboard'),
                            }} parentClass={"inline"} />
                            <Button buttonProps={{
                                buttonClass: "text-600 w-8rem",
                                type: "button",
                                bg: "bg-white",
                                hoverBg: "hover:surface-500 hover:text-white",
                                text: translate(localeJson, 'inventory'),
                            }} parentClass={"inline pl-2"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default StockpileDashboard;