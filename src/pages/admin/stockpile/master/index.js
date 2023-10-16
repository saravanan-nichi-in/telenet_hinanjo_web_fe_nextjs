import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import _ from 'lodash';

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, NormalTable, SelectFloatLabel } from '@/components';

import { AdminManagementDeleteModal, AdminManagementImportModal, StockpileSummaryImageModal } from '@/components/modal';
import StockpileCreateEditModal from '@/components/modal/stockpileCreateEditModal';
import { StockpileService } from '@/services/stockpilemaster.service';
import { historyPageCities } from '@/utils/constant';

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
            let tempProducts = [""];
            let tempCategories = new Set();
            data.forEach((value, index) => {
                tempProducts.push(value.product_name);
                tempCategories.add(value.category);
            })
            console.log([...tempCategories], tempProducts);
            setCategories(["", ...tempCategories]);
            setProductNames(tempProducts);
        });
    }

    const columnsData = [
        { field: 'id', header: translate(localeJson, 'header_slno'), minWidth: "5rem" },
        { field: 'category', header: translate(localeJson, 'header_category'), minWidth: "10rem" },
        { field: 'product_name', header: translate(localeJson, 'header_product_name'), minWidth: "10rem" },
        { field: 'shelf_life', header: translate(localeJson, 'header_shelf_life'), minWidth: "10rem" },
        {
            field: 'stockpile_image',
            header: translate(localeJson, 'header_stockpile_image'),
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    {(rowData.stockpile_image && rowData.stockpile_image != "") ?
                        <FaEye style={{ fontSize: '20px' }} onClick={() => {
                            setSelectedImage(rowData.stockpile_image);
                            setToggleImageModal(true)
                        }} />
                        : <FaEyeSlash style={{ fontSize: '20px' }} />}
                </div>
            ),
        },
        {
            field: 'actions',
            header: translate(localeJson, 'header_action'),
            minWidth: "10rem",
            body: (rowData) => (
                <>
                    <Button parentStyle={{ display: "inline" }} buttonProps={{
                        text: translate(localeJson, 'edit'), buttonClass: "text-primary",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => {
                            setRegisterModalAction("edit")
                            setCurrentEditObj(rowData)
                            setEmailSettingsOpen(true)
                        },
                    }} />
                    <Button parentStyle={{ display: "inline" }} buttonProps={{
                        text: translate(localeJson, 'delete'), 
                        buttonClass: "text-primary ml-2",
                        bg: "bg-red-600 text-white",
                        severity: "danger",
                        hoverBg: "hover:bg-red-500 hover:text-white",
                        onClick: () => openDeleteDialog(rowData.product_id)
                    }} />
                </>
            ),
        }
    ];

    const [registerModalAction, setRegisterModalAction] = useState('');
    const [currentEditObj, setCurrentEditObj] = useState('');

    const [deleteId, setDeleteId] = useState(null);

    const openDeleteDialog = (id) => {
        setDeleteId(id);
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
    };

    /**
     * Register email related information
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEmailSettingsOpen(false);
    };

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
        StockpileService.importData(formData, () => {

        });
        onStaffImportClose();
    }

    //Listing start
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 7,
            order_by: "",
            sort_by: ""
        },
        category: "",
        product_name: ""
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList, exportData, getCategoryAndProductList } = StockpileService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
            setLoader(false);
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
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        id: i + 1,
                        product_id: obj.product_id ?? "",
                        product_name: obj.product_name ?? "",
                        category: obj.category ?? "",
                        shelf_life: obj.shelf_life ?? "",
                        stockpile_image: obj.stockpile_image ?? "",
                        // actions: action(obj)
                    }
                    preparedList.push(preparedObj);
                })

                setList(preparedList);
                setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
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

    const closeImageModal = () => {
        setToggleImageModal(false);
    }

    return (
        <>
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={onGetMaterialListOnMounting}
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
                modalHeaderText={translate(localeJson, "shelter_csv_import")}
            />

            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <section className='col-12'>
                            <h5 className='page-header1'>{translate(localeJson, 'stockpile_management_header')}</h5>
                            <DividerComponent />
                            <div>
                                <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                    <Button buttonProps={{
                                        rounded: "true",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'import'),
                                        severity: "primary",
                                        onClick: () => setImportPlaceOpen(true),
                                    }} parentClass={"mr-1 mt-1"} />
                                    <Button buttonProps={{
                                        rounded: "true",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'export'),
                                        severity: "primary",
                                        onClick: () => {
                                            exportData({
                                                "filters": {
                                                    "order_by": "desc",
                                                    "sort_by": "created_at" // default:created_at, category 
                                                },
                                                "category": selectedCategory,
                                                "product_name": selectedProductName
                                            })
                                        }
                                    }} parentClass={"mr-1 mt-1"} />

                                    <Button buttonProps={{
                                        rounded: "true",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'signup'),
                                        onClick: () => {
                                            setRegisterModalAction("create");
                                            setCurrentEditObj({ category: "", product_name: "", shelf_life: "" });
                                            setEmailSettingsOpen(true);

                                        },
                                        severity: "success"
                                    }} parentClass={"mr-1 mt-1"} />
                                </div>
                                <div>
                                    <form >
                                        <div className='mt-5 mb-3 flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow align-items-center justify-content-end gap-2 mobile-input ' >
                                            <div>
                                                <SelectFloatLabel selectFloatLabelProps={{
                                                    inputId: "category_search",
                                                    selectClass: "w-full lg:w-13rem md:w-14rem sm:w-14rem",
                                                    options: categories,
                                                    value: selectedCategory,
                                                    onChange: (e) => setSelectedCategory(e.value),
                                                    text: translate(localeJson, "search_category"),
                                                    custom: "mobile-input custom-select"
                                                }} parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-14rem" />
                                            </div>
                                            <div >
                                                <SelectFloatLabel selectFloatLabelProps={{
                                                    inputId: "product_name_search",
                                                    selectClass: "w-full lg:w-13rem md:w-14rem sm:w-14rem",
                                                    options: productNames,
                                                    value: selectedProductName,
                                                    onChange: (e) => setSelectedProductName(e.value),
                                                    text: translate(localeJson, "search_product_name"),
                                                    custom: "mobile-input custom-select"
                                                }} parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-14rem" />
                                            </div>
                                            <div className='pb-1'>
                                                <Button buttonProps={{
                                                    buttonClass: "evacuation_button_height",
                                                    type: 'submit',
                                                    text: translate(localeJson, 'update'),
                                                    rounded: "true",
                                                    severity: "primary",
                                                    onClick: (e) => {
                                                        e.preventDefault();
                                                        setGetListPayload({
                                                            ...getListPayload,
                                                            category: selectedCategory, product_name: selectedProductName
                                                        })
                                                    }
                                                }} parentStyle={{ paddingLeft: "10px" }} />

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
                                        columns={columns}
                                        filterDisplay="menu"
                                        emptyMessage="No data found."
                                        paginator={true}
                                        first={getListPayload.filters.start}
                                        rows={getListPayload.filters.limit}
                                        paginatorLeft={true}
                                        onPageHandler={(e) => onPaginationChange(e)}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )
}