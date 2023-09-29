import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable, RowExpansionTable } from '@/components';
import { evacueeFamilyDetailColumns, familyDetailColumns, familyDetailData, evacueeFamilyDetailRowExpansionColumns, familyDetailData1, familyDetailColumns1, townAssociationData, townAssociationColumn } from '@/utils/constant';
import { AdminEvacueeFamilyDetailService } from '@/helper/adminEvacueeFamilyDetailService';

export default function EvacueeFamilyDetail() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();

    useEffect(() => {
        AdminEvacueeFamilyDetailService.getEvacueeFamilyDetailWithOrdersSmall().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'house_hold_information_details')}</h5>
                    <hr />
                    <div className='mb-2'>
                        <div className='flex justify-content-end' style={{ textDecoration: "underline" }}>
                            {translate(localeJson, 'household_number')} 001-001
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
                        parentClass="mb-2"
                    />
                    <div className='mb-2'>
                        <h5 className='page-header2'>{translate(localeJson, 'household_list')}</h5>
                    </div>
                    <RowExpansionTable
                        rows={10}
                        paginatorLeft={true}
                        paginator="true"
                        customRowExpansionActionsField="actions"
                        value={admins}
                        innerColumn={evacueeFamilyDetailRowExpansionColumns}
                        outerColumn={evacueeFamilyDetailColumns}
                        rowExpansionField="orders"
                    />
                    <div className='mt-2 flex justify-content-center overflow-x-auto'>
                        <NormalTable
                            id="evacuee-family-detail"
                            size={"small"}
                            stripedRows={true}
                            paginator={false}
                            showGridlines={true}
                            tableStyle={{ maxWidth: "10rem" }}
                            value={townAssociationData}
                            columns={townAssociationColumn}
                        />
                    </div>
                    <div className='mt-2 flex justify-content-center overflow-x-auto'>
                        <NormalTable
                            id="evacuee-family-detail"
                            size={"small"}
                            stripedRows={true}
                            paginator={false}
                            showGridlines={true}
                            tableStyle={{ maxWidth: "20rem" }}
                            value={familyDetailData1}
                            columns={familyDetailColumns1}
                        />
                    </div>
                    <div className="text-center mt-2">
                        <Button buttonProps={{
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'return'),
                            onClick: () => router.push('/admin/evacuation/'),
                        }} parentClass={"inline"} />
                    </div>
                </div>
            </div>
        </div>
    )
}