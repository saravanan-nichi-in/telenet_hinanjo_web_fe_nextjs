import React, { useContext, useEffect, useState } from 'react'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { DateCalendarFloatLabel } from '@/components/date&time';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { StaffStockpileHistoryService } from '@/helper/staffStockpileHistoryService';
import { productName_options, productType_options } from '@/utils/constant';

function StockpileHistory() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [staffStockpileHistoryValues, setStaffStockpileHistoryValues] = useState([]);
    const [productType, setProductType] = useState(productType_options[0])
    const [productName, setProductName] = useState(productName_options[0])

    const staffStockpileHistory = [
        { field: 'id', header: translate(localeJson, 's_no'), className: "sno_class", },
        { field: 'working_date', header: translate(localeJson, 'working_date') },
        { field: 'inventory_date', header: translate(localeJson, 'inventory_date') },
        { field: 'product_type', header: translate(localeJson, 'product_type') },
        { field: 'product_name', header: translate(localeJson, 'product_name') },
        { field: 'quantity_before', header: translate(localeJson, 'quantity_before') },
        { field: 'quantity_after', header: translate(localeJson, 'quantity_after') },
        { field: 'confirmer', header: translate(localeJson, 'confirmer') },
        { field: 'expiry_date', header: translate(localeJson, 'expiry_date') },
        { field: 'remarks', header: translate(localeJson, 'remarks') },

    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        StaffStockpileHistoryService.getStaffStockpileHistoryMedium().then((data) => setStaffStockpileHistoryValues(data));
        fetchData();
    }, []);

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
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem" />
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            id: "productType",
                                            optionLabel: "name",
                                            value: productType,
                                            options: productType_options,
                                            onChange: (e) => setProductType(e.value),
                                            inputSelectClass: "w-20rem lg:w-14rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'product_type')
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            id: "productName",
                                            optionLabel: "name",
                                            value: productName,
                                            options: productName_options,
                                            onChange: (e) => setProductName(e.value),
                                            inputSelectClass: "w-20rem lg:w-14rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'product_name')
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            id: 'confirmer',
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'confirmer'),
                                            custom: "mobile-input custom_input",
                                        }}
                                    />
                                    <div className="">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input ",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            severity: "primary",
                                            type: "button",
                                        }} />
                                    </div>
                                </div>
                            </form>
                            <div className="mt-3">
                                <NormalTable
                                    customActionsField="actions"
                                    value={staffStockpileHistoryValues} 
                                    columns={staffStockpileHistory}
                                    showGridlines={"true"}
                                    stripedRows={true}
                                    paginator={"true"}
                                    columnStyle={{ textAlign: "center" }}
                                    className={"custom-table-cell"}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginatorLeft={true}
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