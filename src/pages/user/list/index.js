import React, { useState, useEffect, useContext } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { PublicEvacueesService } from "@/helper/publicEvacueesService";
import { Button, NormalTable } from "@/components";

export default function PublicEvacuees() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [tableLoading, setTableLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const columns = [
        { field: 'id', header:translate(localeJson,'s_no'),className: "sno_class"},
        { field: 'name', header:translate(localeJson,'place_name_list'), minWidth: "15rem" },
        { field: 'address_place', header:translate(localeJson,'address_public_evacuees') },
        { field: 'total_capacity', header:translate(localeJson,'place_capacity') },
        { field: 'percent', header:translate(localeJson,'percent') },
        {
            field: 'full_status',
            header: translate(localeJson,'status_public_evacuees'),
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text:rowData.full_status === 1 ? translate(localeJson,'active') : translate(localeJson,'inactive'), buttonClass: "text-white w-9",
                        bg: rowData.full_status === 1 ? "bg-red-500" : "bg-grey-500",
                        style: { cursor: "not-allowed" },
                    }} />
                </div>
            ),
        }
    ];

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            setLoader(false);
        };
        PublicEvacueesService.getPublicEvacueesListMedium().then((data) => setCustomers(data));
        fetchData();
    }, []);
    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5 className="page-header1">{translate(localeJson, "evacuation_center_management_system_list")}</h5>
                        <hr />
                        <div>
                            <div className="mt-3">
                                <NormalTable
                                    customActionsField="actions" 
                                    value={customers} columns={columns}
                                    // loading={tableLoading}
                                    showGridlines={"true"}
                                    stripedRows={true}
                                    paginator={"true"}
                                    columnStyle={{ textAlign: "center" }}
                                    className={"custom-table-cell"}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginatorLeft={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
