import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DeleteModal, DividerComponent, NormalTable } from '@/components';
import { AdminMaterialService } from '@/helper/adminMaterialService';
import MaterialCreateEditModal from '@/components/modal/materialCreateEditModal';
import { AdminManagementDeleteModal, AdminManagementImportModal } from '@/components/modal';
import { MaterialService } from '@/services/material.service';
import _ from 'lodash';

export default function AdminMaterialPage() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const [checked1, setChecked1] = useState(false);
    const router = useRouter();
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const content = (
        <div>
            <p>一度削除したデータは、元に戻せません </p>
            <p>削除してもよろしいでしょうか？</p>
        </div>
    )
    const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
    const columnsData = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: '物資', minWidth: "20rem" },
        { field: 'unit', header: '単位' },
        {
            field: 'actions',
            header: '削除',
            minWidth: "7rem",
            // body: (rowData) => (
            //      <div>
            //      <Button buttonProps={{
            //          text: translate(localeJson, 'delete'), buttonClass: "text-primary",
            //          bg: "bg-white",
            //          hoverBg: "hover:bg-primary hover:text-white",
            //          onClick: () => openDeleteDialog(rowData.id)
            //      }} />
            //  </div>
            // ),
        }
    ];

    /**
     * Action column for dashboard list
     * @param {*} obj 
     * @returns 
     */
    const action = (obj) => {
        return (<div>
             <Button buttonProps={{
                     text: translate(localeJson, 'delete'), buttonClass: "text-primary",
                     bg: "bg-white",
                     hoverBg: "hover:bg-primary hover:text-white",
                     onClick: () => openDeleteDialog(obj.id)
                 }} />
            <Button buttonProps={{
                text: translate(localeJson, 'edit'), buttonClass: "text-primary",
                bg: "bg-white",
                hoverBg: "hover:bg-primary hover:text-white",
                onClick: () => openDeleteDialog(obj.id)
            }} />
             </div>
        );
    };

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
        getList(getListPayload, (response)=> {
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                var additionalColumnsArrayWithOldData = [...columnsData];
                let  preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        id: obj.id ?? "",
                        name:  obj.name ?? "",
                        unit: obj.unit ?? "",
                        actions: action(obj)
                    }
                    preparedList.push(preparedObj);
                })    
                
                // setColumns(additionalColumnsArrayWithOldData);
                setList(preparedList);
                setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
            }

        });
    }


    const [deleteId, setDeleteId] = useState(null);
    
    const openDeleteDialog = (id) => {
        alert(id);
        setDeleteId(id);
        setDeleteStaffOpen(true)
    }
    
    const onStaffDeleteClose = (action="close") => {
        if(action=="confirm") {
            // alert(deleteId)
            MaterialService.delete(deleteId, (resData)=> {
                alert(resData);
            });
        }
        setDeleteStaffOpen(!deleteStaffOpen);
    };


     /**
     * Email setting modal close
    */
     const onEmailSettingsClose = () => {
        setEmailSettingsOpen(!emailSettingsOpen);
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEmailSettingsOpen(false);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await AdminMaterialService.getAdminsMaterialMedium().then((data) => setAdmins(data));
    //         setLoader(false);
    //     };
    //     fetchData();
    // }, []);

    const [importPlaceOpen, setImportPlaceOpen] = useState(false);

    const onStaffImportClose = () => {
        setImportPlaceOpen(!importPlaceOpen);
      };
    
      const onRegisterImport = (values) => {
        values.file && setImportPlaceOpen(false);
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


    return (
        <>
        <MaterialCreateEditModal
                open={emailSettingsOpen}
                close={onEmailSettingsClose}
                register={onRegisterImport}
            />
             <AdminManagementDeleteModal
                        open={deleteStaffOpen}
                        close={onStaffDeleteClose}
                    />

<AdminManagementImportModal
        open={importPlaceOpen}
        close={onStaffImportClose}
        register={onRegister}
        modalHeaderText={translate(localeJson, "shelter_csv_import")}
        importFile={importFileApi}
      />
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'material')}</h5>
                        <DividerComponent />
                        <div className="col-12">
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary",
                                    onClick: () => setImportPlaceOpen(true),
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
                                            "search" : ""
                                        })
                                    }
                                }} parentClass={"mr-1 mt-1"} />

                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'create'),
                                    onClick: () => setEmailSettingsOpen(true),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
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
                            emptyMessage="No data found."
                            paginator={true}
                            first={getListPayload.filters.start}
                            rows={getListPayload.filters.limit}
                            paginatorLeft={true}
                            onPageHandler={(e) => onPaginationChange(e)}
                        />
                                {/* <NormalTable 
                                size={"small"}
                                stripedRows={true}
                                rows={10}
                                paginator={"true"}
                                showGridlines={"true"}
                                value={list}
                                columns={columns}
                                paginatorLeft={true}
                                totalRecords={totalCount}
                                loading={tableLoading} /> */}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}