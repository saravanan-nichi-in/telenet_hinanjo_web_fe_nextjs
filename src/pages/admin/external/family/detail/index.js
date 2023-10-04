import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { externalEvacueesDetailColumns } from '@/utils/constant';
import { AdminExternalEvacueeDetailService } from '@/helper/adminExternalEvacueeDetailService';

export default function EvacuationPage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        AdminExternalEvacueeDetailService.getAdminsExternalEvacueeDetailMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div>
                        <h5 className='page-header1'>{translate(localeJson, 'external_evacuee_details')}</h5>
                    </div>
                    <hr />
                    <NormalTable
                        size={"small"}
                        stripedRows={true}
                        rows={10}
                        paginator={"true"}
                        showGridlines={"true"}
                        value={admins}
                        columns={externalEvacueesDetailColumns}
                        paginatorLeft={true}
                        parentClass={"mt-3"}
                    />
                    <div className='mt-3 flex justify-content-center'>
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'return'),
                                onClick: () => router.push('/admin/external/family/list'),
                            }} parentClass={"mb-3"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}