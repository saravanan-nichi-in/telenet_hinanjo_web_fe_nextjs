import React, { useState, useContext, useEffect } from 'react';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NormalTable, RowExpansionTable } from '@/components';
import { evacueeFamilyDetailColumns, familyDetailColumns, familyDetailData, familyDetailRowExpansionColumns } from '@/utils/constant';
import { AdminEvacueeFamilyDetailService } from '@/helper/adminEvacueeFamilyDetailService';
import { StockpileSummaryService } from '@/helper/adminStockpileSummaryService';


export default function EvacueeFamilyDetail() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    // const [stockpileSummary, setStockpileSummary] = useState([]);
    const outerColumn = [
        { field: "id", header: "番号", minWidth: "10rem", textAlign: 'center' },
        { field: "代表者", header: "代表者", minWidth: "10rem" },
        { field: "氏名 (フリガナ)", header: "氏名 (フリガナ)", minWidth: "10rem" },
        { field: "氏名 (漢字)", header: "氏名 (フリガナ)", minWidth: "10rem" },
        { field: "生年月日", header: "生年月日", minWidth: "10rem" },
        { field: "年齢", header: "年齢", minWidth: "10rem" },
        { field: "年齢_月", header: "年齢_月", minWidth: "10rem" },
        { field: "性別", header: "性別", minWidth: "10rem" },
        { field: "性別", header: "性別", minWidth: "10rem" },
        { field: "作成日", header: "作成日", minWidth: "10rem" },
        { field: "更新日", header: "更新日", minWidth: "10rem" }

    ]

    const innerColumn = [
        { field: "住所", header: "種別", minWidth: "10rem" },
        { field: "要配慮者番号", header: "要配慮者番号", minWidth: "5rem" },
        { field: "紐付コード", header: "紐付コード" },
        { field: "備考", header: "紐付コード" },
        { field: "現在の滞在場所 *", header: "現在の滞在場所 *" },


    ]
    useEffect(() => {
        AdminEvacueeFamilyDetailService.getEvacueeFamilyDetailWithOrdersSmall().then((data) => setAdmins(data));
    }, []);

    const rowExpansionTemplates = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for Data</h5>
            </div>
        );
    }

    const setExpandedRows = (data) => {
        console.log("Data", data);
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page_header'>{translate(localeJson, 'house_hold_information_details')}</h5>
                    <hr />
                    <div>
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>

                                </div>
                            </form>
                        </div>
                    </div>
                    <NormalTable
                        id="evacuee-family-detail"
                        size={"small"}
                        stripedRows={true}
                        paginator={false}
                        showGridlines={true}
                        value={familyDetailData}
                        columns={familyDetailColumns}
                        parentClass="pb-2"
                    />
                    <div className='pb-2'>
                        <h5>{translate(localeJson, 'household_list')}</h5>
                    </div>
                    <RowExpansionTable
                        rows={10}
                        paginatorLeft={true}
                        paginator="true"
                        customRowExpansionActionsField="actions"
                        value={admins}
                        innerColumn={innerColumn}
                        outerColumn={outerColumn}
                        rowExpansionField="orders"
                    />
                </div>
            </div>
        </div>
    )
}