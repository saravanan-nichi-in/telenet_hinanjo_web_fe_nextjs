import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getEnglishDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, hideOverFlow, showOverFlow, getValueByKeyRecursively as translate } from "@/helper";
import { Button, NormalTable } from '@/components';
import { AdminManagementDeleteModal, AdminManagementImportModal, StaffStockpileCreateModal, StaffStockpileEditModal, StockpileSummaryImageModal } from '@/components/modal';
import { StockpileStaffService } from '@/services/stockpilestaff.service';
import CustomHeader from '@/components/customHeader';
import { setStaffEditedStockpile } from "@/redux/stockpile";
import { useAppDispatch } from "@/redux/hooks";

function StockpileDashboard() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    const storeData = useSelector((state) => state.stockpileReducer);
    const router = useRouter();
    const [staffStockpileCreateOpen, setStaffStockpileCreateOpen] = useState(false);
    const [staffStockpileEditOpen, setStaffStockpileEditOpen] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [importStaffStockpileOpen, setImportStaffStockpileOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [editObject, setEditObject] = useState({});
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [productNames, setProductNames] = useState({});
    const [productNameOptions, setProductNameOptions] = useState([]);
    const [disableRowSelection, setDisableRowSelection] = useState(false);
    const [editedStockPile, setEditedStockPile] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteObj, setDeleteObj] = useState(null);
    const dispatch = useAppDispatch();

    /* Services */
    const { getList, exportData, getPlaceNamesByCategory, deleteByID } = StockpileStaffService;

    const onStaffStockCreated = () => {
        staffStockpileCreateOpen(false);
        staffStockpileEditOpen(false);
        let dataMapping = productNames;
        stockPileList.map((obj) => {
            if (dataMapping[`${obj.category}`].includes(obj.product_name)) {
                const indexToRemove = dataMapping[`${obj.category}`].indexOf(obj.product_name);
                dataMapping[`${obj.category}`].splice(indexToRemove, 1);
            }
        });
        setProductNames(dataMapping);
    };

    const onRegister = (values) => {
        setImportStaffStockpileOpen(false);
        showOverFlow();
    }

    const callDropDownApi = (stockList) => {
        let payload = {
            place_id: layoutReducer?.user?.place?.id
        }
        StockpileStaffService.dropdown(payload, (response) => {
            const data = response.data.model;
            let tempCategories = new Set();
            data.forEach((value) => {
                tempCategories.add(value.category);
            })
            let dataMapping = {};
            data.map((stock) => {
                let products = data.filter((item) => stock.category === item.category);
                if (stock.category in dataMapping) {
                    return;
                }
                let productNames = products.map(obj => obj.product_name);
                dataMapping[`${stock.category}`] = productNames;
            });
            stockList.map((obj) => {
                if (dataMapping[`${obj.category}`].includes(obj.product_name)) {
                    const indexToRemove = dataMapping[`${obj.category}`].indexOf(obj.product_name);
                    dataMapping[`${obj.category}`].splice(indexToRemove, 1);
                }
            })
            setCategories([...tempCategories]);
            // setProductNames(dataMapping);
        });
    }

    const importFileApi = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('place_id', layoutReducer?.user?.place?.id);
        StockpileStaffService.importData(formData, () => {
            setImportStaffStockpileOpen(false);
            showOverFlow();
            setTableLoading(true);
            onGetMaterialListOnMounting();

        });
    }

    const columns = [
        { field: 'slno', header: translate(localeJson, 's_no'), className: "sno_class", textAlign: "center" },
        { field: 'category', header: translate(localeJson, 'product_type'), sortable: true, minWidth: "5rem" },
        { field: 'product_name', header: translate(localeJson, 'product_name'), minWidth: "12rem" },
        { field: 'after_count', header: translate(localeJson, 'quantity'), minWidth: "5rem", textAlign: "center", alignHeader: "center" },
        { field: 'InspectionDateTime', header: translate(localeJson, 'inventory_date'), minWidth: "10rem" },
        { field: 'incharge', header: translate(localeJson, 'confirmer'), minWidth: "5rem" },
        { field: 'expiryDate', header: translate(localeJson, 'expiry_date'), minWidth: "10rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), minWidth: "5rem" },
        { field: "stock_pile_image", header: translate(localeJson, 'image'), textAlign: "center", minWidth: "4rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => (
                <div>
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "edit-button",
                            onClick: () => {
                                setEditObject(rowData);
                                setSelectedCategory(rowData.category)
                                setStaffStockpileEditOpen(true);
                                hideOverFlow();
                            },
                        }} parentClass={"edit-button"} />
                    <Button
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "delete-button-user ml-2",
                            onClick: () => openDeleteDialog(rowData)
                        }} parentClass={"delete-button-user"} />
                </div>
            ),
        },
    ];

    /**
     * Delete modal open handler
     * @param {*} rowdata 
     */
    const openDeleteDialog = (rowdata) => {
        setDeleteId(rowdata.product_id);
        setDeleteObj({
            firstLabel: translate(localeJson, 'product_name'),
            firstValue: rowdata.product_name,
            secondLabel: translate(localeJson, 'product_type'),
            secondValue: rowdata.category
        });
        setDeleteOpen(true);
        hideOverFlow();
    }

    /**
     * On confirmation delete api call and close modal functionality handler
     * @param {*} status 
     */
    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            console.log(deleteId);
            let payload = [
                {
                    place_id: layoutReducer?.user?.place?.id,
                    product_ids: [deleteId]
                },
            ]
            deleteByID(payload, (response) => {
                if (response) {
                    if (storeData?.staffEditedStockpile.length > 0) {
                        const filteredArray = storeData?.staffEditedStockpile.filter(item => item.product_id !== deleteId);
                        const filteredEditedStockPileArray = editedStockPile.filter(item => item.product_id !== deleteId);
                        dispatch(setStaffEditedStockpile(filteredArray));
                        setEditedStockPile(filteredEditedStockPileArray);
                    }
                    onGetMaterialListOnMounting();
                }
            })
        }
        setDeleteOpen(false);
        showOverFlow();
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
     * Get dashboard list on mounting
     */
    const onGetMaterialListOnMounting = () => {
        // Get dashboard list
        setTableLoading(true);
        getList(getListPayload, (response) => {
            let preparedList = [];
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        summary_id: obj.id ?? "",
                        hinan_id: obj.hinan_id ?? "",
                        before_count: obj.before_count ?? "",
                        after_count: obj.after_count ?? 0,
                        incharge: obj.incharge ?? "",
                        remarks: obj.remarks ?? "",
                        expiry_date: obj.expiry_date ? new Date(obj.expiry_date) : "",
                        expiryDate: obj.expiry_date ? (locale === "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(obj.expiry_date) : getEnglishDateDisplayFormat(obj.expiry_date)) : "",
                        history_flag: obj.history_flag ?? "",
                        category: obj.category ?? "",
                        shelf_life: obj.shelf_life ?? "",
                        stock_pile_image: obj.stockpile_image ? <img style={{ cursor: "pointer" }} src={obj.stockpile_image} width={'20px'} height={'20px'} alt={"img" + i} onClick={() => {
                            setDisableRowSelection(true);
                            bindImageModalData(obj.stockpile_image);
                        }}
                        /> : "",
                        product_name: obj.product_name ?? "",
                        Inspection_date_time: obj.Inspection_date_time ? new Date(obj.Inspection_date_time) : "",
                        InspectionDateTime: obj.Inspection_date_time ? (locale === "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(obj.Inspection_date_time) : getEnglishDateDisplayFormat(obj.Inspection_date_time)) : "",
                        save_flag: false,
                        product_id: obj.product_id
                    }
                    let findEditedIndex = editedStockPile.findIndex((item) => item.summary_id == obj.id);
                    if (findEditedIndex !== -1) {
                        let editedObject = editedStockPile[findEditedIndex];
                        preparedList.push(editedObject)
                    }
                    else {
                        preparedList.push(preparedObj);
                    }
                })
                setStockPileList(preparedList);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setStockPileList([]);
            }
            callDropDownApi(preparedList);
        });
    }

    const bindImageModalData = (image) => {
        setImage(image)
        setImageModal(true)
        hideOverFlow();
    }

    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 10,
            "sort_by": "category",
            "order_by": "desc"
        },
        place_id: layoutReducer?.user?.place?.id,
    });

    const [stockPileList, setStockPileList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    const updateStockPileBufferList = (data, id) => {
        let updatedList = stockPileList.map(stock => { return stock });
        let index = stockPileList.findIndex((item) => item.summary_id == id);
        if (index !== -1) {
            updatedList[index] = data;
            updatedList[index]['expiry_date'] = new Date(data.expiry_date);
            updatedList[index]['expiryDate'] = getJapaneseDateDisplayYYYYMMDDFormat(data.expiry_date);
            updatedList[index]['Inspection_date_time'] = new Date(data.Inspection_date_time);
            updatedList[index]['InspectionDateTime'] = getJapaneseDateDisplayYYYYMMDDFormat(data.Inspection_date_time)
            updatedList[index]['save_flag'] = true
            setStockPileList(updatedList);
            setStaffStockpileEditOpen(false);
            showOverFlow();
            setSelectedCategory("");
            if (editedStockPile.length > 0) {
                let loopEditedList = [...editedStockPile]
                let editedIndex = editedStockPile.findIndex((item) => item.summary_id == id);
                if (editedIndex !== -1) {
                    loopEditedList.splice(editedIndex, 1);
                    loopEditedList.push(updatedList[index])
                    setEditedStockPile(loopEditedList);
                    dispatch(setStaffEditedStockpile(loopEditedList));
                }
                else {
                    setEditedStockPile([...editedStockPile, updatedList[index]])
                    dispatch(setStaffEditedStockpile([...editedStockPile, updatedList[index]]));
                }

            }
            else {
                setEditedStockPile([...editedStockPile, updatedList[index]])
                dispatch(setStaffEditedStockpile([...editedStockPile, updatedList[index]]));
            }
        }
    }

    const bulkUpdateStockPileData = () => {
        let updatedList = stockPileList.filter((item) => item.save_flag === true);
        let newUpdatedList = [...editedStockPile, ...updatedList].filter(
            (obj, index, array) => array.findIndex((o) => o.summary_id === obj.summary_id) === index
        );
        if (newUpdatedList.length > 0) {
            const payloadUpdatedList = newUpdatedList.map((stock) => ({
                ...stock,
                'Inspection_date_time': getEnglishDateDisplayFormat(stock.Inspection_date_time),
                'expiry_date': getEnglishDateDisplayFormat(stock.expiry_date)
            }));
            StockpileStaffService.update(payloadUpdatedList, (response) => {
                setEditedStockPile([]);
                dispatch(setStaffEditedStockpile([]));
                onGetMaterialListOnMounting();
            })
        }
    }

    const checkForEditedStockPile = (screenFlag) => {
        if (editedStockPile.length == 0) {
            if (screenFlag == "history") {
                router.push("/staff/stockpile/history")
            }
            if (screenFlag == "import") {
                setImportStaffStockpileOpen(true)
                hideOverFlow();
            }
            if (screenFlag == "toTop") {
                router.push('/staff/dashboard')
            }
        }
        else {
            let result = window.confirm(translate(localeJson, 'alert_info_for_unsaved_contents'));
            if (result) {
                if (screenFlag == "history") {
                    router.push("/staff/stockpile/history")
                }
                if (screenFlag == "import") {
                    setImportStaffStockpileOpen(true)
                }
                if (screenFlag == "toTop") {
                    router.push('/staff/dashboard')
                }
            }
        }
    }

    const updateCategoryChange = (value) => {
        setSelectedCategory(value);
    }

    const updatePlaceNameOptionsByCategory = (value) => {
        let payload = {
            category: value,
            place_id: layoutReducer?.user?.place?.id
        }
        getPlaceNamesByCategory(payload, (response) => {
            if (response?.success && response?.data?.model?.length > 0) {
                const data = response.data.model;
                setProductNameOptions(data);
            }
        })
    }

    const rowClassName = (rowData) => {
        return rowData.save_flag === true ? 'highlight-row' : "";
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
            setLoader(false);
        };
        fetchData();

    }, [locale, getListPayload]);

    return (
        <>
            <StaffStockpileEditModal
                open={staffStockpileEditOpen}
                header={translate(localeJson, 'edit_product')}
                close={() => {
                    setStaffStockpileEditOpen(false)
                    showOverFlow();
                }}
                buttonText={translate(localeJson, 'save')}
                editObject={{ ...editObject }}
                setEditObject={setEditObject}
                categories={categories}
                products={productNames[`${selectedCategory}`]}
                onUpdate={updateStockPileBufferList}
                refreshList={onGetMaterialListOnMounting}
            />
            <StaffStockpileCreateModal
                open={staffStockpileCreateOpen}
                header={translate(localeJson, 'add_stockpile_c')}
                close={() => {
                    setStaffStockpileCreateOpen(false);
                    showOverFlow();
                    setProductNameOptions([]);
                }}
                buttonText={translate(localeJson, 'save')}
                createdStock={onStaffStockCreated}
                categories={categories}
                products={productNames[`${selectedCategory}`]}
                onCategoryChange={updatePlaceNameOptionsByCategory}
                refreshList={onGetMaterialListOnMounting}
                productNameOptions={productNameOptions}
            />
            <StockpileSummaryImageModal
                open={imageModal}
                imageUrl={image}
                close={() => {
                    setDisableRowSelection(false);
                    setImageModal(false);
                    showOverFlow();
                }}
            />
            <AdminManagementImportModal
                open={importStaffStockpileOpen}
                close={() => {
                    setImportStaffStockpileOpen(false)
                    showOverFlow();
                }}
                importFile={importFileApi}
                modalHeaderText={translate(localeJson, 'staff_management_inventory_import_processing')}
            />
            <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
                refreshList={onGetMaterialListOnMounting}
                deleteObj={deleteObj}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "stockpile_list")} />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    import: true,
                                    onClick: () => checkForEditedStockPile("import"),
                                    buttonClass: "evacuation_button_height import-button-white-bg",
                                    text: translate(localeJson, 'import'),
                                }} parentClass={"mr-1 import-button-white-bg"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    export: true,
                                    buttonClass: "evacuation_button_height export-button-white-bg",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => {
                                        exportData(getListPayload);
                                    },
                                }} parentClass={"mr-1  export-button-white-bg"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    create: true,
                                    buttonClass: "evacuation_button_height create-button",
                                    text: translate(localeJson, 'add_stockpile'),
                                    onClick: () => {
                                        setStaffStockpileCreateOpen(true)
                                        hideOverFlow();
                                    }
                                }} parentClass={"mr-1 primary-button"} />
                            </div>
                            <div className="mt-3">
                                <NormalTable
                                    lazy
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    stripedRows={true}
                                    showGridlines={"true"}
                                    value={stockPileList}
                                    columns={columns}
                                    rowClassName={rowClassName}
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
                                    parentClass={"custom-table"}
                                />
                            </div>
                            <div className="text-center mt-3">
                                <Button buttonProps={{
                                    buttonClass: "w-8rem update-button",
                                    type: "button",
                                    text: translate(localeJson, 'inventory'),
                                    onClick: () => bulkUpdateStockPileData()
                                }} parentClass={"inline pl-2 update-button"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StockpileDashboard;