import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { AdminQuestionarieService } from '@/helper/adminQuestionarieService';
import { Button, NormalTable } from '@/components';

export default function Questionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const cols = [
        { field: 'Name', header: translate(localeJson, 'questionnaire_name'), minWidth: '11rem', headerClassName: "custom-header" },
        { field: 'Description', header: translate(localeJson, 'questionnaire_description'), minWidth: '11rem', headerClassName: "custom-header" },
        {
            field: 'actions',
            header: translate(localeJson, 'action'),
            body: (rowData) => (

                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'details'),
                        buttonClass: "text-primary",
                        bg: "bg-white",
                        onClick: () => {
                            if (rowData.Name === 'Master questionaries') {
                                router.push('/admin/questionnaire/master')
                                // Add your code to handle the condition when '氏名' exists in rowData
                            }
                            else {
                                router.push('/admin/questionnaire/individual')
                            }
                        },
                        // onClick: () => {
                        // if (rowData.Name === 'master questionaries') {
                        // }}
                        hoverBg: "hover:bg-primary hover:text-white",

                    }} />
                </div>
            ),
        }

    ]
    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        AdminQuestionarieService.getAdminsQuestionarieMedium().then((data) => setAdmins(data));
        fetchData();
    }, []);

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'questionnaire')}</h5>
                        <hr />
                        <div>
                            <NormalTable showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={cols} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}