import React, { useState, useEffect, useContext } from 'react';
import _ from "lodash";

import { hideOverFlow, showOverFlow, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { AdminManagementDeleteModal, AdminManagementImportModal, SpecialCareEditModal } from '@/components/modal';
import { SpecialCareServices } from "@/services";
import CustomHeader from '@/components/customHeader';

export default function AdminSpecialCarePage() {
    const { localeJson, locale ,setLoader } = useContext(LayoutContext);
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteObj, setDeleteObj] = useState(null);
    const [specialCarCreateOpen, setSpecialCareCreateOpen] = useState(false);
    const [importSpecialCareOpen, setImportSpecialCareOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [id, setId] = useState(0)
    const [currentEditObj, setCurrentEditObj] = useState({});
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [getPayload, setPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "updated_at",
            order_by: "asc",
        },
        search: "",
    });

    const onSpecialCareEditSuccess = (response) => {
        setSpecialCareEditOpen(false);
        setSpecialCareCreateOpen(false);
        showOverFlow();
    };
    const onSpecialCareImportClose = () => {
        setImportSpecialCareOpen(!importSpecialCareOpen);
        showOverFlow();
    };
    const onRegister = (values) => {
        setImportSpecialCareOpen(false);
    }

    const columnsData = [
        { field: 'index', header: translate(localeJson, 's_no'), className: "sno_class", textAlign: "center" },
        {
            field: 'name', header: translate(localeJson, 'special_care_name_jp'), minWidth: "12rem",
        },
        { field: 'name_en', header: translate(localeJson, 'special_care_name_en'), minWidth: "14rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => {
                return (
                    <div className='flex flex-wrap justify-content-center gap-2'>
                        <Button buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "edit-button",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                setCurrentEditObj({
                                    id: rowData.id,
                                    name: rowData.name,
                                    name_en: rowData.name_en
                                })
                                setSpecialCareEditOpen(true)
                                hideOverFlow();
                            },
                        }} parentClass={"edit-button"} />
                        <Button buttonProps={{
                            text: translate(localeJson, 'delete'), buttonClass: "delete-button",
                            onClick: () => {
                                openDeleteDialog(rowData)
                            }
                        }} parentClass={"delete-button"} />
                    </div>
                )
            }
        }
    ];

    /* Services */
    const { getList, importData, exportData, deleteSpecialCare, create, update } = SpecialCareServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetSpecialCareListOnMounting();
        };
        fetchData();
    }, [locale, getPayload]);

    /**
     * Get place list on mounting
     */
    const onGetSpecialCareListOnMounting = async () => {
        // Get places list
        getList(getPayload, fetchData);
    };

    function fetchData(response) {
        var additionalColumnsArrayWithOldData = [...columnsData];
        let preparedList = [];
        var listTotalCount = 0;
        if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
            const data = response.data.model.list;
            // Preparing row data for specific column to display
            data.map((obj, i) => {
                let preparedObj = {
                    index: getPayload.filters.start + i + 1,
                    id: obj.id || "",
                    name: obj.name || "",
                    name_en: obj.name_en || "",
                }
                preparedList.push(preparedObj);
            })
            listTotalCount = response.data.model.total;
        }
        setTableLoading(false);
        setColumns(additionalColumnsArrayWithOldData);
        setList(preparedList);
        setTotalCount(listTotalCount);
    }

    /**
      * Pagination handler
      * @param {*} e 
      */
    const onPaginationChange = async (e) => {
        setTableLoading(true);
        if (!_.isEmpty(e)) {
            const newStartValue = e.first; // Replace with your desired page value
            const newLimitValue = e.rows; // Replace with your desired limit value
            await setPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    const importFileApi = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        importData(formData, (file) => {
            if (file) {
                setTableLoading(true);
                onGetSpecialCareListOnMounting();
            }
        });
        setImportSpecialCareOpen(false);
        showOverFlow();
    }

    const submitForm = (res) => {
        if (res.id) { 
            update(res, isUpdated)
        }
        else {
            create(res, isCreated)
        }
    }
    const isCreated = (res) => {
        setTableLoading(true);

        if (res) {
            onSpecialCareEditSuccess()
            onGetSpecialCareListOnMounting();
        }
        else {
            setTableLoading(false)
        }
    }
    const isUpdated = (res) => {
        setTableLoading(true);
        if (res) {
            setCurrentEditObj({})
            setId(0)
            onSpecialCareEditSuccess()
            onGetSpecialCareListOnMounting();
        }
        else {
            setTableLoading(false);
        }
    }

    const openDeleteDialog = (rowdata) => {
        setDeleteId(rowdata.id);
        setDeleteObj({
            firstLabel: translate(localeJson, 'special_care_name_jp'),
            firstValue: rowdata.name,
            secondLabel: translate(localeJson, 'special_care_name_en'),
            secondValue: rowdata.name_en
        });
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            setTableLoading(true);
            deleteSpecialCare(deleteId, () => {
                onGetSpecialCareListOnMounting();
            });
        }
        setDeleteOpen(false);
        showOverFlow();
    };

    return (
        <>
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={onGetSpecialCareListOnMounting}
                deleteObj={deleteObj}
            />
            <SpecialCareEditModal
                open={specialCareEditOpen}
                header={translate(localeJson, registerModalAction == "create" ? 'special_care_create' : 'special_care_edit')}
                close={() => {
                    setSpecialCareEditOpen(false)
                    showOverFlow();
                }}
                buttonText={translate(localeJson, registerModalAction == "create" ? 'submit' : 'update')}
                submitForm={submitForm}
                onSpecialCareEditSuccess={onSpecialCareEditSuccess}
                currentEditObj={currentEditObj}
                registerModalAction={registerModalAction}
            />
            <AdminManagementImportModal
                open={importSpecialCareOpen}
                close={onSpecialCareImportClose}
                importFile={importFileApi}
                register={onRegister}
                modalHeaderText={translate(localeJson, 'import_special_care_data_csv')}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "special_care_list")} />
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                import: true,
                                buttonClass: "evacuation_button_height import-button",
                                text: translate(localeJson, 'import'),
                                onClick: () => {
                                    setImportSpecialCareOpen(true)
                                    hideOverFlow();
                                }
                            }} parentClass={"mr-1 mt-1 import-button"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                export: true,
                                buttonClass: "evacuation_button_height export-button",
                                text: translate(localeJson, 'export'),
                                onClick: () => exportData(getPayload),
                            }} parentClass={"mr-1 mt-1 export-button"} />

                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                create: true,
                                buttonClass: "evacuation_button_height create-button",
                                text: translate(localeJson, 'create_special_care'),
                                onClick: () => {
                                    setRegisterModalAction("create")
                                    setCurrentEditObj({ name: "", name_en: "" })
                                    setSpecialCareEditOpen(true)
                                    hideOverFlow();
                                },
                            }} parentClass={"mr-1 mt-1 create-button"} />
                        </div>
                        <div className='mt-3'>
                            <NormalTable
                                lazy
                                totalRecords={totalCount}
                                loading={tableLoading}
                                stripedRows={true}
                                showGridlines={"true"}
                                paginator={"true"}
                                columnStyle={{ textAlign: "center" }}
                                className={"custom-table-cell"}
                                value={list}
                                columns={columns}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                first={getPayload.filters.start}
                                rows={getPayload.filters.limit}
                                paginatorLeft={true}
                                onPageHandler={(e) => onPaginationChange(e)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}