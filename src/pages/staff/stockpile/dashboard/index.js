import React, { useContext, useEffect, useState } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, NormalTable } from '@/components';
import { AiFillEye } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { AdminManagementImportModal, StaffStockpileCreateModal, StaffStockpileEditModal, StockpileSummaryImageModal } from '@/components/modal';
import { StockpileStaffService } from '@/services/stockpilestaff.service';
import { useSelector } from 'react-redux';

function StockpileDashboard() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    const router = useRouter();
    const [staffStockpileCreateOpen, setStaffStockpileCreateOpen] = useState(false);
    const [staffStockpileEditOpen, setStaffStockpileEditOpen] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [importStaffStockpileOpen, setImportStaffStockpileOpen] = useState(false);
    const [image, setImage] = useState('');
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const onStaffStockpileCreateSuccess = () => {
        staffStockpileCreateOpen(false);
        staffStockpileEditOpen(false);
    };

    const onRegister = (values) => {
        setImportStaffStockpileOpen(false);
    }



    const columns = [
        { field: 'slno', header: translate(localeJson, 's_no'), className: "sno_class" },
        { field: 'category', header: translate(localeJson, 'product_type'), sortable: true, minWidth: "5rem" },
        { field: 'product_name', header: translate(localeJson, 'product_name'), minWidth: "7rem" },
        { field: 'after_count', header: translate(localeJson, 'quantity'), minWidth: "5rem" },
        { field: 'inventory_date', header: translate(localeJson, 'inventory_date'), minWidth: "7rem" },
        { field: 'confirmer', header: translate(localeJson, 'confirmer'), minWidth: "5rem" },
        { field: 'expiry_date', header: translate(localeJson, 'expiry_date'), minWidth: "7rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), minWidth: "5rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'image'),
            textAlign: "center",
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <AiFillEye onClick={() => {setImageModal(true)
                    setImage(rowData.stockpile_image)}} style={{ fontSize: '20px' }} />
                </div>
            ),
        },
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
                        onClick: () => setStaffStockpileEditOpen(true),
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
                        id: obj.id ?? "",
                        hinan_id: obj.hinan_id ?? "",
                        before_count: obj.before_count ?? "",
                        after_count: obj.after_count ?? "",
                        incharge: obj.incharge ?? "",
                        remarks: obj.remarks ?? "",
                        expiry_date: obj.expiry_date ?? "",
                        history_flag: obj.history_flag ?? "",
                        category: obj.category ?? "",
                        shelf_life: obj.shelf_life ?? "",
                        stockpile_image: obj.stockpile_image ?? "",
                        product_name: obj.product_name ?? "",
                    }
                    preparedList.push(preparedObj);
                })

                setList(preparedList);
                // setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setList([]);
            }

        });
    }

    const [getListPayload, setGetListPayload] = useState({
        "filters": {
        "start": 0,
        limit:5,
        "sort_by" : "category",
        "order_by" : "asc"
    },
    // place_id: layoutReducer?.user?.place?.id,
    place_id: 1
});

    // const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList, exportData } = StockpileStaffService;

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
                close={() => setStaffStockpileEditOpen(false)}
                buttonText={translate(localeJson, 'save')}
                onstaffStockpileCreateSuccess={onStaffStockpileCreateSuccess}
            />
            <StaffStockpileCreateModal
                open={staffStockpileCreateOpen}
                header={translate(localeJson, 'add_stockpile')}
                close={() => setStaffStockpileCreateOpen(false)}
                buttonText={translate(localeJson, 'save')}
                onstaffStockpileCreateSuccess={onStaffStockpileCreateSuccess}
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
                                    onClick: () => router.push("/staff/stockpile/history")
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    onClick: () => setImportStaffStockpileOpen(true),
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
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
                                        value={list}
                                        columns={columns}
                                        filterDisplay="menu"
                                        emptyMessage={translate(localeJson, "data_not_found")}
                                        paginator={true}
                                        first={getListPayload.filters.start}
                                        rows={getListPayload.filters.limit}
                                        paginatorLeft={true}
                                        onPageHandler={(e) => onPaginationChange(e)}
                                        onSort= {(data) => {
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
                                    onClick: () => router.push('/staff/dashboard'),
                                }} parentClass={"inline"} />
                                <Button buttonProps={{
                                    buttonClass: "w-8rem",
                                    type: "button",
                                    severity: "primary",
                                    text: translate(localeJson, 'inventory'),
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