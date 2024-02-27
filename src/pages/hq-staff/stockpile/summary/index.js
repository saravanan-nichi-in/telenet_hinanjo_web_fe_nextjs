import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { RowExpansionTable, Button, InputSwitch } from '@/components';
import {
    getEnglishDateDisplayFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getYYYYMMDDHHSSSSDateTimeFormat,
    hideOverFlow,
    showOverFlow,
    getValueByKeyRecursively as translate
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { StockPileSummaryMailSettingsModal, StockpileSummaryImageModal, AdminManagementImportModal } from '@/components/modal';

import { StockPileSummaryServices } from '@/services/stockpile_summary.services';
import Link from 'next/link';
import CustomHeader from '@/components/customHeader';
import { InputDropdown } from '@/components/input';

function HQStockpileSummary() {
    const { locale, localeJson } = useContext(LayoutContext);
    const [emailModal, setEmailModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [stockpileSummaryList, setStockpileSummaryList] = useState([]);
    const [filteredStockpileSummaryList, setFilteredStockpileSummaryList] = useState([]);
    const [placeListOptions, setPlaceListOptions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [expandRows, setExpandRows] = useState();
    const [tableLoading, setTableLoading] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
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
            limit: 100,
            order_by: "asc",
            sort_by: "created_at"
        },
        search: ""
    });
    const stockPilerMainRow = [
        { field: "place_id", header: translate(localeJson, 'id'), display: 'none' },
        {
            field: 'shelter_place', header: translate(localeJson, 'evacuation_place'), headerStyle: { display: 'none' }, paddingLeft: 0, minWidth: "3rem", maxWidth: '10rem', textAlign: "left",
            body: (rowData) => (
                <div className='text-link'>
                    <a className='font-bold text-black-alpha-10' onClick={() => bindEmailDataConfig(rowData)}>
                        {rowData['shelter_place']}
                    </a>
                </div>
            )
        },
    ]
    const stockPileRowExpansionColumn = [
        { field: "type", header: translate(localeJson, 'product_type'), minWidth: "7rem", maxWidth: "7rem" },
        { field: "stock_pile_name", header: translate(localeJson, 'product_name'), minWidth: "10rem", maxWidth: "10rem" },
        { field: "quantity", header: translate(localeJson, 'quantity'), textAlign: "center", alignHeader: "center" },
        { field: "expiry_date", header: translate(localeJson, 'expiration_date'), display: 'none' },
        { field: "expiration_date", header: translate(localeJson, 'expiration_date'), sortable: true, textAlign: 'left', alignHeader: "left" },
        { field: "stock_pile_image", header: '', textAlign: "center", alignHeader: "center", minWidth: "5rem" }
    ];
    const bindImageModalData = (image) => {
        setImageUrl(image);
        setImageModal(true);
        hideOverFlow();
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetStockPileSummaryListOnMounting();
            await onGetPlaceDropdownListOnMounting();
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
                    hideOverFlow();
                }
                else {
                    let emailData = {
                        email: "",
                        place_name: rowData.shelter_place.props.children,
                        place_id: rowData.place_id
                    };
                    setEmailSettingValues(emailData);
                    setEmailModal(true);
                    hideOverFlow();
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
            hideOverFlow();
        }
    };


    /**
    * Image setting modal close
   */
    const onImageModalClose = () => {
        setImageModal(!imageModal);
        showOverFlow();
    };
    /**
    * Email setting modal close
   */
    const onEmailModalClose = () => {
        setEmailModal(!emailModal);
        showOverFlow();
    };
    /**
     * 
     * @param {*} values 
     */
    const onRegister = (values) => {
        const emailList = values.email.split(",");
        if (Object.keys(values.errors).length == 0 && values.email) {
            let payload = {
                email: [values.email],
                place_id: emailSettingValues.place_id
            }
            let emailData = {
                email: emailList,
                place_name: values.place_name,
                place_id: emailSettingValues.place_id
            }

            getStockPileEmailUpdate(payload, (response) => {
                setEmailSettingValues(emailData);
                getSummaryList(getListPayload, onGetStockPileSummaryList);
                setEmailModal(false);
                showOverFlow();
            });
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
        var stockPileList = [];
        var _expandedRows = {};
        var listTotalCount = 0;
        if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
            const data = response.data.model.list;
            let index = 1;
            data.map((item, increment) => {
                let summaryList = {
                    id: index,
                    place_id: item.place_id,
                    shelter_place: <Link href="">{item.name}</Link>,
                    notification_email: item.email,
                    orders: [{
                        type: item.category,
                        stock_pile_name: item.product_name,
                        quantity: item.after_count,
                        expiry_date: item.expiry_date ? locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(item.expiry_date) : getEnglishDateTimeDisplayActualFormat(item.expiry_date) : "",
                        expiration_date: item.expiry_date ? locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(item.expiry_date) : getEnglishDateDisplayFormat(item.expiry_date) : "",
                        stock_pile_image: item.stockpile_image ? <img style={{ cursor: "pointer" }} src={item.stockpile_image} width={'20px'} height={'20px'} alt={"img" + increment} onClick={() => bindImageModalData(item.stockpile_image)} /> : ""
                    }],
                }
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
                            expiration_date: item.expiry_date ? locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(item.expiry_date) : getEnglishDateDisplayFormat(item.expiry_date) : "",
                            stock_pile_image: item.stockpile_image ? <img style={{ cursor: "pointer" }} src={item.stockpile_image} width={'20px'} height={'20px'} alt={"img" + increment} onClick={() => bindImageModalData(item.stockpile_image)} /> : ""
                        }
                        stockPileList[index].orders.push(newOrder);
                    }
                }
            });
            stockPileList.forEach((p) => (_expandedRows[`${p.id}`] = true));
            listTotalCount = response.data.model.total
        }
        setTableLoading(false);
        setStockpileSummaryList(stockPileList);
        setFilteredStockpileSummaryList(stockPileList);
        setExpandRows(_expandedRows);
        setTotalCount(listTotalCount);
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
        getStockPileEmailUpdate, getStockPileEmailData, exportData, importData } = StockPileSummaryServices;

    const onImportModalClose = () => {
        setImportModalOpen(false);
        showOverFlow();
    };

    const callExport = () => {
        exportData(() => { })
    }

    const importFileApi = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        importData(formData, (response) => {
            if (response) {
                setTableLoading(true);
                onGetStockPileSummaryListOnMounting();
                onGetPlaceDropdownListOnMounting();
                setShowExpiringProducts(false);
            }
        });
        onImportModalClose();
    }

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
            <AdminManagementImportModal
                open={importModalOpen}
                close={onImportModalClose}
                importFile={importFileApi}
                modalHeaderText={translate(localeJson, "hq_stockpile_summary_import")}
                tag={'hq-stockpile'}
                callExport={callExport}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <div className='flex justify-content-between align-items-center'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "stockpile_summary")} />
                        </div>
                        <div>
                            <div class="mb-3" >
                                <div>
                                    <div className="flex w-full" style={{ justifyContent: "end" }}>
                                        <Button buttonProps={{
                                            type: 'button',
                                            rounded: "true",
                                            import: true,
                                            onClick: () => {
                                                setImportModalOpen(true);
                                                hideOverFlow();
                                            },
                                            buttonClass: "evacuation_button_height import-button",
                                            text: translate(localeJson, 'import'),
                                        }} parentClass={"mr-1 mt-1 import-button"} />
                                        <Button buttonProps={{
                                            type: 'button',
                                            rounded: "true",
                                            export: true,
                                            onClick: () => {
                                                callExport();
                                            },
                                            buttonClass: "evacuation_button_height export-button",
                                            text: translate(localeJson, 'hq_stockpile_detail_export'),
                                        }} parentClass={"mr-1 mt-1 export-button"} />
                                        <Button buttonProps={{
                                            type: "button",
                                            rounded: "true",
                                            export: true,
                                            buttonClass: "export-button",
                                            text: translate(localeJson, 'hq_stockpile_summary_export'),
                                            severity: "primary",
                                            onClick: () => downloadStockPileSummaryCSV()
                                        }} parentClass={"mr-1 mt-1 export-button"} />
                                    </div>
                                    <form>
                                        <div className='sm:flex md:flex lg:flex align-items-center justify-content-between mt-2'>
                                            <div class="flex gap-2 sm:pt-5 md:pt-5 lg:pt-5 align-items-end">
                                                <span className='text-sm pt-1'>{translate(localeJson, 'show_expiring_products')}</span><InputSwitch inputSwitchProps={{
                                                    checked: showExpiringProducts,
                                                    onChange: () => showOnlyExpiringProducts()
                                                }}
                                                    parentClass={"custom-switch"} />
                                            </div>
                                            <div className='modal-field-top-space modal-field-bottom-space flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input ' >
                                                <InputDropdown inputDropdownProps={{
                                                    inputDropdownParentClassName: "w-full xl:20rem lg:w-13rem md:w-14rem sm:w-14rem",
                                                    labelProps: {
                                                        text: translate(localeJson, 'place_name'),
                                                        inputDropdownLabelClassName: "block"
                                                    },
                                                    inputDropdownClassName: "w-full xl:20rem lg:w-13rem md:w-14rem sm:w-14rem",
                                                    customPanelDropdownClassName: "w-10rem",
                                                    id: "evacuationCity",
                                                    optionLabel: "name",
                                                    options: placeListOptions,
                                                    value: selectedPlaceName,
                                                    onChange: (e) => setSelectedPlaceName(e.value),
                                                    emptyMessage: translate(localeJson, "data_not_found"),
                                                }}
                                                />
                                                <div className='flex flex-wrap justify-content-end align-items-end gap-2'>
                                                    <Button buttonProps={{
                                                        buttonClass: "w-12 search-button",
                                                        text: translate(localeJson, "search_text"),
                                                        icon: "pi pi-search",
                                                        type: "button",
                                                        onClick: () => searchListWithCriteria()
                                                    }} parentClass={"search-button"} />

                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                    <div>
                                        <RowExpansionTable
                                            columnStyle={{ textAlign: 'left' }}
                                            className='stockpile-summary'
                                            paginator={false}
                                            totalRecords={totalCount}
                                            loading={tableLoading}
                                            rowClassName="main-row-header"
                                            customRowExpansionActionsField="actions"
                                            value={filteredStockpileSummaryList}
                                            innerColumn={stockPileRowExpansionColumn}
                                            outerColumn={stockPilerMainRow}
                                            rowExpansionField1="orders1"
                                            rowExpansionField="orders"
                                            emptyMessage={translate(localeJson, "data_not_found")}
                                            rowExpansionEmptyMessage={translate(localeJson, "data_not_found")}
                                            first={getListPayload.filters.start}
                                            rows={getListPayload.filters.limit}
                                            onRowExpand={expandRows}
                                            paginatorLeft={false}
                                            expandAllRows={true}
                                            onPageHandler={(e) => onPaginationChange(e)}
                                            iconStyle={{ marginTop: "-5px" }}
                                            iconHeaderStyle={{ display: 'none' }}
                                            innerTableSelectionMode="single"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HQStockpileSummary;
