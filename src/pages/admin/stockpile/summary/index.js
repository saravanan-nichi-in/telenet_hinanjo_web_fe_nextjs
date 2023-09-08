import React, { useState, useEffect } from 'react';
import { DividerComponent, RowExpansionTable } from '@/components';
import { StockpileSummaryService } from '@/helper/adminStockpileSummaryService';
import { FaEyeSlash } from 'react-icons/fa';

function AdminStockpileSummary() {
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