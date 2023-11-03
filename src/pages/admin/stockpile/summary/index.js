import React, { useState, useEffect, useContext } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import _ from 'lodash';

import { RowExpansionTable, Button, InputSwitch } from '@/components';
import { getJapaneseDateDisplayFormat, getYYYYMMDDHHSSSSDateTimeFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { StockPileSummaryMailSettingsModal, StockpileSummaryImageModal } from '@/components/modal';

import { StockPileSummaryServices } from '@/services/stockpile_summary.services';
import Link from 'next/link';

function AdminStockpileSummary() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [emailModal, setEmailModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [stockpileSummaryList, setStockpileSummaryList] = useState([]);
    const [filteredStockpileSummaryList, setFilteredStockpileSummaryList] = useState([]);
    const [placeListOptions, setPlaceListOptions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [expandRows, setExpandRows] = useState();
    const [tableLoading, setTableLoading] = useState(false);
    const [selectedPlaceName, setSelectedPlaceName] = useState({
        name: "--",
        id: 0
    });
    const [emailSettingValues, setEmailSettingValues] = useState({
        email: "",
        place_name: "",
        place_id: ""
    });
    const [showExpiringProducts, setShowExpiringProducts] = useState(false);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            order_by: "asc",
            sort_by: "created_at"
        },
        search: ""
    });
    const stockPilerMainRow = [
        { field: "place_id", header: translate(localeJson, 'id'), display: 'none' },
        {
            field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem", maxWidth: '10rem', textAlign: "left",
            body: (rowData) => (
                <div className='text-link'>
                    <a className='text-decoration' style={{ color: "grren" }} onClick={() => bindEmailDataConfig(rowData)}>
                        {rowData['shelter_place']}
                    </a>
                </div>
            )
        },
        { field: "notification_email", header: translate(localeJson, 'notification_email'), minWidth: "10rem" },
    ]
    const stockPileRowExpansionColumn = [
        { field: "type", header: translate(localeJson, 'product_type') },
        { field: "stock_pile_name", header: translate(localeJson, 'product_name') },
        { field: "quantity", header: translate(localeJson, 'quantity') },
        { field: "expiry_date", header: translate(localeJson, 'expiration_date'), display: 'none' },
        { field: "expiration_date", header: translate(localeJson, 'expiration_date') },
        { field: "stock_pile_image", header: translate(localeJson, 'image'), textAlign: "center", minWidth: "5rem" }
    ];

    const bindImageModalData = (image) => {
        setImageUrl(imageBaseUrl + image);
        setImageModal(true);
    }

    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            setTableLoading(true);
            await onGetStockPileSummaryListOnMounting();
            await onGetPlaceDropdownListOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    const onGetStockPileSummaryListOnMounting = () => {
        getSummaryList(getListPayload, onGetStockPileSummaryList)
    }

    /**
     * Get Place Dropdown list on mounting
     */
    const onGetPlaceDropdownListOnMounting = () => {
        getPlaceDropdownList({}, onGetPlaceDropdownList);
    }

    const onGetPlaceDropdownList = (response) => {
        let placeList = [{
            name: "--",
            id: 0
        }];
        if (response.success && !_.isEmpty(response.data)) {
            const data = response.data.model;
            data.map((obj, i) => {
                let placeDropdownList = {
                    name: response.locale == 'ja' ? obj.name : obj.name,
                    id: obj.id
                }
                placeList.push(placeDropdownList)
            })
            setPlaceListOptions(placeList);
        }
    }

    const bindEmailDataConfig = (rowData) => {
        let payload = {
            place_id: rowData.place_id
        }
        if (rowData.notification_email) {
            getStockPileEmailData(payload, (response) => {
                if (response.success && !_.isEmpty(response.data)) {
                    const data = response.data.model;
                    let emailData = {
                        email: data.email,
                        place_name: rowData.shelter_place.props.children,
                        place_id: rowData.place_id
                    }
                    setEmailSettingValues(emailData);
                    setEmailModal(true);
                }
                else {
                    let emailData = {
                        email: "",
                        place_name: rowData.shelter_place.props.children,
                        place_id: rowData.place_id
                    };
                    setEmailSettingValues(emailData);
                    setEmailModal(true);
                }
            });
        }
        else {
            let emailData = {
                email: "",
                place_name: rowData.shelter_place.props.children,
                place_id: rowData.place_id
            };
            setEmailSettingValues(emailData);
            setEmailModal(true);
        }
    };


    /**
    * Image setting modal close
   */
    const onImageModalClose = () => {
        setImageModal(!imageModal);
    };
    /**
    * Email setting modal close
   */
    const onEmailModalClose = () => {
        setEmailModal(!emailModal);
    };
    /**
     * 
     * @param {*} values 
     */
    const onRegister = (values) => {
        const emailList = values.email.split(",");
        if (Object.keys(values.errors).length == 0 && values.email.length > 0) {
            let payload = {
                email: emailList,
                place_id: emailSettingValues.place_id
            }
            let emailData = {
                email: emailList,
                place_name: values.place_name,
                place_id: emailSettingValues.place_id
            }
            getStockPileEmailUpdate(payload);
            setEmailSettingValues(emailData);
            getSummaryList(getListPayload, onGetStockPileSummaryList);
            setEmailModal(false);
        }
    };

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: getListPayload.filters.start,
                limit: getListPayload.filters.limit,
                order_by: "asc",
                sort_by: "created_at"
            },
            search: selectedPlaceName.id != 0 ? selectedPlaceName.name : ""
        };
        getSummaryList(payload, onGetStockPileSummaryList);
    }

    const onGetStockPileSummaryList = (response) => {
        if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
            const data = response.data.model.list;
            let stockPileList = [];
            let index = 1;
            data.map((item) => {
                let summaryList = {
                    id: index,
                    place_id: item.place_id,
                    shelter_place: <Link href="">{item.name}</Link>,
                    notification_email: item.email,
                    orders: [{
                        type: item.category,
                        stock_pile_name: item.product_name,
                        quantity: item.after_count,
                        expiry_date: item.expiry_date,
                        expiration_date: item.expiry_date ? getJapaneseDateDisplayFormat(item.expiry_date) : "",
                        stock_pile_image: item.stockpile_image ? <AiFillEye style={{ fontSize: '20px' }} onClick={() => bindImageModalData(item.stockpile_image)} /> : <AiFillEyeInvisible style={{ fontSize: '20px' }} />
                    }],
                };
                let isAvailable = stockPileList.some(obj => obj.place_id == item.place_id);
                if (!isAvailable) {
                    index = index + 1
                    stockPileList.push(summaryList);
                }
                else {
                    const index = stockPileList.findIndex(obj => obj['place_id'] === item.place_id);
                    if (index !== -1) {
                        let newOrder = {
                            type: item.category,
                            stock_pile_name: item.product_name,
                            quantity: item.after_count,
                            expiry_date: item.expiry_date,
                            expiration_date: item.expiry_date ? getJapaneseDateDisplayFormat(item.expiry_date) : "",
                            stock_pile_image: item.stockpile_image ? <AiFillEye style={{ fontSize: '20px' }} onClick={() => bindImageModalData(item.stockpile_image)} /> : <AiFillEyeInvisible style={{ fontSize: '20px' }} />
                        }
                        stockPileList[index].orders.push(newOrder);
                    }
                }
            });
            let _expandedRows = {};
            stockPileList.forEach((p) => (_expandedRows[`${p.id}`] = true));
            setStockpileSummaryList(stockPileList);
            setFilteredStockpileSummaryList(stockPileList);
            setTotalCount(response.data.model.total);
            setTableLoading(false);
            setExpandRows(_expandedRows);
        }
        else {
            setTotalCount(0);
            setTableLoading(false);
            setStockpileSummaryList([]);
            setFilteredStockpileSummaryList([]);
        }
    }

    const downloadStockPileSummaryCSV = () => {
        let payload = {
            filters: {
                start: 0,
                limit: 50,
                order_by: "asc",
                sort_by: "created_at"
            },
            search: selectedPlaceName.id != 0 ? selectedPlaceName.name : ""
        }
        exportStockPileSummaryCSVList(payload, exportStockPileSummary);
    }

    const showOnlyExpiringProducts = () => {
        setShowExpiringProducts(!showExpiringProducts);
        if (!showExpiringProducts) {
            let dataManipulate = stockpileSummaryList.map(item => ({ ...item }));
            dataManipulate.map((item, index) => {
                let data = item.orders;
                let filteredDates = data.filter(obj => new Date(obj.expiry_date) > new Date());
                if (filteredDates.length > 0) {
                    let minDateAfterToday = filteredDates.reduce((min, current) =>
                        current.expiry_date < min.expiry_date ? current : min
                    );
                    let filteredProducts = data.filter(obj => obj.expiry_date == minDateAfterToday.expiry_date);
                    dataManipulate[index].orders = filteredProducts;
                }
                else {
                    dataManipulate[index].orders = [];
                }
            });
            setFilteredStockpileSummaryList(dataManipulate);
        }
        else {
            setFilteredStockpileSummaryList([...stockpileSummaryList]);
        }
    }

    const exportStockPileSummary = (response) => {
        if (response.success) {
            const downloadLink = document.createElement("a");
            const fileName = "StockPileSummaryExport" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
            downloadLink.href = response.result.filePath;
            downloadLink.download = fileName;
            downloadLink.click();
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
            await setGetListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                },
                search: selectedPlaceName.id != 0 ? selectedPlaceName.name : ""
            }));
        }
    }

    /* Services */
    const { getSummaryList, exportStockPileSummaryCSVList, getPlaceDropdownList,
        getStockPileEmailUpdate, getStockPileEmailData } = StockPileSummaryServices;

    return (
        <React.Fragment>
            <StockpileSummaryImageModal
                open={imageModal}
                close={onImageModalClose}
                imageUrl={imageUrl}
            />
            <StockPileSummaryMailSettingsModal
                open={emailModal}
                close={onEmailModalClose}
                register={onRegister}
                emailSettingValues={emailSettingValues}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>
                            {translate(localeJson, 'stockpile_summary')}
                        </h5>
                        <hr />
                        <div >
                            <div class="mb-3" >
                                <div class="summary_flex">
                                    {translate(localeJson, 'show_expiring_products')}<InputSwitch inputSwitchProps={{
                                        checked: showExpiringProducts,
                                        onChange: () => showOnlyExpiringProducts()
                                    }}
                                        parentClass={"custom-switch"} />
                                </div>
                                <div>
                                    <form>
                                        <div class="summary_flex_search float-right mt-5" >
                                            <div class="flex flex-row justify-content-end" >
                                                <InputSelectFloatLabel dropdownFloatLabelProps={{
                                                    text: translate(localeJson, 'shelter_place'),
                                                    inputId: "float label",
                                                    optionLabel: "name",
                                                    options: placeListOptions,
                                                    value: selectedPlaceName,
                                                    onChange: (e) => setSelectedPlaceName(e.value),
                                                    inputSelectClass: "w-full lg:w-13rem md:w-20rem sm:w-14rem"
                                                }} parentClass={"w-full xl:20rem lg:w-13rem md:w-14rem sm:w-14rem"}
                                                />

                                            </div>
                                            <div>
                                                <Button buttonProps={{
                                                    buttonClass: "w-12 search-button",
                                                    text: translate(localeJson, "search_text"),
                                                    icon: "pi pi-search",
                                                    severity: "primary",
                                                    type: "button",
                                                    onClick: () => searchListWithCriteria()
                                                }} />
                                            </div>
                                            <div class="flex justify-content-end">
                                                <Button buttonProps={{
                                                    type: "button",
                                                    rounded: "true",
                                                    buttonClass: "",
                                                    text: translate(localeJson, 'export'),
                                                    severity: "primary",
                                                    onClick: () => downloadStockPileSummaryCSV()
                                                }} parentClass={"mr-1 mt-2 mb-2"} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div>
                            { !tableLoading && <RowExpansionTable
                                columnStyle={{ textAlign: 'left' }}
                                paginator="true"
                                totalRecords={totalCount}
                                loading={tableLoading}
                                customRowExpansionActionsField="actions"
                                value={filteredStockpileSummaryList}
                                innerColumn={stockPileRowExpansionColumn}
                                outerColumn={stockPilerMainRow}
                                rowExpansionField1="orders1"
                                rowExpansionField="orders"
                                emptyMessage={translate(localeJson, "data_not_found")}
                                first={getListPayload.filters.start}
                                rows={getListPayload.filters.limit}
                                onRowExpand={expandRows}
                                paginatorLeft={true}
                                onPageHandler={(e) => onPaginationChange(e)}
                            /> }
                            
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AdminStockpileSummary;