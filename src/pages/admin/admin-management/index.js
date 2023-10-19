import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { AdminManagementCreateModal, AdminManagementDeleteModal, AdminManagementDetailModal, AdminManagementEditModal, AdminManagementImportModal } from '@/components/modal';
import { AdminManagementServices } from '@/services';

export default function AdminManagementPage() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const columnsData = [
        { field: 'number', header: translate(localeJson, 's_no'), minWidth: "3rem", headerClassName: "custom-header", className: "sno_class", textAlign: "left" },
        { field: 'name', header: translate(localeJson, 'name'), minWidth: "15rem", headerClassName: "custom-header", textAlign: "left" },
        { field: 'email', header: translate(localeJson, 'address_email'), headerClassName: "custom-header", textAlign: "left" },
        { field: 'actions', header: translate(localeJson, 'common_action'), headerClassName: "custom-header", className: "action_class", textAlign: "center" },
    ];
    const [editAdminOpen, setEditAdminOpen] = useState(false);
    const [adminDetailsOpen, setAdminDetailsOpen] = useState(false);
    const [deleteAdminOpen, setDeleteAdminOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [createAdminOpen, setCreateAdminOpen] = useState(false);
    const [exportPayload, setExportPayload] = useState({
        filters: {
            order_by: "desc",
            sort_by: "updated_at"
        },
        name: ""
    });
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 5,
            sort_by: "",
            order_by: "desc",
        },
        search: "",
    });
    const [tableLoading, setTableLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    /* Services */
    const { callImport, callExport, callCreate, callGetList, callDelete } = AdminManagementServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            // await AdminManagementService.getAdminsMedium().then((data) => setAdmins(data));
            // setLoader(false);
            await onGetAdminList();
        };
        fetchData();
    }, [locale, getListPayload]);

    /**
     * Get admin list
     */
    const onGetAdminList = () => {
        callGetList(getListPayload, onGetAdminListSuccess);
    }

    /**
     * Function will get data & update admin list
     * @param {*} response 
     */
    const onGetAdminListSuccess = (response) => {
        var additionalColumnsArrayWithOldData = [...columnsData];
        var preparedList = [];
        if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
            const data = response.data.model.list;
            // Preparing row data for specific column to display
            data.map((obj, i) => {
                console.log(obj.name);
                let preparedObj = {
                    number: getListPayload.filters.start + i + 1,
                    name: obj.name,
                    email: obj.email,
                    actions: action(obj),
                }
                preparedList.push(preparedObj);
            })
            // Update prepared list to the state
            setColumns(additionalColumnsArrayWithOldData);
            setList(preparedList);
            setTotalCount(response.data.model.total);
        }
        setTableLoading(false);
        setLoader(false);
    }

    /**
     * Email setting modal close
    */
    const onAdminClose = () => {
        setEditAdminOpen(!editAdminOpen);
    };

    /**
     * Detail setting modal close
     */
    const onAdminDetailClose = () => {
        setAdminDetailsOpen(!adminDetailsOpen);
    };

    /**
     * Delete setting modal close
     */
    const onAdminDeleteClose = () => {
        setDeleteAdminOpen(!deleteAdminOpen);
    };

    /**
     * Delete setting modal close
     */
    const onAdminCreateClose = () => {
        setCreateAdminOpen(!createAdminOpen);
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEditAdminOpen(false);
        setCreateAdminOpen(false);
    };

    /**
     * Import file
     * @param {*} file 
     */
    const onImportFile = async (file) => {
        setImportOpen(false);
        setLoader(true);
        console.log(file);
        if (file) {
            const payload = new FormData();
            payload.append('file', file);
            await callImport(payload, onImportSuccess);
        }
    }

    /**
     * Import on success callback function
     * @param {*} response 
     */
    const onImportSuccess = (response) => {
        setImportOpen(false);
        setLoader(false);
    }

    /**
     * Action column for dashboard list
     * @param {*} obj 
     * @returns 
     */
    const action = (obj) => {
        return (
            <div className='flex flex-wrap justify-content-center gap-2'>
                <Button buttonProps={{
                    text: translate(localeJson, 'edit'),
                    buttonClass: "text-primary ",
                    bg: "bg-white",
                    hoverBg: "hover:bg-primary hover:text-white",
                }} />
                <Button buttonProps={{
                    text: translate(localeJson, 'delete'),
                    buttonClass: "text-primary",
                    bg: "bg-red-600 text-white",
                    hoverBg: "hover:bg-red-500 hover:text-white",
                }} />
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

    return (
        <React.Fragment>
            {/* Import */}
            <AdminManagementImportModal
                open={importOpen}
                modalHeaderText={translate(localeJson, 'admin_management_import')}
                close={() => {
                    setImportOpen(false);
                }}
                importFile={onImportFile}
            />
            <AdminManagementEditModal
                open={editAdminOpen}
                close={onAdminClose}
                register={onRegister}
            />
            <AdminManagementDetailModal
                open={adminDetailsOpen}
                close={onAdminDetailClose}
            />
            <AdminManagementDeleteModal
                open={deleteAdminOpen}
                close={onAdminDeleteClose}
            />
            <AdminManagementCreateModal
                open={createAdminOpen}
                close={onAdminCreateClose}
                register={onRegister}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'admin_management')}</h5>
                        <hr />
                        <div >
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary",
                                    onClick: () => setImportOpen(true)
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary",
                                    onClick: () => callExport(exportPayload)
                                }} parentClass={"mr-1 mt-1"} />

                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'create_admin'),
                                    onClick: () => setCreateAdminOpen(true),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <form>
                                    <div className="flex justify-content-end gap-3 flex-wrap float-right mt-5 mb-3" >
                                        <div>
                                            <InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
                                                text: translate(localeJson, 'name'),
                                                inputClass: "w-17rem lg:w-17rem md:w-20rem sm:w-14rem "
                                            }} parentClass={"w-full lg:w-22rem md:w-20rem sm:w-14rem"}
                                            />

                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary"
                                            }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div>
                            </div>
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
        </React.Fragment>
    )
}