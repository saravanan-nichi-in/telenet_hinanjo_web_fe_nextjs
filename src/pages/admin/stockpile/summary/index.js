import React, { useState, useEffect, useContext } from 'react';
import { DividerComponent, RowExpansionTable, Button, InputIcon, NormalLabel, InputSelect } from '@/components';
import { StockpileSummaryService } from '@/helper/adminStockpileSummaryService';
import { FaEyeSlash } from 'react-icons/fa';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';

function AdminStockpileSummary() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const outerColumn = [
        { field: "避難所", header: "避難所", minWidth: "10rem" },
        { field: "通知先", header: "通知先" },
    ]

    const innerColumn = [
        { field: "種別", header: "種別" },
        { field: "備蓄品名", header: "備蓄品名" },
        { field: "数量", header: "有効期限" },
        {
            field: 'actions',
            header: '画像',
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <FaEyeSlash style={{ fontSize: '20px' }} />
                </div>
            ),
        },
    ]

    const [stockpileSummary, setStockpileSummary] = useState([]);

    useEffect(() => {
        StockpileSummaryService.getStockpileSummaryWithOrdersSmall().then((data) => setStockpileSummary(data));
    }, []);



    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>
                            備蓄品集計
                        </h5>
                        <DividerComponent />
                        <div >
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <form>
                                    <div className="pt-3 ">
                                        <div className='pb-1'>
                                            <NormalLabel labelClass="pt-1" text={"避難所"} />
                                        </div>
                                        <InputSelect dropdownProps={{
                                            inputSelectClass: "create_input_stock",
                                            optionLabel: "name"
                                        }}
                                        />
                                        {/* <InputIcon inputIconProps={{
                                            inputClass: "create_input_stock"
                                        }} /> */}
                                    </div>
                                    <div className='flex pt-3 pb-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                        <div >
                                            <Button buttonProps={{
                                                buttonClass: "evacuation_button_height",
                                                type: 'submit',
                                                text: "検索",
                                                rounded: "true",
                                                severity: "success"
                                            }} parentStyle={{ paddingLeft: "10px" }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <RowExpansionTable rows={10} rowExpansionColumnStyle={{ textAlign: 'center' }} columnStyle={{ textAlign: 'center' }} paginator="true" customRowExpansionActionsField="actions" value={stockpileSummary} innerColumn={innerColumn} outerColumn={outerColumn} rowExpansionField="orders" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AdminStockpileSummary;