import React, { useContext, useEffect, useState } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { useSelector } from 'react-redux';

import { getValueByKeyRecursively as translate } from '@/helper'
import { ExternalEvacueesService } from '@/services/externalEvacuees.service';
import { Button, NormalTable } from '@/components';

function ExternalFamilyList() {
    
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const [deleteStaffOpen, setDeleteStaffOpen] = useState(false);
    // Sl No	避難場所種別	場所	食料等の支援	人数	避難所	メールアドレス	郵便番号	県	住所

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'material_management_table_header_slno'), className: "sno_class" },
        { field: 'place_category', header: translate(localeJson, 'material_management_table_header_name'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'place_detail', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'food_required', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'external_person_count', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'hinan_id', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'email', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'zipcode', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'prefecture_name', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'address', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "15rem", maxWidth: "15rem" },
    ];
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 5,
            sort_by: "",
            order_by: "desc",
        },
        place_id: layoutReducer?.user?.place?.id,
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList, exportData } = ExternalEvacueesService;

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
            if (response.success && !_.isEmpty(response.data) && response.data.total > 0) {
                const data = response.data.list;
                // var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        place_category: obj.place_category ?? "",
                        place_detail: obj.place_detail ?? "",
                        food_required: obj.food_required ?? "",
                        external_person_count: obj.external_person_count ?? "",
                        hinan_id: obj.hinan_id ?? "",
                        email: obj.email ?? "",
                        zipcode: obj.zipcode ?? "",
                        prefecture_name: obj.prefecture_name ?? "",
                        address: obj.address ?? "",
                    }
                    preparedList.push(preparedObj);
                })

                setList(preparedList);
                // setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.total);
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
                                        text: translate(localeJson, 'export'),
                                        severity: "primary",
                                        onClick: () => {
                                            exportData(getListPayload)
                                        }
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

export default ExternalFamilyList;

