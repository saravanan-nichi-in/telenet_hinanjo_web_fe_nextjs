import React, { useState, useContext, useEffect } from 'react';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { NormalTable, RowExpansionTable } from '@/components';
import { evacueeFamilyDetailColumns, familyDetailColumns, familyDetailData } from '@/utils/constant';
import { AdminEvacueeFamilyDetailService } from '@/helper/adminEvacueeFamilyDetailService';

export default function EvacueeFamilyDetail() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        AdminEvacueeFamilyDetailService.getAdminsEvacueeFamilyDetailMedium().then((data) => setAdmins(data));
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
                        id="evacuee-family-detail"
                        size={"small"}
                        rows={10}
                        rowExpansionColumnStyle={{ textAlign: 'center' }}
                        columnStyle={{ textAlign: 'center' }}
                        paginator={true}
                        showGridlines={true}
                        customRowExpansionActionsField="actions"
                        value={admins}
                        outerColumn={evacueeFamilyDetailColumns}
                        rowExpansionField="orders"
                        emptyMessage="No Data found."
                        rowExpansionTemplate={rowExpansionTemplates}
                        paginatorLeft={true}
                        expander={true}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        expandAllButtonProps={false}
                    />
                </div>
            </div>
        </div>
    )
}