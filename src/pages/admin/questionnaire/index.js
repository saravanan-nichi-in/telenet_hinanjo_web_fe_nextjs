import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
// import { QuestionnairesView } from '@/components/dragNdrop'
import { AdminQuestionarieService } from '@/helper/adminQuestionarieService';
import { Button, NormalTable } from '@/components';

export default function Questionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    // const [questionnaires, setQuestionnaires] = useState([]);
    const router = useRouter();
    const cols = [
        { field: 'Name', header: 'Name', minWidth: '11rem', headerClassName: "custom-header" },
        { field: 'Description', header: 'Description', minWidth: '11rem', headerClassName: "custom-header" },
        {
            field: 'actions',
            header: "details",
            body: (rowData) => (

                <div>
                    <Button buttonProps={{
                        text: "detail", buttonClass: "text-primary",
                        bg: "bg-white",
                        onClick: () => {
                            if (rowData.Name === 'Master questionaries') {
                                router.push('/admin/questionnaire/master')
                                // Add your code to handle the condition when '氏名' exists in rowData
                            }
                            else{
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
        // }, {
        //     field: 'actions',
        //     header: "TemplateChange",
        //     textAlign: "center",
        //     body: (rowData) => (
        //         <div>
        //             <Button buttonProps={{
        //                 text: "Template_Change", buttonClass: "text-primary",
        //                 bg: "bg-red-600 text-white",
        //                 hoverBg: "hover:bg-red-500 hover:text-white",
        //             }} />
        //         </div>
        //     ),
        // },

    ]
    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        AdminQuestionarieService.getAdminsQuestionarieMedium().then((data) => setAdmins(data));
        // let prepareData = [];
        // for (let i = 1, len = 7; i < len; i++) {
        //     prepareData.push({
        //         title: `Rows${i}`
        //     });
        // }
        // setQuestionnaires(prepareData);
        fetchData();
    }, []);

    // const handleOnDrag = (event) => {
    //     setQuestionnaires(event.value);
    // }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'questionnaire')}</h5>
                        <hr />
                        <div>
                            <NormalTable showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={cols} />
                            {/* <QuestionnairesView
                                questionnaires={questionnaires}
                                handleOnDrag={handleOnDrag}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
