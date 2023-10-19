import React, { useState, useEffect, useContext } from 'react';
import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { AdminManagementDeleteModal, AdminManagementImportModal, StaffManagementDetailModal, StaffManagementEditModal } from '@/components/modal';
import { StaffManagementService } from '@/services/staffmanagement.service';

export default function StaffManagementPage() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    let blankStaffObj = { email: "", tel: "", name: "" };
    const [staff, setStaff] = useState([]);
    const [importStaffOpen, setImportStaffOpen] = useState(false);
    const [staffDetailsOpen, setStaffDetailsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editStaffOpen, setEditStaffOpen] = useState(false);
    const [createStaffOpen, setCreateStaffOpen] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [registerModalAction, setRegisterModalAction] = useState('');
    const [currentEditObj, setCurrentEditObj] = useState(blankStaffObj);

    const hideOverFlow = () => {
        document.body.style.overflow = 'hidden';
    }

    const showOverFlow = () => {
        document.body.style.overflow = 'auto';
    }

    //delete related mehotds start
    const [deleteId, setDeleteId] = useState(null);

    const openDeleteDialog = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (action = "close") => {
        if (action == "confirm") {
            StaffManagementService.delete(deleteId, (resData) => {
                getStaffList()
            });
        }
        setDeleteOpen(false);
        showOverFlow();
    };

    //delete related mehotds end

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'header_slno'), className: "sno_class"},
        {
            field: 'name', header:translate(localeJson, 'name'), minWidth: "5rem", body: (rowData) => (
                <a className='text-decoration' onClick={() => setStaffDetailsOpen(true)}>
                    {rowData['name']}
                </a>
            )
        },
        { field: 'email', header: translate(localeJson, 'address_email'), minWidth: "5rem" },
        { field: 'tel', header:translate(localeJson, 'tel') },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
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
                            setCurrentEditObj(rowData)
                            setEditStaffOpen(true)
                            hideOverFlow();
                        }
                    }} />
                    <Button 
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                        text: translate(localeJson, 'delete'), 
                        buttonClass: "text-primary ml-2",
                        bg: "bg-red-600 text-white",
                        severity: "danger",
                        hoverBg: "hover:bg-red-500 hover:text-white",
                        onClick: () => openDeleteDialog(rowData.id)
                    }} />  
                </div>
            ),
        }
    ];

    const onStaffImportClose = () => {
        setImportStaffOpen(!importStaffOpen);
        showOverFlow();
    };
    const onStaffDetailClose = () => {
        setStaffDetailsOpen(!staffDetailsOpen);

    };
    const onStaffDeleteClose = () => {
        openDeleteDialog(!deleteOpen);
    };
    const onStaffEditClose = () => {
        setEditStaffOpen(false);
        showOverFlow();
    };

    const onRegister = (values) => {
        setImportStaffOpen(false);
        setEditStaffOpen(false);
        setCreateStaffOpen(false);
    };


    // Main Table listing starts
    const { getList } = StaffManagementService;

    const [getListPayload, setGetListPayload] = useState( {
        "filters": {
            "start": 0,
            "limit": 5,
            "order_by": "desc",
            "sort_by": "updated_at"
        },
        "name" : ""
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    
    const getStaffList = () => {
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
                        id: obj.id,
                        name: obj.name ?? "",
                        email: obj.email ?? "",
                        image: obj.image ?? "",
                        tel: obj.tel ?? "",
                        birthday: obj.birthday ?? "",
                        zip_code: obj.zip_code ?? "",
                        prefecture_id: obj.prefecture_id ?? "",
                        address: obj.address ?? "",
                        first_login: obj.first_login ?? "",
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

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getStaffList()
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    // Main table listing ends

    // Import api
    const importFileApi = (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        StaffManagementService.importData(formData, () => {

        });
        onStaffImportClose();
        showOverFlow();
    }
    
    return (
        <React.Fragment>
            <AdminManagementImportModal
                open={importStaffOpen}
                close={onStaffImportClose}
                importFile={importFileApi}
                register={onRegister}
                modalHeaderText={translate(localeJson, "staff_management_import")}
            />
            <StaffManagementDetailModal
                open={staffDetailsOpen}
                close={onStaffDetailClose}
            />
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={getStaffList}
            />
            <StaffManagementEditModal
                open={editStaffOpen}
                close={onStaffEditClose}
                register={onRegister}
                currentEditObj={{ ...currentEditObj }}
                refreshList={getStaffList}
                registerModalAction={registerModalAction}
            />
            {/* <StaffManagementEditModal
                open={createStaffOpen}
                close={onStaffCreateClose}
                register={onRegister}
                
            /> */}
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'staff_management')}</h5>
                        <hr />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    onClick: () => {
                                        setImportStaffOpen(true);
                                        hideOverFlow();
                                    },
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'create_staff'),
                                    onClick: () => {
                                        setRegisterModalAction("create")
                                        setCurrentEditObj(blankStaffObj);
                                        setEditStaffOpen(true);
                                        hideOverFlow();
                                    },
                                    severity: "success"
                                }} parentClass={"mt-1"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <div class="flex justify-content-end gap-3 flex-wrap float-right mt-5 mb-3" >
                                        <div class="" >
                                            <InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
                                                text: translate(localeJson, 'name'),
                                                onChange: (e) => {setSearchName(e.target.value)},
                                                inputClass: "w-17rem lg:w-17rem md:w-20rem sm:w-14rem "
                                            }} parentClass={"w-full lg:w-22rem md:w-20rem sm:w-14rem"}
                                            />
                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary",
                                                onClick: () => {
                                                    setGetListPayload({...getListPayload, name: searchName})
                                                }
                                            }} />
                                        </div>
                                    </div>
                                </div>
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
        </React.Fragment>
    )
}