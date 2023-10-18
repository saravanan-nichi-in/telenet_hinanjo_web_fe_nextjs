import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CommonDialog, NormalTable } from '@/components';
import { AdminSpecialCareService } from '@/helper/adminSpecialCareService';
import { AdminManagementImportModal, SpecialCareEditModal } from '@/components/modal';
import { SpecialCareServices } from "@/services";
import _ from "lodash";

export default function AdminSpecialCarePage() {
    const { localeJson, setLoader,locale } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const router = useRouter();
    const [specialCareCreateDialogVisible, setSpecialCareCreateDialogVisible] = useState(false);
    const [specialCareEditOpen, setSpecialCareEditOpen] = useState(false);
    const [specialCarCreateOpen, setSpecialCareCreateOpen] = useState(false);
    const [importSpecialCareOpen, setImportSpecialCareOpen] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [id,setId] = useState(0)
    const [currentEditObj, setCurrentEditObj] = useState({});
    const [registerModalAction, setRegisterModalAction] = useState('create');
    const [getPayload, setPayload] = useState({
        filters: {
          start: 0,
          limit: 5,
          sort_by: "updated_at",
          order_by: "asc",
        },
        search: "",
      });
    const onClickCancelButton = () => {
        setSpecialCareCreateDialogVisible(false);
    };
    const onClickOkButton = (res) => {
        if(res)
        {
        setSpecialCareCreateDialogVisible(false);
      }
    };
    const onSpecialCareEditSuccess = (response) => {
        setSpecialCareEditOpen(false);
        setSpecialCareCreateOpen(false);
    };
    const onSpecialCareImportClose = () => {
        setImportSpecialCareOpen(!importSpecialCareOpen);
    };
    const onRegister = (values) => {
        setImportSpecialCareOpen(false);
    }

    const columnsData = [
        { field: 'index', header:translate(localeJson,'s_no'),minWidth:"50px",maxWidth:"50px",width:"50px" },
        {
            field: 'name', header: translate(localeJson, 'special_care_name_jp'), minWidth: "12rem", 
        },
        { field: 'name_en', header: translate(localeJson, 'special_care_name_en'), minWidth: "14rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            maxWidth: "8rem",
            body: (rowData) =>
            { 
                return (
                <div className='flex flex-wrap justify-content-center gap-2'>
                        <Button buttonProps={{
                        text: translate(localeJson, 'edit'), 
                        buttonClass: "text-primary ",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => {
                            setRegisterModalAction("edit")
                            setCurrentEditObj({
                                id:rowData.id,
                                name:rowData.name,
                                name_en:rowData.name_en
                            })
                            setSpecialCareEditOpen(true)
                        },
                    }} />
                     <Button buttonProps={{
                        text: translate(localeJson, 'delete'), buttonClass: "text-primary",
                        bg: "bg-red-600 text-white",
                        hoverBg: "hover:bg-red-500 hover:text-white",
                        onClick: () => 
                        {
                        setId(rowData.id)
                        setSpecialCareCreateDialogVisible(true)
                        }
                    }} />
                </div>
            )
            }
        }
    ];

      /* Services */
  const { getList,importData,exportData,deleteSpecialCare,create,update } = SpecialCareServices;

  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await onGetPlaceListOnMounting();
      setLoader(false);
    };
    fetchData();
  }, [locale,getPayload]);

  /**
   * Get place list on mounting
   */
  const onGetPlaceListOnMounting = async () => {
    // Get places list
    getList(getPayload, fetchData);
  };

  function fetchData(response) {
    setLoader(true)

    if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
        const data = response.data.model.list;
        var additionalColumnsArrayWithOldData = [...columnsData];
        let preparedList = [];
        // Update prepared list to the state
        // Preparing row data for specific column to display
        data.map((obj, i) => {
            let preparedObj = {
                index: getPayload.filters.start+i + 1,
                id: obj.id || "",
                name: obj.name || "",
                name_en: obj.name_en || "",
            }
            preparedList.push(preparedObj);
        })

        setList(preparedList);
        setColumns(additionalColumnsArrayWithOldData);
        setTotalCount(response.data.model.total);
        setTableLoading(false);
        setLoader(false)
    }
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
      const formData = new FormData()
      formData.append('file',file)
      importData(formData)
      setImportSpecialCareOpen(false);
  };

  const submitForm=(res)=> {
    if(res.id)
    {
    update(res,isUpdated)
    }
    else {
    create(res,isCreated)
    }

  }
  const isCreated = (res) => {
    if(res)
    {
        onSpecialCareEditSuccess()
    }
  }
  const isUpdated = (res) => {
    if(res)
    {
        setCurrentEditObj({})
        setId(0)
        onSpecialCareEditSuccess()
    }
  }

    return (
        <>
            <CommonDialog
                open={specialCareCreateDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'confirmation_information')}
                content={
                    <div>
                        <p>{translate(localeJson, 'once_deleted_cannot_restore')}</p>
                        <p>{translate(localeJson, 'do_you_want_to_delete')}</p>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => onClickCancelButton(),
                        },
                        parentClass: "inline"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-8rem",
                            type: "submit",
                            text: translate(localeJson, 'ok'),
                            severity: "danger",
                            onClick: () =>{
                                setLoader(true)
                                deleteSpecialCare(id,onClickOkButton)
                                setLoader(false)
                            },
                        },
                        parentClass: "inline"
                    }
                ]}
                close={() => {
                    setSpecialCareCreateDialogVisible(false);
                }}
            />
            <SpecialCareEditModal
                open={specialCareEditOpen}
                header={translate(localeJson, 'special_care_edit')}
                close={() => setSpecialCareEditOpen(false)}
                buttonText={translate(localeJson,registerModalAction=="create"?'submit': 'update')}
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
                        <h5 className='page-header1'>{translate(localeJson, 'special_care_list')}</h5>
                        <hr />
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'import'),
                                onClick: () => setImportSpecialCareOpen(true),
                                severity: "primary"
                            }} parentClass={"mr-1 mt-1"} />
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'export'),
                                severity: "primary",
                                onClick: () => exportData(getPayload),
                            }} parentClass={"mr-1 mt-1"} />

                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                buttonClass: "evacuation_button_height",
                                text: translate(localeJson, 'create_special_care'),
                                onClick: () =>{ 
                                    setRegisterModalAction("create")
                                    setCurrentEditObj({ name: "", name_en: "" })
                                    setSpecialCareEditOpen(true)
                                },
                                severity: "success"
                            }} parentClass={"mr-1 mt-1"} />
                        </div>
                        <div className='mt-3'>
                            <NormalTable 
                            lazy
                            totalRecords={totalCount}
                            loading={tableLoading}
                            showGridlines={"true"}
                            paginator={"true"}
                            columnStyle={{ textAlign: "center" }}
                            className={"custom-table-cell"}
                            value={list}
                            columns={columns}
                            emptyMessage= {translate(localeJson,"data_not_found")}
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