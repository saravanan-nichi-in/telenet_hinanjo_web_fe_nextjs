import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate, getGeneralDateTimeDisplayFormat } from "@/helper";
import { DateCalendarFloatLabel } from '@/components/date&time';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { StockpileHistoryServices } from '@/services';

function StockpileHistory() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const [inspectionDateTime, setInspectionDateTime] = useState("");
    const [productTypes, setProductTypes] = useState([]);
    const [productType, setProductType] = useState("");
    const [productNames, setProductNames] = useState([]);
    const [productName, setProductName] = useState("");
    const [inCharge, setInCharge] = useState("");
    const columnsData = [
        { field: 'number', header: translate(localeJson, 's_no'), headerClassName: "custom-header", className: "sno_class", textAlign: 'center' },
        { field: 'created_at', header: translate(localeJson, 'working_date'), headerClassName: "custom-header", minWidth: "7rem", textAlign: 'left' },
        { field: 'inspection_date_time', header: translate(localeJson, 'inventory_date'), headerClassName: "custom-header", minWidth: "7rem", textAlign: 'left' },
        { field: 'category', header: translate(localeJson, 'product_type'), headerClassName: "custom-header", sortable: true, minWidth: "5rem", textAlign: 'left' },
        { field: 'product_name', header: translate(localeJson, 'product_name'), headerClassName: "custom-header", minWidth: "7rem", textAlign: 'left' },
        { field: 'before_count', header: translate(localeJson, 'quantity_before'), headerClassName: "custom-header", minWidth: "5rem", textAlign: "right", alignHeader: "center" },
        { field: 'after_count', header: translate(localeJson, 'quantity_after'), headerClassName: "custom-header", minWidth: "5rem", textAlign: "right", alignHeader: "center" },
        { field: 'incharge', header: translate(localeJson, 'confirmer'), headerClassName: "custom-header", minWidth: "5rem", textAlign: 'left' },
        { field: 'expiry_date', header: translate(localeJson, 'expiry_date'), headerClassName: "custom-header", minWidth: "7rem", textAlign: 'left' },
        { field: 'remarks', header: translate(localeJson, 'remarks'), headerClassName: "custom-header", textAlign: 'left' },
    ];
    const [getHistoryListPayload, setGetHistoryListPayload] = useState({
        filters: {
            start: 0,
            limit: 5,
            order_by: "desc"
        },
        place_id: !_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "",
        Inspection_date_time: "",
        category: "",
        product_name: "",
        incharge: ""
    });
    const [tableLoading, setTableLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    /* Services */
    const { getProductTypes, getProductNames, getHistoryList } = StockpileHistoryServices;

    useEffect(() => {
        const fetchData = async () => {
            await retrieveProductTypes();
            await retrieveProductNames();
        };
        fetchData();
    }, [locale]);

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            retrieveHistoryList();
        };
        fetchData();
    }, [locale, getHistoryListPayload]);

    /**
     * Retrieve product types
     */
    const retrieveProductTypes = () => {
        let payload = {
            place_id: !_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : ""
        }
        getProductTypes(payload, (response) => {
            let productTypesArray = [
                {
                    name: "--",
                    product_name: "",
                    category: ""
                }
            ];
            if (response.data && response.data.data) {
                const data = response.data.data;
                data.map((obj, i) => {
                    let preparedObj = {
                        name: obj.category,
                        product_name: obj.product_name,
                        category: obj.category,
                    }
                    productTypesArray.push(preparedObj);
                })
            }
            setProductTypes(productTypesArray);
        });
    }

    /**
     * Retrieve product names
     */
    const retrieveProductNames = () => {
        let payload = {
            place_id: !_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : ""
        }
        getProductNames(payload, (response) => {
            console.log(response);
            let productNamesArray = [
                {
                    name: "--",
                    product_id: "",
                    category: "",
                    product_name: ""
                }
            ];
            if (response.data && response.data.model) {
                const data = response.data.model;
                data.map((obj, i) => {
                    let preparedObj = {
                        name: obj.product_name,
                        product_id: obj.product_id,
                        category: obj.category,
                        product_name: obj.product_name
                    }
                    productNamesArray.push(preparedObj);
                })
            }
            setProductNames(productNamesArray);
        });
    }

    /**
     * Get history list
     */
    const retrieveHistoryList = () => {
        getHistoryList(getHistoryListPayload, onGetHistoryList);
    }

    /**
     * Function will get data & update history list
     * @param {*} response 
     */
    const onGetHistoryList = (response) => {
        var additionalColumnsArrayWithOldData = [...columnsData];
        var preparedList = [];
        var totalCount;
        console.log(response.data.total);
        if (response.success && !_.isEmpty(response.data) && response.data.total > 0) {
            const data = response.data.list;
            // Preparing row data for specific column to display
            data.map((obj, i) => {
                let preparedObj = {
                    number: getHistoryListPayload.filters.start + i + 1,
                    created_at: obj.created_at,
                    inspection_date_time: obj.Inspection_date_time,
                    category: obj.category,
                    product_name: obj.product_name,
                    before_count: obj.before_count,
                    after_count: obj.after_count,
                    incharge: obj.incharge,
                    expiry_date: obj.expiry_date,
                    remarks: obj.remarks
                }
                preparedList.push(preparedObj);
            })
            // Update total count
            totalCount = response.data.total;
        }
        // Update prepared list to the state
        setColumns(additionalColumnsArrayWithOldData);
        setList(preparedList);
        setTotalCount(totalCount);
        setTableLoading(false);
        setLoader(false);
    }

    /**
     * Search functionality
     */
    const onSearchButtonClick = async () => {
        setTableLoading(true);
        if (!_.isEmpty(inspectionDateTime) || !_.isEmpty(productType) || !_.isEmpty(productName) || !_.isEmpty(inCharge)) {
            await setGetHistoryListPayload(prevState => ({
                ...prevState,
                place_id: !_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "",
                Inspection_date_time: inspectionDateTime ? getGeneralDateTimeDisplayFormat(inspectionDateTime) : "",
                category: productType.category,
                product_name: productName.product_name,
                incharge: inCharge
            }));
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
            await setGetHistoryListPayload(prevState => ({
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
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'stockpile_history')}</h5>
                    <hr />
                    <div>
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                    <DateCalendarFloatLabel
                                        dateFloatLabelProps={{
                                            dateClass: "w-full",
                                            id: "inventoryDate",
                                            placeholder: "yyyy-mm-dd",
                                            text: translate(
                                                localeJson,
                                                "inventory_date"
                                            ),
                                            value: inspectionDateTime,
                                            onChange: (e) => setInspectionDateTime(e.target.value)
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem" />
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            inputSelectClass: "w-20rem lg:w-14rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'product_type'),
                                            options: productTypes,
                                            optionLabel: "name",
                                            value: productType,
                                            onChange: (e) => setProductType(e.target.value),
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            inputSelectClass: "w-20rem lg:w-14rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'product_name'),
                                            options: productNames,
                                            optionLabel: "name",
                                            value: productName,
                                            onChange: (e) => setProductName(e.target.value),
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'confirmer'),
                                            custom: "mobile-input custom_input",
                                            value: inCharge,
                                            onChange: (e) => setInCharge(e.target.value)
                                        }}
                                    />
                                    <div className="">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input ",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            severity: "primary",
                                            type: "button",
                                            onClick: () => onSearchButtonClick()
                                        }} />
                                    </div>
                                </div>
                            </form>
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
                                    paginator={_.size(list) > 0 ? true : false}
                                    first={getHistoryListPayload.filters.start}
                                    rows={getHistoryListPayload.filters.limit}
                                    paginatorLeft={true}
                                    onPageHandler={(e) => onPaginationChange(e)}
                                    onSort={(data) => {
                                        setTableLoading(true);
                                        setGetHistoryListPayload({
                                            ...getHistoryListPayload,
                                            filters: {
                                                ...getHistoryListPayload.filters,
                                                order_by: getHistoryListPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockpileHistory;