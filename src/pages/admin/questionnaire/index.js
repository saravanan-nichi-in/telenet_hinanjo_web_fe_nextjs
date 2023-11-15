import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { AdminQuestionarieService } from '@/helper/adminQuestionarieService';
import { Button, NormalTable, RowExpansionTable } from '@/components';
import { DeleteModal, QuestionnairesCreateEditModal } from '@/components/modal';

export default function Questionnaire() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);

    const cols = [
        { field: "id", header: translate(localeJson, 'number'), headerClassName: "custom-header" ,className: "sno_class", textAlign: "center" },
        { field: 'Name', header: translate(localeJson, 'questionnaire_name'), minWidth: '11rem', maxWidth: "11rem", headerClassName: "custom-header" },
        { field: 'Description', header: translate(localeJson, 'remarks'), minWidth: '18rem', maxWidth: '18rem', headerClassName: "custom-header" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            className: "action_class",
            body: (rowData) => (
                <div>
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "text-primary",
                            bg: "bg-white",
                            hoverBg: "hover:bg-primary hover:text-white",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                setSpecialCareEditOpen(true)
                            }
                        }} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "ml-2 delete-button",
                        }} parentClass={"delete-button"} />

                </div>
            ),

        }, {

            field: "status",
            minWidth: "3.5rem",
            maxWidth: "3.5rem",
            header: translate(localeJson, "status"),
            body: (rowData) => {
                return action(rowData);
            },
        }
    ]

    const innerColumn = [
        {
            field: "Name", header: translate(localeJson, 'name'), body: (rowData) => {
                if (rowData.Name === 'Master questionnaires') {
                    return translate(localeJson, 'master_questionnaire');
                } else {
                    // Default content or text for other cases
                    return translate(localeJson, 'individual_questionnaires');
                }
            }
        },
        {
            field: 'actions',
            header: translate(localeJson, 'details_table'),
            className: "action_class",
            body: (rowData) => {
                return (
                    <div>
                        <Button
                            parentStyle={{ display: "inline" }}
                            buttonProps={{
                                text: translate(localeJson, 'details_table'),
                                buttonClass: "text-primary",
                                bg: "bg-white",
                                hoverBg: "hover:bg-primary hover:text-white",
                                onClick: () => {
                                    if (rowData.Name === 'Master questionnaires') {
                                        router.push('/admin/questionnaire/master')
                                    }
                                    else {
                                        router.push('/admin/questionnaire/individual')
                                    }
                                }
                            }} />
                    </div>
                )
            }
        }
    ]

    const action = (obj) => {
        return (
            <div className="input-switch-parent">
                <DeleteModal
                    header={translate(localeJson, "confirmation_information")}
                    content={translate(localeJson, "do_you_want_to_change_status_of_the_questionnaire")}
                    cancelButton={true}
                    updateButton={true}
                    cancelButtonClass="text-600 w-8rem font-bold"
                    updateButtonClass="w-8rem font-bold"

                />
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        AdminQuestionarieService.getAdminQuestionarieRowExpansionWithOrdersSmall().then((data) => setAdmins(data));
        fetchData();
    }, []);

    return (
        <>
            <QuestionnairesCreateEditModal
                open={specialCareEditOpen}
                header={translate(localeJson, registerModalAction == "create" ? 'questionnaire_event_registration' : 'questionnaire_event_info_edit')}
                close={() => setSpecialCareEditOpen(false)}
                buttonText={translate(localeJson, registerModalAction == "create" ? 'submit' : 'update')}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'questionnaire')}</h5>
                        <hr />
                        <div className='flex pb-3' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'questionnaire_add_event'),
                                onClick: () => {
                                    setRegisterModalAction("create")
                                    setSpecialCareEditOpen(true)
                                },
                                severity: "success"
                            }} parentClass={"mr-1 mt-1"} />
                        </div>
                        <div>
                            <RowExpansionTable paginator={"true"} paginatorLeft={true} showGridlines={"true"} rowExpansionField={"orders"} customRowExpansionActionsField={"actions"} innerColumn={innerColumn} customActionsField="actions" value={admins} outerColumn={cols} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}