import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, NormalTable } from '@/components';
import MaterialCreateEditModal from '@/components/modal/materialCreateEditModal';
import { AdminManagementDeleteModal, AdminManagementImportModal } from '@/components/modal';
import { MaterialService } from '@/services/material.service';

export default function AdminMaterialPage() {
    const { locale, localeJson , setLoader} = useContext(LayoutContext);
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteObj, setDeleteObj] = useState(null);
    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'material_management_table_header_slno'), className: "sno_class", textAlign: "center" },
        { field: 'name', header: translate(localeJson, 'material_management_table_header_name'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'unit', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            minWidth: "2rem",
            body: (rowData) => (
                <>
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "edit-button",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                setCurrentEditObj(rowData)
                                setEmailSettingsOpen(true)
                                hideOverFlow();
                            },
                        }} parentClass={"edit-button"} />
                    <Button parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "delete-button ml-2",
                            onClick: () => openDeleteDialog(rowData)
                        }} parentClass={"delete-button"} />
                </>
            ),
        }
    ];

    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
        },
        search: "",
    });

    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList, exportData } = MaterialService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
        };
        fetchData();
    }, [locale, getListPayload]);

    /**
     * Get dashboard list on mounting
     */
    const onGetMaterialListOnMounting = () => {
        // Get dashboard list
        setTableLoading(true);
        getList(getListPayload, (response) => {
            var preparedList = [];
            var listTotalCount = 0;
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        id: obj.id ?? "",
                        name: obj.name ?? "",
                        unit: obj.unit ?? "",
                    }
                    preparedList.push(preparedObj);
                })
                listTotalCount = response.data.model.total;
            }
            setTableLoading(false);
            setList(preparedList);
            setTotalCount(listTotalCount);
        });
    }


    const [deleteId, setDeleteId] = useState(null);

    const openDeleteDialog = (rowdata) => {
        setDeleteId(rowdata.id);
        setDeleteObj({
            firstLabel: translate(localeJson, 'material_management_table_header_name'),
            firstValue: rowdata.name,
            secondLabel: translate(localeJson, 'material_management_table_header_unit'),
            secondValue: rowdata.unit
        });
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            setTableLoading(true);
            MaterialService.delete(deleteId, (resData) => {
                onGetMaterialListOnMounting()
            });
        }
        setDeleteOpen(false);
        showOverFlow();
    };

    const hideOverFlow = () => {
        document.body.style.overflow = 'hidden';
    }

    const showOverFlow = () => {
        document.body.style.overflow = 'auto';
    }

    /**
    * Email setting modal close
   */
    const onEmailSettingsClose = () => {
        setEmailSettingsOpen(!emailSettingsOpen);
        showOverFlow();
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEmailSettingsOpen(false);
        hideOverFlow();
    };

    const [importPlaceOpen, setImportPlaceOpen] = useState(false);

    const onStaffImportClose = () => {
        setImportPlaceOpen(!importPlaceOpen);
        showOverFlow();
    };

    const onRegisterImport = (values) => {
        values.file && setImportPlaceOpen(false);
        hideOverFlow();
    };

    const importFileApi = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        MaterialService.importData(formData, (file) => {
            if (file) {
                setTableLoading(true);
                onGetMaterialListOnMounting();
            }
        });
        onStaffImportClose();
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

    const [registerModalAction, setRegisterModalAction] = useState('');
    const [currentEditObj, setCurrentEditObj] = useState('');

    return (
        <>
            <MaterialCreateEditModal
                open={emailSettingsOpen}
                close={onEmailSettingsClose}
                register={onRegisterImport}
                registerModalAction={registerModalAction}
                currentEditObj={{ ...currentEditObj }}
                refreshList={onGetMaterialListOnMounting}
            />
            
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={onGetMaterialListOnMounting}
                deleteObj={deleteObj}
            />

            <AdminManagementImportModal
                open={importPlaceOpen}
                close={onStaffImportClose}
                register={onRegister}
                modalHeaderText={translate(localeJson, "material_csv_import")}
                importFile={importFileApi}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "material")} />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height import-button",
                                    text: translate(localeJson, 'import'),
                                    import: true,
                                    severity: "primary",
                                    onClick: () => {
                                        setImportPlaceOpen(true);
                                        hideOverFlow();
                                    },
                                }} parentClass={"mr-1 mt-1 import-button"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    export: true,
                                    buttonClass: "evacuation_button_height export-button",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary",
                                    onClick: () => {
                                        exportData({
                                            "filters": {
                                                "order_by": "asc",
                                                "sort_by": "created_at"
                                            },
                                            "search": ""
                                        })
                                    }
                                }} parentClass={"mr-1 mt-1 export-button"} />

                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    create: true,
                                    buttonClass: "evacuation_button_height create-button",
                                    text: translate(localeJson, 'material_information_registration'),
                                    onClick: () => {
                                        setRegisterModalAction("create")
                                        setCurrentEditObj({ name: "", unit: "" })
                                        setEmailSettingsOpen(true);
                                        hideOverFlow();
                                    },
                                }} parentClass={"mt-1 create-button"} />
                            </div>
                            <div className='mt-3'>
                                <NormalTable
                                    lazy
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    stripedRows={true}
                                    className={"custom-table-cell"}
                                    showGridlines={"true"}
                                    value={list}
                                    columns={columnsData}
                                    filterDisplay="menu"
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginator={true}
                                    first={getListPayload.filters.start}
                                    rows={getListPayload.filters.limit}
                                    paginatorLeft={true}
                                    onPageHandler={(e) => onPaginationChange(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}