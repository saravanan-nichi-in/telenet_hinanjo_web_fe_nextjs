import React, { useEffect, useState, useContext } from 'react';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import {
    getValueByKeyRecursively as translate,
    getEnglishDateTimeDisplayFormat,
} from '@/helper';
import { Button, CustomHeader, NormalTable, AdminManagementDeleteModal, DeleteModal, PlaceEventBulkCheckOut, EventCreateEditModal } from '@/components';
import { EventQuestionnaireServices } from '@/services/event_questionnaire.services';
import { useAppDispatch } from '@/redux/hooks';

export default function Questionnaire() {
    const { localeJson, locale, setLoader} = useContext(LayoutContext);
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [bulkCheckoutOpen, setBulkCheckoutOpen] = useState(false);
    const [editObject, setEditObject] = useState({})
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteObj, setDeleteObj] = useState(null);
    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 10,
            "sort_by": "updated_at",
            "order_by": "desc"
        },
        "search": ""
    });
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [eventData, setEventData] = useState([]);
    const dispatch = useAppDispatch();

    const hideOverFlow = () => {
        document.body.style.overflow = 'hidden';
    }

    const showOverFlow = () => {
        document.body.style.overflow = 'auto';
    }

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
                            onClick: () => {
                                setRegisterModalAction("edit")
                                formatEditObject(rowData)
                                setSpecialCareEditOpen(true)
                                hideOverFlow();
                            }
                        }} parentClass={"edit-button"} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "ml-2 delete-button",
                            disabled: !rowData.is_deletable,
                            onClick: () => {
                                if (rowData.is_deletable) {
                                    openDeleteDialog(rowData)
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

    const { getList, registerUpdateEvent, updateEventData, updateEventStatus, deleteEvent } = EventQuestionnaireServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEventList()
        };
        fetchData();
    }, [locale, getListPayload]);

    const onGetEventList = () => {
        getList(getListPayload, (response) => {
            var eventListArray = [];
            var listTotalCount = 0;
            if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
                const data = response.data.model.list;
                data.map((item, index) => {
                    let event = {
                        si_no: index + parseInt(getListPayload.filters.start) + 1,
                        id: item.id,
                        name: item.name,
                        name_en: item.name_en,
                        description: item.remarks,
                        remarks: item.remarks,
                        opening_date: item.start_date,
                        closing_date: item.end_date,
                        active_flg: item.is_q_active,
                        active_status: !item.is_deletable ? "place-status-cell" : "",
                        is_default: item.is_default,
                        is_deletable: item.is_deletable,
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

    const formatEditObject = (rowData) => {
        rowData.opening_date = rowData.opening_date ? new Date(rowData.opening_date) : "";
        rowData.closing_date = rowData.closing_date ? new Date(rowData.closing_date) : "";
        setEditObject(rowData);
    }

    const updateEventActiveStatus = (rowData) => {
        let payload = {
            event_id: rowData.id,
            is_q_active: rowData.active_flg == 0 ? 1 : 0
        }
        updateEventStatus(payload, () => {
            onGetEventList()
        })
    }

    const action = (obj) => {
        return (
            <div className="input-switch-parent">
                <DeleteModal
                    header={translate(localeJson, "toggle_place")}
                    content={translate(localeJson, "do_you_want_to_change_status_of_the_questionnaire")}
                    data={obj}
                    cancelButton={true}
                    updateButton={true}
                    cancelButtonClass="w-full back-button"
                    updateButtonClass="w-full font-bold del_ok-button"
                    checked={obj.active_flg == 1 ? true : false}
                    updateCalBackFunction={(rowDataReceived) => updateEventActiveStatus(rowDataReceived)}
                />
            </div>
        );
    };

    const cellClassName = (data) =>
        data == "place-status-cell" ? "p-disabled surface-400" : "";

    const isCellSelectable = (event) =>
        !(
            event.data.field === "active_status" && event.data.value === "place-status-cell"
        );

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

    const onRegister = (values) => {
        let payload = {
            name: values.name,
            name_en: values.name_en,
            start_date: getEnglishDateTimeDisplayFormat(values.opening_date),
            end_date: getEnglishDateTimeDisplayFormat(values.closing_date),
            remarks: values.remarks
        };
        if (registerModalAction == 'create') {
            setTableLoading(true);
            registerUpdateEvent(payload, () => {
                onGetEventList()
            })
        }
        else {
            payload['id'] = editObject.id;
            setTableLoading(true);
            updateEventData(payload, () => {
                onGetEventList();
            })
        }
    }

    const openDeleteDialog = (rowdata) => {
        setDeleteId(rowdata.id);
        setDeleteObj({
            firstLabel: translate(localeJson, 'questionnaire_name'),
            firstValue: rowdata.name,
            secondLabel: translate(localeJson, 'event_description'),
            secondValue: rowdata.remarks
        });
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            let payload = {
                id: deleteId
            };
            setTableLoading(true);
            deleteEvent(payload, () => {
                onGetEventList();
            })
        }
        setDeleteOpen(false);
        showOverFlow();
    };

    return (
        <>
            {specialCareEditOpen && (
                <EventCreateEditModal
                    open={specialCareEditOpen}
                    header={translate(localeJson, registerModalAction == "create" ? 'questionnaire_event_registration' : 'questionnaire_event_info_edit')}
                    close={() => {
                        setSpecialCareEditOpen(false)
                        showOverFlow();
                    }}
                    editObject={editObject}
                    modalAction={registerModalAction}
                    onRegister={onRegister}
                    showOverFlow={showOverFlow}
                    buttonText={translate(localeJson, registerModalAction == "create" ? 'submit' : 'update')}
                />
            )}
            {deleteOpen && (
                <AdminManagementDeleteModal
                    open={deleteOpen}
                    close={onDeleteClose}
                    refreshList={onGetEventList}
                    deleteObj={deleteObj}
                />
            )}
            {bulkCheckoutOpen && (
                <PlaceEventBulkCheckOut
                    modalHeaderText={translate(localeJson, 'questionnaire_name')}
                    open={bulkCheckoutOpen}
                    close={() => {
                        setBulkCheckoutOpen(false);
                        showOverFlow();
                    }}
                    type={"events"}
                />
            )}
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
                                    onClick: () => {
                                        setBulkCheckoutOpen(true)
                                        hideOverFlow();
                                    }
                                }}
                                parentClass={"mr-1 mt-1"}
                            />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                create: true,
                                buttonClass: "w-60 create-button",
                                text: translate(localeJson, 'questionnaire_add_event'),
                                onClick: () => {
                                    setRegisterModalAction("create")
                                    setSpecialCareEditOpen(true)
                                    hideOverFlow();
                                },
                            }} parentClass={"mr-1 mt-1 create-button"} />
                        </div>
                        <div>
                            <NormalTable
                                paginator={true}
                                totalRecords={totalCount}
                                loading={tableLoading}
                                stripedRows={true}
                                showGridlines={"true"}
                                customActionsField="actions"
                                columns={cols}
                                value={eventData}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                first={getListPayload.filters.start}
                                rows={getListPayload.filters.limit}
                                paginatorLeft={true}
                                defaultIndex={true}
                                cellClassName={cellClassName}
                                isDataSelectable={isCellSelectable}
                                onPageHandler={(e) => onPaginationChange(e)}
                                className={"custom-table-cell"}
                                lazy
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
