import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/redux/hooks';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button, RowExpansionTable } from '@/components';
import { DeleteModal, QuestionnairesCreateEditModal } from '@/components/modal';
import { EventQuestionnaireServices } from '@/services/event_questionnaire.services';
import { setEvent } from '@/redux/event';

export default function Questionnaire() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [editObject, setEditObject] = useState({})
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            order_by: "asc",
            sort_by: "created_at"
        },
        search: ""
    });
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [eventData, setEventData] = useState([]);
    const dispatch = useAppDispatch();
    const cols = [
        { field: "si_no", header: translate(localeJson, 'number'), headerClassName: "custom-header", className: "sno_class", textAlign: "center" },
        { field: "id", header: translate(localeJson, 'number'), headerClassName: "custom-header", className: "sno_class", textAlign: "center" , display: 'none'},
        { field: 'name', header: translate(localeJson, 'questionnaire_name'), minWidth: '11rem', maxWidth: "11rem", headerClassName: "custom-header" },
        { field: 'name_en', header: translate(localeJson, 'questionnaire_name'), minWidth: '11rem', maxWidth: "11rem", headerClassName: "custom-header", display: 'none' },
        { field: 'description', header: translate(localeJson, 'remarks'), minWidth: '18rem', maxWidth: '18rem', headerClassName: "custom-header" },
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
                            buttonClass: "text-primary",
                            bg: "bg-white",
                            hoverBg: "hover:bg-primary hover:text-white",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                setEditObject(rowData)
                                setSpecialCareEditOpen(true)
                            }
                        }} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "ml-2 delete-button",
                            onClick: () => {
                                deleteEventData(rowData)
                            }
                        }} parentClass={"delete-button"} />

                </div>
            ),

        }, {

            field: "status",
            minWidth: "3.5rem",
            maxWidth: "3.5rem",
            textAlign: "center",
            alignHeader: "center",
            header: translate(localeJson, "status"),
            body: (rowData) => {
                return action(rowData);
            },
        }
    ]

    const innerColumn = [
        { field: "id", header: translate(localeJson, 'id'), display: 'none' },
        { field: "name", header: translate(localeJson, 'name') },
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
                                text: translate(localeJson, 'details_table'),
                                buttonClass: "text-primary",
                                bg: "bg-white",
                                hoverBg: "hover:bg-primary hover:text-white",
                                onClick: () => {
                                    dispatch(setEvent({ event_id: rowData.id }));
                                    if (rowData.name === translate(localeJson, 'master_questionnaire')) {
                                        router.push('/admin/questionnaire/master');
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

    const deleteEventData = (data) => {
        let payload = {
            id: data.id
        };
        deleteEvent(payload, (response) => {
            console.log(response);
            onGetEventList();
        })

    }

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

    /**
     * Pagination handler
     * @param {*} e 
     */
    const onPaginationChange = async (e) => {
        setTableLoading(true);
        if (!_.isEmpty(e)) {
            const newStartValue = e.first; // Replace with your desired page value
            const newLimitValue = e.rows; // Replace with your desired limit value
            await setGetListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    const { getList, registerUpdateEvent, deleteEvent } = EventQuestionnaireServices

    const onGetEventList = () => {
        getList(getListPayload, (response) => {
            if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
                let eventListArray = [];
                const data = response.data.model.list;
                data.map((item, index) => {
                    let event = {
                        si_no: index + 1,
                        id: item.id,
                        name: item.name_ja,
                        name_en: item.name_en,
                        description: item.remarks,
                        orders: [{
                            id: item.id,
                            name: translate(localeJson, 'master_questionnaire')
                        },
                        {
                            id: item.id,
                            name: translate(localeJson, 'individual_questionnaires')
                        }
                        ]
                    };
                    eventListArray.push(event);
                })
                setEventData(eventListArray);
                setTotalCount(response.data.model.total);
                setTableLoading(false)
            }

            else {
                setTableLoading(false);
                setEventData([]);
                setTotalCount(0);
            }
        })
    }
    const onRegister = (values) => {
        let payload = {
            name_ja: values.name,
            name_en: values.name_en,
            remarks: values.remarks
        };
        if (registerModalAction == 'create') {
            registerUpdateEvent(payload, () => {
                onGetEventList()
            })
        }
        else {
            payload['event_id'] = editObject.id;
            console.log("kkkkkk", payload)
            registerUpdateEvent(payload, () => {
                onGetEventList();
            })
        }
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEventList()
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <>
            <QuestionnairesCreateEditModal
                open={specialCareEditOpen}
                header={translate(localeJson, registerModalAction == "create" ? 'questionnaire_event_registration' : 'questionnaire_event_info_edit')}
                close={() => setSpecialCareEditOpen(false)}
                editObject={editObject}
                modalAction={registerModalAction}
                onRegister={onRegister}
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
                            <RowExpansionTable
                                paginator={"true"}
                                totalRecords={totalCount}
                                loading={tableLoading}
                                showGridlines={"true"}
                                rowExpansionField={"orders"}
                                customRowExpansionActionsField={"actions"}
                                innerColumn={innerColumn}
                                customActionsField="actions"
                                value={eventData}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                first={getListPayload.filters.start}
                                rows={getListPayload.filters.limit}
                                paginatorLeft={true}
                                onPageHandler={(e) => onPaginationChange(e)}
                                outerColumn={cols} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}