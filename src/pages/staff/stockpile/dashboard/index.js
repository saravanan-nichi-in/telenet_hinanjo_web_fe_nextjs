import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getEnglishDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, getValueByKeyRecursively as translate } from "@/helper";
import { Button, NormalTable } from '@/components';
import { AdminManagementImportModal, StaffStockpileCreateModal, StaffStockpileEditModal, StockpileSummaryImageModal } from '@/components/modal';
import { StockpileStaffService } from '@/services/stockpilestaff.service';
import { StockpileService } from '@/services/stockpilemaster.service';

function StockpileDashboard() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    const router = useRouter();
    const [staffStockpileCreateOpen, setStaffStockpileCreateOpen] = useState(false);
    const [staffStockpileEditOpen, setStaffStockpileEditOpen] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [importStaffStockpileOpen, setImportStaffStockpileOpen] = useState(false);
    const [image, setImage] = useState('');
    const [editObject, setEditObject] = useState({});
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const [categories, setCategories] = useState(["食料"]);
    const [productNames, setProductNames] = useState([]);

    const onStaffStockpileCreateSuccess = () => {
        staffStockpileCreateOpen(false);
        staffStockpileEditOpen(false);
    };

    const onRegister = (values) => {
        setImportStaffStockpileOpen(false);
    }

    const callDropDownApi = () => {
        let tempProducts = [];
        let payload = {
            place_id : layoutReducer?.user?.place?.id
        }
        StockpileStaffService.dropdown(payload, (response) => {
            const data = response.data.model;
            let tempCategories = new Set();
            data.forEach((value) => {
                tempCategories.add(value.category);
            })
            console.log([...tempCategories], tempProducts);
            setCategories([...tempCategories]);
        });
    }

    const importFileApi = (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('place_id', layoutReducer?.user?.place?.id);
        StockpileStaffService.importData(formData, () => {

        });
        setImportStaffStockpileOpen(false);
    }


    const columns = [
        { field: 'slno', header: translate(localeJson, 's_no'), className: "sno_class" },
        { field: 'category', header: translate(localeJson, 'product_type'), sortable: true, minWidth: "5rem" },
        { field: 'product_name', header: translate(localeJson, 'product_name'), minWidth: "7rem" },
        { field: 'after_count', header: translate(localeJson, 'quantity'), minWidth: "5rem" },
        { field: 'Inspection_date_time', header: translate(localeJson, 'inventory_date'), minWidth: "8rem" },
        { field: 'incharge', header: translate(localeJson, 'confirmer'), minWidth: "5rem" },
        { field: 'expiryDate', header: translate(localeJson, 'expiry_date'), minWidth: "8rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), minWidth: "5rem" },
        { field: "stock_pile_image", header: translate(localeJson, 'image'), textAlign: "center", minWidth: "4rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'edit'),
            textAlign: "center",
            minWidth: "7rem",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'edit'),
                        buttonClass: "text-primary ",
                        onClick: () => {
                            setEditObject(rowData);
                            console.log(rowData);
                            setStaffStockpileEditOpen(true);
                        },
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                    }} />
                </div>
            ),
        },
    ];

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
        getList(getListPayload, (response) => {
            if (response.success && !_.isEmpty(response.data) && response.data.model.total > 0) {
                const data = response.data.model.list;
                // var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        summary_id: obj.id ?? "",
                        hinan_id: obj.hinan_id ?? "",
                        before_count: obj.before_count ?? "",
                        after_count: obj.after_count ?? "",
                        incharge: obj.incharge ?? "",
                        remarks: obj.remarks ?? "",
                        expiry_date:obj.expiry_date?new Date(obj.expiry_date):"",
                        expiryDate: obj.expiry_date ? getJapaneseDateDisplayYYYYMMDDFormat(obj.expiry_date) : "",
                        history_flag: obj.history_flag ?? "",
                        category: obj.category ?? "",
                        shelf_life: obj.shelf_life ?? "",
                        stock_pile_image: obj.stockpile_image ? <AiFillEye style={{ fontSize: '20px' }} onClick={() => {bindImageModalData(obj.stockpile_image)}} /> : <AiFillEyeInvisible style={{ fontSize: '20px' }} />,
                        product_name: obj.product_name ?? "",
                        Inspection_date_time: obj.Inspection_date_time ? getJapaneseDateDisplayYYYYMMDDFormat(obj.Inspection_date_time) : "",
                        save_flag: false
                    }
                    preparedList.push(preparedObj);
                })

                setStockPileList(preparedList);
                // setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setStockPileList([]);
            }

        });
    }

    const bindImageModalData = (image) => {
        setImage(image)
        setImageModal(true)
    }

    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 5,
            "sort_by": "category",
            "order_by": "asc"
        },
        place_id: layoutReducer?.user?.place?.id,
    });

    // const [columns, setColumns] = useState([]);
    const [stockPileList, setStockPileList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    const updateStockPileBufferList = (data, id) => {
        let updatedList = stockPileList.map(stock =>{ return stock });
        let index = stockPileList.findIndex((item)=> item.summary_id == id);
        alert(updatedList.length);
        if(index !== -1) {
            data['expiry_date'] = getEnglishDateDisplayFormat(data.expiry_date);
            data['Inspection_date_time'] = getEnglishDateDisplayFormat(data.Inspection_date_time);
            data['save_flag'] = true
            updatedList.splice(index, 1);
            updatedList.unshift(data);
            let newSortedList = updatedList.map((item, i)=> {
                item['slno'] = i + getListPayload.filters.start + 1;
                return item;
            })
            console.log(newSortedList);
            setStockPileList(newSortedList);
            setStaffStockpileEditOpen(false);
        }
    }

    const bulkUpdateStockPileData = () => {
        StockpileStaffService.update(stockPileList, (response)=>{
            console.log(response);
            onGetMaterialListOnMounting();
        })
    }

    const checkForEditedStockPile = (screenFlag) => {
        const index = stockPileList.findIndex(obj => obj['save_flag'] === true);
        console.log(stockPileList, index)
        if(index == -1){
            if(screenFlag == "history"){
                router.push("/staff/stockpile/history")
            }
            if(screenFlag == "import"){
                setImportStaffStockpileOpen(true)
            }
            if(screenFlag == "toTop"){
                router.push('/staff/dashboard')
            }
        }
        else{
            let result = window.confirm(translate(localeJson, 'alert_info_for_unsaved_contents'));
            if(result){
                if(screenFlag == "history"){
                    router.push("/staff/stockpile/history")
                }
                if(screenFlag == "import"){
                    setImportStaffStockpileOpen(true)
                }
                if(screenFlag == "toTop"){
                    router.push('/staff/dashboard')
                }
            }
        }
    }


    /* Services */
    const { getList, exportData } = StockpileStaffService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
            callDropDownApi()
            setLoader(false);
        };
        fetchData();
         
    }, [locale, getListPayload]);


    return (
        <>
            <StaffStockpileEditModal
                open={staffStockpileEditOpen}
                header={translate(localeJson, 'edit_product')}
                close={() => setStaffStockpileEditOpen(false)}
                buttonText={translate(localeJson, 'save')}
                editObject={{ ...editObject }}
                setEditObject={setEditObject}
                onstaffStockpileCreateSuccess={onStaffStockpileCreateSuccess}
                categories={categories}
                onUpdate={updateStockPileBufferList}
                refreshList={onGetMaterialListOnMounting}
            />
            <StaffStockpileCreateModal
                open={staffStockpileCreateOpen}
                header={translate(localeJson, 'add_stockpile')}
                close={() => setStaffStockpileCreateOpen(false)}
                buttonText={translate(localeJson, 'save')}
                onstaffStockpileCreateSuccess={onStaffStockpileCreateSuccess}
                categories={categories}
                refreshList={onGetMaterialListOnMounting}
            />
            <StockpileSummaryImageModal
                open={imageModal}
                image={image}
                close={() => setImageModal(false)}
            />
            <AdminManagementImportModal
                open={importStaffStockpileOpen}
                close={() => setImportStaffStockpileOpen(false)}
                register={onRegister}
                importFile={importFileApi}
                modalHeaderText={translate(localeJson, 'staff_management_inventory_import_processing')}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'stockpile_list')}</h5>
                        <hr />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'stockpile_history'),
                                    severity: "primary",
                                    onClick: () => checkForEditedStockPile("history")
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    onClick: () => checkForEditedStockPile("import"),
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => {
                                        exportData(getListPayload);
                                    },
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'add_stockpile'),
                                    severity: "success",
                                    onClick: () => setStaffStockpileCreateOpen(true),
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div className="mt-3">
                                <NormalTable
                                    lazy
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    stripedRows={true}
                                    className={"custom-table-cell"}
                                    showGridlines={"true"}
                                    value={stockPileList}
                                    columns={columns}
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
                            <div className="text-center mt-3">
                                <Button buttonProps={{
                                    buttonClass: "text-600 w-8rem",
                                    bg: "bg-white",
                                    hoverBg: "hover:surface-500 hover:text-white",
                                    text: translate(localeJson, 'back_to_top'),
                                    onClick: () => checkForEditedStockPile("toTop"),
                                }} parentClass={"inline"} />
                                <Button buttonProps={{
                                    buttonClass: "w-8rem",
                                    type: "button",
                                    severity: "primary",
                                    text: translate(localeJson, 'inventory'),
                                    onClick: () => bulkUpdateStockPileData()
                                }} parentClass={"inline pl-2"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StockpileDashboard;