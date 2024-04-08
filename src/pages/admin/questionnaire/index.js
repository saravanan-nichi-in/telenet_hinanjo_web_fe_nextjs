import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button, CustomHeader, RowExpansionTable } from '@/components';
import { QuestionnairesCreateEditModal, PlaceEventBulkCheckOut } from '@/components/modal';
import { EventQuestionnaireServices } from '@/services/event_questionnaire.services';
import { setEvent } from '@/redux/event';
import { useAppDispatch } from '@/redux/hooks';

export default function Questionnaire() {
    const { localeJson, locale } = useContext(LayoutContext);
    const router = useRouter();
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [bulkCheckoutOpen, setBulkCheckoutOpen] = useState(false);
    const [editObject, setEditObject] = useState({})
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [eventData, setEventData] = useState([]);
    const dispatch = useAppDispatch();
    const cols = [
        { field: 'name', header: translate(localeJson, 'interview_page_shelter_name'), minWidth: '11rem', maxWidth: "11rem", headerClassName: "custom-header" },

        { field: 'name_en', header: translate(localeJson, 'interview_page_shelter_name_en'), minWidth: '18rem', maxWidth: '18rem', headerClassName: "custom-header" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => (
                <div>
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "edit-button",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                formatEditObject(rowData)
                                setSpecialCareEditOpen(true)
                            }
                        }} parentClass={"edit-button"} />
                </div>
            ),

        }
    ]
    const innerColumn = [
        { field: "name", header: translate(localeJson, 'interview_page_inner_column_question_type') },
        { field: "id", header: translate(localeJson, 'id'), display: 'none' },
        {
            field: 'actions',
            header: translate(localeJson, 'details_table'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => {
                return (
                    <div>
                        <Button
                            parentStyle={{ display: "inline" }}
                            buttonProps={{
                                text: translate(localeJson, 'edit'),
                                buttonClass: "edit-button",
                                onClick: () => {
                                    dispatch(setEvent({ event_id: rowData.id }));

                                    if (rowData.index == 0) {
                                        router.push('/admin/questionnaire/master');
                                    }
                                    else {
                                        router.push('/admin/questionnaire/individual')
                                    }
                                }
                            }} parentClass={"edit-button"} />
                    </div>
                )
            }
        }
    ]

    const { getSingleEvent, updateSingleEvent } = EventQuestionnaireServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEventList()
        };
        fetchData();
    }, [locale]);

    const onGetEventList = () => {
        setTableLoading(true);
        getSingleEvent({}, (response) => {
            let tempValues = [];
            if (response.data.model) {
                tempValues.push({
                    ...response.data.model,
                    orders: [{
                        id: response.data.model.id,
                        index: 0,
                        name: translate(localeJson, 'interview_page_inner_column_household_question'),
                        is_default: response.data.model.is_default,
                    },
                    {
                        id: response.data.model.id,
                        index: 1,
                        name: translate(localeJson, 'interview_page_inner_column_personal_question'),
                        is_default: response.data.model.is_default,
                    }
                    ]
                });
            }
            setEventData(tempValues);
            setTableLoading(false);
        });
    }

    const formatEditObject = (rowData) => {
        rowData.opening_date = rowData.opening_date ? new Date(rowData.opening_date) : "";
        rowData.closing_date = rowData.closing_date ? new Date(rowData.closing_date) : "";
        setEditObject(rowData);
    }

    const onRegister = (values) => {
        values['id'] = editObject.id;
        updateSingleEvent(values, () => {
            onGetEventList();
        })
    }

    return (
        <>
            {specialCareEditOpen && (
                <QuestionnairesCreateEditModal
                    open={specialCareEditOpen}
                    header={translate(localeJson, registerModalAction == "create" ? 'questionnaire_event_registration' : 'questionnaire_event_info_edit')}
                    close={() => setSpecialCareEditOpen(false)}
                    editObject={editObject}
                    modalAction={registerModalAction}
                    onRegister={onRegister}
                    buttonText={translate(localeJson, registerModalAction == "create" ? 'submit' : 'update')}
                />
            )}
            {bulkCheckoutOpen && (
                <PlaceEventBulkCheckOut
                    modalHeaderText={translate(localeJson, 'event_information')}
                    open={bulkCheckoutOpen}
                    close={() => {
                        setBulkCheckoutOpen(false);
                    }}
                    type={"events"}
                />
            )}
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "interview_management")} />
                        <div>
                            <RowExpansionTable
                                paginator={false}
                                className="questionnaire-table"
                                totalRecords={totalCount}
                                loading={tableLoading}
                                showGridlines={"true"}
                                stripedRows={true}
                                rowExpansionField={"orders"}
                                customRowExpansionActionsField={"actions"}
                                innerColumn={innerColumn}
                                customActionsField="actions"
                                value={eventData}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                outerColumn={cols}
                                expandAllRows={true}
                                custom={"custom-table-questionnaires"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
