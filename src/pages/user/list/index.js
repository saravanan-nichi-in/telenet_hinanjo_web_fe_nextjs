import React, { useState, useEffect, useContext } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

export default function PublicEvacuees() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            setLoader(false);
        };
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
                            {/* <div className="mt-3">
                                <NormalTable
                                    lazy
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    showGridlines={"true"}
                                    paginator={"true"}
                                    columnStyle={{ textAlign: "center" }}
                                    className={"custom-table-cell"}
                                    value={list}
                                    columns={columns}
                                    cellClassName={cellClassName}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    isDataSelectable={isCellSelectable}
                                    first={getPayload.filters.start}
                                    rows={getPayload.filters.limit}
                                    paginatorLeft={true}
                                    onPageHandler={(e) => onPaginationChange(e)}
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
