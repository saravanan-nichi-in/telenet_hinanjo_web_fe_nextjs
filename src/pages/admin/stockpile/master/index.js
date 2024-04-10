import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, NormalTable, InputDropdown, AdminManagementDeleteModal, AdminManagementImportModal, StockpileSummaryImageModal, StockpileCreateEditModal } from '@/components';
import { StockpileService } from '@/services/stockpilemaster.service';

export default function AdminStockPileMaster() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toggleImageModal, setToggleImageModal] = useState(false);
    const [emailSettingsOpen, setEmailSettingsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProductName, setSelectedProductName] = useState("");
    const [selectedImage, setSelectedImage] = useState('');

    const callDropDownApi = () => {
        StockpileService.getCategoryAndProductList((res) => {
            let data = res.data;
            let tempProducts = ["--"];
            let tempCategories = new Set();
            data.forEach((value, index) => {
                tempProducts.push(value.product_name);
                tempCategories.add(value.category);
            })
            setCategories(["--", ...tempCategories]);
            setProductNames(tempProducts);
        });
    }

    const columnsData = [
        { field: 'id', header: translate(localeJson, 'header_slno'), className: "sno_class", textAlign: 'center' },
        { field: 'product_name', header: translate(localeJson, 'header_product_name'), maxWidth: "10rem", minWidth: "5rem" },
        { field: 'category', header: translate(localeJson, 'header_category'), maxWidth: "10rem", minWidth: "5rem", sortable: true },
        {
            field: 'shelf_life', header: translate(localeJson, 'header_shelf_life'), minWidth: "5rem", textAlign: "center", alignHeader: "center",
            body: (rowData) => (
                <div style={{ textAlign: "center" }}>
                    {rowData.shelf_life ? rowData.shelf_life + " " + translate(localeJson, 'days_before') : ""}
                </div>
            )
        },
        {
            field: 'stockpile_image',
            header: translate(localeJson, 'header_stockpile_image'),
            minWidth: "5rem",
            alignHeader: "center",
            body: (rowData) => (
                <div style={{ textAlign: "center" }}>
                    {(rowData.stockpile_image && rowData.stockpile_image != "") ?
                        <img src={rowData.stockpile_image}
                            width={'20px'}
                            height={'20px'}
                            alt={"img" + rowData.id}
                            onClick={() => {
                                setSelectedImage(rowData.stockpile_image);
                                setToggleImageModal(true);
                                hideOverFlow();
                            }} /> : ""
                    }
                </div>
            ),
        },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            minWidth: "5rem",
            className: "action_class",
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
                                hideOverFlow()
                            },
                        }} parentClass={"edit-button"} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "delete-button ml-2",
                            onClick: () => openDeleteDialog(rowData)
                        }} parentClass={"delete-button"} />
                </>
            ),
        }
    ];
    const [registerModalAction, setRegisterModalAction] = useState('');
    const [currentEditObj, setCurrentEditObj] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [deleteObj, setDeleteObj] = useState(null);

    const openDeleteDialog = (rowdata) => {
        setDeleteId(rowdata.product_id);
        setDeleteObj({
            firstLabel: translate(localeJson, 'header_product_name'),
            firstValue: rowdata.product_name,
            secondLabel: translate(localeJson, 'header_category'),
            secondValue: rowdata.category
        });
        setDeleteOpen(true);
        hideOverFlow();
    }

    const hideOverFlow = () => {
        document.body.style.overflow = 'hidden';
    }

    const showOverFlow = () => {
        document.body.style.overflow = 'auto';
    }

    const onDeleteClose = (action = "close") => {
        if (action == "confirm") {
            setTableLoading(true);
            StockpileService.delete(deleteId, (resData) => {
                onGetMaterialListOnMounting()
            });
        }
        setDeleteOpen(false);
        showOverFlow();
    };

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
        setTableLoading(true);
        onGetMaterialListOnMounting();
        values && callDropDownApi();
    };

    const [importPlaceOpen, setImportPlaceOpen] = useState(false);

    const onStaffImportClose = () => {
        setImportPlaceOpen(false);
        showOverFlow();
    };

    const importFileApi = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        StockpileService.importData(formData, (file) => {
            if (file) {
                setTableLoading(true);
                onGetMaterialListOnMounting();
            }
        });
        onStaffImportClose();
        showOverFlow();
    }

    //Listing start
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            order_by: "desc",
            sort_by: "category"
        },
        category: "",
        product_name: ""
    });

    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList, exportData } = StockpileService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
        };
        fetchData();
        callDropDownApi();
    }, [locale, getListPayload]);

    /**
     * Get dashboard list on mounting
     */
    const onGetMaterialListOnMounting = () => {
        // Get dashboard list
        getList(getListPayload, (response) => {
            var preparedList = [];
            var listTotalCount = 0;
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        id: i + getListPayload.filters.start + 1,
                        product_id: obj.product_id ?? "",
                        product_name: obj.product_name ?? "",
                        category: obj.category ?? "",
                        // shelf_life: obj.shelf_life ? obj.shelf_life + " " + translate(localeJson, 'days_before') : "",
                        shelf_life: obj.shelf_life ?? "",
                        stockpile_image: obj.stockpile_image ?? "",
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

    const closeImageModal = () => {
        setToggleImageModal(false);
        showOverFlow();
    }

    return (
        <>
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={onGetMaterialListOnMounting}
                deleteObj={deleteObj}
            />
            <StockpileSummaryImageModal
                open={toggleImageModal}
                close={closeImageModal}
                imageUrl={selectedImage}
            ></StockpileSummaryImageModal>
            <StockpileCreateEditModal
                open={emailSettingsOpen}
                close={onEmailSettingsClose}
                register={onRegister}
                refreshList={onGetMaterialListOnMounting}
                registerModalAction={registerModalAction}
                currentEditObj={{ ...currentEditObj }}
                categories={categories}
            />
            <AdminManagementImportModal
                open={importPlaceOpen}
                close={onStaffImportClose}
                importFile={importFileApi}
                register={onRegister}
                modalHeaderText={translate(localeJson, "stockpile_csv_import")}
            />

            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "stockpile_management_header")} />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    rounded: "true",
                                    import: true,
                                    buttonClass: "evacuation_button_height import-button",
                                    text: translate(localeJson, 'import'),
                                    onClick: () => { setImportPlaceOpen(true); hideOverFlow(); },
                                }} parentClass={"mr-1 mt-1 import-button"} />
                                <Button buttonProps={{
                                    rounded: "true",
                                    export: true,
                                    buttonClass: "evacuation_button_height export-button",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => {
                                        exportData({
                                            "filters": {
                                                "order_by": "desc",
                                                "sort_by": "updated_at" // default:created_at, category 
                                            },
                                            "category": selectedCategory,
                                            "product_name": selectedProductName
                                        })
                                    }
                                }} parentClass={"mr-1 mt-1 export-button"} />

                                <Button buttonProps={{
                                    create: true,
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height create-button",
                                    text: translate(localeJson, 'stockpile_management_create_button'),
                                    onClick: () => {
                                        setRegisterModalAction("create");
                                        setCurrentEditObj({ category: "", product_name: "", shelf_life: "" });
                                        setEmailSettingsOpen(true);
                                        hideOverFlow();
                                    },
                                }} parentClass={"mt-1 create-button"} />
                            </div>
                            <div>
                                <form >
                                    <div className='modal-field-top-space modal-field-bottom-space flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input ' >
                                        <InputDropdown inputDropdownProps={{
                                            inputDropdownParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-14rem mobile-input",
                                            labelProps: {
                                                text: translate(localeJson, 'search_category'),
                                                inputDropdownLabelClassName: "block"
                                            },
                                            inputDropdownClassName: "w-full lg:w-13rem md:w-14rem sm:w-14rem",
                                            inputId: "category_search",
                                            customPanelDropdownClassName: "w-10rem",
                                            options: categories,
                                            editable: true,
                                            value: selectedCategory,
                                            onChange: (e) => {
                                                if (e.value == "--") {
                                                    setSelectedCategory("")
                                                } else {
                                                    setSelectedCategory(e.value)
                                                }
                                            },
                                            emptyMessage: translate(localeJson, "data_not_found"),
                                        }}
                                        />
                                        <InputDropdown inputDropdownProps={{
                                            inputDropdownParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-14rem mobile-input",
                                            labelProps: {
                                                text: translate(localeJson, 'search_product_name'),
                                                inputDropdownLabelClassName: "block"
                                            },
                                            inputDropdownClassName: "w-full lg:w-13rem md:w-14rem sm:w-14rem",
                                            inputId: "product_name_search",
                                            customPanelDropdownClassName: "w-10rem",
                                            options: productNames,
                                            value: selectedProductName,
                                            onChange: (e) => {
                                                if (e.value == "--") {
                                                    setSelectedProductName("")
                                                } else {
                                                    setSelectedProductName(e.value)
                                                }
                                            },
                                            emptyMessage: translate(localeJson, "data_not_found"),
                                        }}
                                        />
                                        <div className='flex align-items-end'>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button",
                                                type: 'submit',
                                                icon: "pi pi-search",
                                                text: translate(localeJson, 'stockpile_search_button'),
                                                rounded: "true",
                                                onClick: (e) => {
                                                    e.preventDefault();
                                                    setGetListPayload({
                                                        ...getListPayload,
                                                        category: selectedCategory, product_name: selectedProductName
                                                    })
                                                }
                                            }}
                                                parentClass={"search-button"}
                                            />
                                        </div>
                                    </div>
                                </form>
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
                                    onSort={(data) => {
                                        setGetListPayload({
                                            ...getListPayload,
                                            filters: {
                                                ...getListPayload.filters,
                                                order_by: getListPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
                                            }
                                        }
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}