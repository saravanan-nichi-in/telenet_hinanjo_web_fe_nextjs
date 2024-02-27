import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/redux/hooks';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getEnglishDateTimeDisplayFormat, getValueByKeyRecursively as translate } from '@/helper'
import { Button, RowExpansionTable } from '@/components';
import { DeleteModal, QuestionnairesCreateEditModal, PlaceEventBulkCheckOut } from '@/components/modal';
import { EventQuestionnaireServices } from '@/services/event_questionnaire.services';
import { setEvent } from '@/redux/event';
import CustomHeader from '@/components/customHeader';

export default function Questionnaire() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [bulkCheckoutOpen, setBulkCheckoutOpen] = useState(false);
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
        { field: "id", header: translate(localeJson, 'number'), headerClassName: "custom-header", className: "sno_class", textAlign: "center", display: 'none' },
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
                            buttonClass: "edit-button",
                            hoverBg: "hover:bg-primary hover:text-white",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                formatEditObject(rowData)
                                setSpecialCareEditOpen(true)
                            }
                        }} parentClass={"edit-button"} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "ml-2 delete-button",
                            disabled: rowData.si_no == 1 ? true : false,
                            onClick: () => {
                                if (rowData.si_no != 1) {
                                    deleteEventData(rowData)
                                }
                            }
                        }} parentClass={"delete-button"} />

                </div>
            ),

        }, {

            field: "active_status",
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
                                buttonClass: "edit-button",
                                onClick: () => {
                                    dispatch(setEvent({ event_id: rowData.id }));
                                    if (rowData.name === translate(localeJson, 'master_questionnaire')) {
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

    const formatEditObject = (rowData) => {
        rowData.opening_date = rowData.opening_date ? new Date(rowData.opening_date) : "";
        rowData.closing_date = rowData.closing_date ? new Date(rowData.closing_date) : "";
        setEditObject(rowData);
    }
    const deleteEventData = (data) => {
        let payload = {
            id: data.id
        };
        deleteEvent(payload, () => {
            onGetEventList();
        })
    }

    const updateEventActiveStatus = (rowData) => {
        let payload = {
            event_id: rowData.id,
            is_q_active: rowData.active_status == 0 ? 1 : 0
        }
        updateEventStatus(payload, () => {
            onGetEventList()
        })
    }

    const action = (obj) => {
        return (
            <div className="input-switch-parent">
                <DeleteModal
                    header={translate(localeJson, "confirmation_information")}
                    content={translate(localeJson, "do_you_want_to_change_status_of_the_questionnaire")}
                    data={obj}
                    cancelButton={true}
                    updateButton={true}
                    cancelButtonClass="w-full back-button"
                    updateButtonClass="w-full font-bold del_ok-button"
                    checked={obj.active_status == 1 ? true : false}
                    updateCalBackFunction={(rowDataReceived) => updateEventActiveStatus(rowDataReceived)}
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

    const { getList, registerUpdateEvent, updateEventData, updateEventStatus, deleteEvent } = EventQuestionnaireServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEventList()
            setLoader(false);
        };
        fetchData();
    }, []);

    const onGetEventList = () => {
        getList(getListPayload, (response) => {
            var eventListArray = [];
            var listTotalCount = 0;
            if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
                const data = response.data.model.list;
                data.map((item, index) => {

                    let event = {
                        si_no: index + 1,
                        id: item.id,
                        name: item.name,
                        name_en: item.name_en,
                        description: item.remarks,
                        opening_date: item.start_date,
                        closing_date: item.end_date,
                        active_status: item.is_q_active,
                        is_default: item.is_default,
                        orders: [{
                            id: item.id,
                            name: translate(localeJson, 'master_questionnaire'),
                            is_default: item.is_default,
                        },
                        {
                            id: item.id,
                            name: translate(localeJson, 'individual_questionnaires'),
                            is_default: item.is_default,
                        }
                        ]
                    };
                    eventListArray.push(event);
                })
                setEventData(eventListArray);
                listTotalCount = response.data.model.total;
            }
            setTableLoading(false);
            setEventData(eventListArray);
            setTotalCount(listTotalCount);
        })
    }
    const onRegister = (values) => {
        let payload = {
            name: values.name,
            name_en: values.name_en,
            start_date: getEnglishDateTimeDisplayFormat(values.opening_date),
            end_date: getEnglishDateTimeDisplayFormat(values.closing_date),
            remarks: values.remarks
        };
        if (registerModalAction == 'create') {
            registerUpdateEvent(payload, () => {
                onGetEventList()
            })
        }
        else {
            payload['id'] = editObject.id;
            updateEventData(payload, () => {
                onGetEventList();
            })
        }
    }

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
            <PlaceEventBulkCheckOut
                modalHeaderText={translate(localeJson, 'event_information')}
                open={bulkCheckoutOpen}
                close={() => {
                    setBulkCheckoutOpen(false);
                }}
                type={"events"}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "questionnaire")} />
                        <div className='flex pb-3' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button
                                buttonProps={{
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, "bulk_checkout"),
                                    severity: "primary",
                                    onClick: () => setBulkCheckoutOpen(true),
                                }}
                                parentClass={"mr-1 mt-1"}
                            />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height create-button",
                                text: translate(localeJson, 'questionnaire_add_event'),
                                onClick: () => {
                                    setRegisterModalAction("create")
                                    setSpecialCareEditOpen(true)
                                },
                            }} parentClass={"mr-1 mt-1 create-button"} />
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
                                defaultIndex={true}
                                outerColumn={cols} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
