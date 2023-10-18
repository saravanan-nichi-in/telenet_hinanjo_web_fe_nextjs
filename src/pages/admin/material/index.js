import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, NormalTable } from '@/components';
import MaterialCreateEditModal from '@/components/modal/materialCreateEditModal';
import { AdminManagementDeleteModal, AdminManagementImportModal } from '@/components/modal';
import { MaterialService } from '@/services/material.service';
import _ from 'lodash';

export default function AdminMaterialPage() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
    const columnsData = [
        { field: 'slno', header: 'ID', minWidth: "5rem" },
        { field: 'name', header: '物資', minWidth: "15rem", maxWidth: "15rem" },
        { field: 'unit', header: '単位', minWidth: "15rem", maxWidth: "15rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            minWidth: "2rem",
            body: (rowData) => (
                <>
                <Button 
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                        text: translate(localeJson, 'edit'), 
                        buttonClass: "text-primary ",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => {
                            setRegisterModalAction("edit")
                            setCurrentEditObj(rowData)
                            setEmailSettingsOpen(true)
                            hideOverFlow();
                        },
                    }} />
                <Button parentStyle={{ display: "inline" }}
                    buttonProps={{
                    text: translate(localeJson, 'delete'), 
                    buttonClass: "text-primary ml-2",
                    bg: "bg-red-600 text-white",
                    severity: "danger",
                    hoverBg: "hover:bg-red-500 hover:text-white",
                    onClick: () => openDeleteDialog(rowData.id)
                }} />
                </>
            ),
        }
    ];

    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 5,
            sort_by: "",
            order_by: "desc",
        },
        search: "",
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList, exportData } = MaterialService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    /**
     * Get dashboard list on mounting
     */
    const onGetMaterialListOnMounting = () => {
        // Get dashboard list
        getList(getListPayload, (response) => {
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Update prepared list to the state
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

                setList(preparedList);
                setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setList([]);
            }

        });
    }


    const [deleteId, setDeleteId] = useState(null);

    const openDeleteDialog = (id) => {
        setDeleteId(id);
        setDeleteStaffOpen(true);
        hideOverFlow();
    }

    const onStaffDeleteClose = (action = "close") => {
        if (action == "confirm") {
            MaterialService.delete(deleteId, (resData) => {
                onGetMaterialListOnMounting()
            });
        }
        setDeleteStaffOpen(!deleteStaffOpen);
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
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        MaterialService.importData(formData, () => {
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
                open={deleteStaffOpen}
                close={onStaffDeleteClose}
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
                            <h5 className='page-header1'>{translate(localeJson, 'material')}</h5>
                            <hr />
                            <div>
                                <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'import'),
                                        severity: "primary",
                                        onClick: () => {
                                            setImportPlaceOpen(true);
                                            hideOverFlow();
                                        },
                                    }} parentClass={"mr-1 mt-1"} />
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        buttonClass: "evacuation_button_height",
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
                                    }} parentClass={"mr-1 mt-1"} />

                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'signup'),
                                        onClick: () => {
                                            setRegisterModalAction("create")
                                            setCurrentEditObj({ name: "", unit: "" })
                                            setEmailSettingsOpen(true);
                                            hideOverFlow();
                                        },
                                        severity: "success"
                                    }} parentClass={"mt-1"} />
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
                                        columns={columns}
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