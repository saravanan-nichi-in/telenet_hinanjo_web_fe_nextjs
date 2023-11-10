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
        { field: 'number', header: translate(localeJson, 's_no'), minWidth: "3rem", headerClassName: "custom-header", className: "sno_class", textAlign: "center" },
        { field: 'name', header: translate(localeJson, 'name'), minWidth: "15rem", headerClassName: "custom-header", textAlign: "left" },
        { field: 'email', header: translate(localeJson, 'address_email'), headerClassName: "custom-header", textAlign: "left" },
        { field: 'actions', header: translate(localeJson, 'common_action'), headerClassName: "custom-header", className: "action_class", textAlign: "center" },
    ];
    const [importOpen, setImportOpen] = useState(false);
    const [exportPayload, setExportPayload] = useState({
        filters: {
            order_by: "desc",
            sort_by: "updated_at"
        },
        name: ""
    });
    const [createOpen, setCreateOpen] = useState(false);
    const [createPayload, setCreatePayload] = useState({
        name: "",
        name_kana: "",
        email: "",
        birthday: "",
        gender: "",
        password: ""
    });
    const [searchName, setSearchName] = useState("");
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
    const [editOpen, setEditOpen] = useState(false);
    const [editPayload, setEditPayload] = useState({
        id: "",
        name: "",
        name_kana: "",
        email: "",
        birthday: "",
        gender: "",
        password: ""
    });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePayload, setDeletePayload] = useState(0);

    /* Services */
    const { callImport, callExport, callCreate, callGetList, callUpdate, callDelete } = AdminManagementServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
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
     * Import file
     * @param {*} file 
     */
    const onImportFile = async (file) => {
        setImportOpen(false);
        if (file) {
            setLoader(true);
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
                    onClick: async () => {
                        if (!_.isEmpty(obj)) {
                            await setEditPayload(prevState => ({
                                ...prevState,
                                id: obj.id,
                                name: obj.name,
                                email: obj.email,
                            }));
                        }
                        setEditOpen(true);
                    }
                }} />
                <Button buttonProps={{
                    text: translate(localeJson, 'delete'),
                    buttonClass: "delete-button",
                    onClick: () => {
                        if (!_.isEmpty(obj)) {
                            setDeletePayload(obj.id);
                        }
                        setDeleteOpen(true);
                    }
                }} parentClass={"delete-button"} />
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

    /**
     * Create admin callback function
     * @param {*} data 
     */
    const onCreate = async (data) => {
        setCreateOpen(false);
        if (data) {
            setLoader(true);
            let payload = createPayload;
            const { fullName, email, password } = data;
            payload['name'] = fullName;
            payload['email'] = email;
            payload['password'] = password;
            await callCreate(payload, onCreateSuccess);
            setCreatePayload(payload);
        }
    }

    /**
     * Create success callback function
     * @param {*} response 
     */
    const onCreateSuccess = (response) => {
        onGetAdminList();
    }

    /**
     * Create callback function
     * @param {*} data 
     */
    const onEdit = async (data) => {
        setEditOpen(false);
        if (data) {
            setLoader(true);
            let payload = editPayload;
            const { fullName, email } = data;
            payload['name'] = fullName;
            payload['email'] = email;
            await callUpdate(payload, onEditSuccess);
            setEditPayload(payload);
        }
    }

    /**
     * Edit success callback function
     * @param {*} response 
     */
    const onEditSuccess = (response) => {
        onGetAdminList();
    }

    const onDelete = async (string) => {
        if (string === "confirm") {
            setLoader(true);
            callDelete(deletePayload, onDeleteSuccess)
        }
        setDeleteOpen(false);
    }

    /**
    * Delete success callback function
    * @param {*} response 
    */
    const onDeleteSuccess = (response) => {
        onGetAdminList();
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
            {/* Create */}
            <AdminManagementCreateModal
                open={createOpen}
                close={() => {
                    setCreateOpen(false);
                }}
                callBackFunction={onCreate}
            />
            {/* Edit */}
            <AdminManagementEditModal
                open={editOpen}
                close={() => {
                    setEditOpen(false);
                }}
                values={editPayload}
                callBackFunction={onEdit}
            />
            {/* Delete */}
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDelete}
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
                                    onClick: () => {
                                        if (searchName) {
                                            let payload = exportPayload;
                                            payload['name'] = searchName;
                                            callExport(payload);
                                        } else {
                                            callExport(exportPayload);
                                        }
                                    }
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'create_admin'),
                                    onClick: () => setCreateOpen(true),
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
                                                inputClass: "w-17rem lg:w-17rem md:w-20rem sm:w-14rem",
                                                value: searchName,
                                                onChange: (e) => {
                                                    setSearchName(e.target.value);
                                                }
                                            }} parentClass={"w-full lg:w-22rem md:w-20rem sm:w-14rem"}
                                            />

                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                type: "button",
                                                buttonClass: "w-12 search-button",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary",
                                                onClick: async () => {
                                                    await setGetListPayload(prevState => ({
                                                        ...prevState,
                                                        search: searchName
                                                    }));
                                                }
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