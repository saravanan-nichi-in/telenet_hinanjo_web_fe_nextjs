import React, { useRef, useState, useEffect, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DetailModal } from '@/components';
import { suppliesShortageData, suppliesShortageHeaderColumn } from '@/utils/constant';

/**
 * Display list of supplies shortage in the various `避難所` 
 * @returns Table view
 */

function ShoratgeSupplies() {
    const {localeJson } = useContext(LayoutContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [lockedSupplies, setLockedSupplies] = useState([]);
    const dt = useRef(null);
    const [products, setProducts] = useState([]);
    const headContent = (
        <div>
            <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>{selectedRow}</h2>
        </div>
    )

    useEffect(() => {
        setProducts(suppliesShortageData);
        setLockedSupplies([
            {
              "避難所": "不足合計",
              "Test1(2)": "3981574",
              "Test2(2)": "33",
            }
          ]);
    }, [])

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const onRowClick = (event) => {
        if(event.data.避難所 == "不足合計"){
            return;
        }
        else {
            setSelectedRow(event.data.避難所)
            setShowModal(true);
        }
    };

    const rowClass = (data) => {
        return {
            'last-row': data.避難所 === '不足合計',
            'font-bold': data.避難所 === '不足合計',
            'clickable-row': data.避難所 === '不足合計' ? false : true,
        };
    };
    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'shortage_supplies_list')}</h5>
                        <hr />
                        <div className="col-12">
                            <div className="flex justify-content-end ">
                            <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => exportCSV(false)
                                }} parentClass={"mb-3"} />
                            </div>
                            <DataTable
                                ref={dt}
                                value={products}
                                scrollable
                                dataKey="id"
                                className="p-datatable-gridlines"
                                showGridlines
                                rows={5}
                                rowClassName={rowClass}
                                frozenValue={lockedSupplies}
                                frozenWidth='3'
                                emptyMessage="No customers found."
                                style={{
                                    fontSize: "14px",
                                }}
                                size={"small"}
                                stripedRows
                                onRowClick={onRowClick}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            >
                                {suppliesShortageHeaderColumn.map((col, index) => (
                                    <Column key={index} field={col.field} sortable header={col.header} style={{
                                        minWidth: col.minWidth && col.minWidth,
                                        textAlign: 'center',
                                    }}
                                    alignHeader={'center'}
                                    
                                    body={(rowData) => {
                                        console.log(col.field);
                                        if (col.field === '避難所') {
                                            return (
                                                <span className={rowData[col.field] === 'Nara' ? 'text-higlight' : ''} onClick={()=>setSelectedRow(rowData[col.field])}>
                                                    {rowData[col.field]}
                                                </span>
                                            );
                                        } else {
                                            return rowData[col.field];
                                        }
                                    }} />
                                ))}
                            </DataTable>
                        </div>
                    </section>

                </div>
            </div>
            <div>
                <DetailModal detailModalProps={{
                    headerContent: headContent,
                    visible: showModal,
                    style:{ width: '600px' },
                    position: 'top',
                    onHide: () => setShowModal(false),
                    value1: "無し",
                    value2: "無し"
                }} />
            </div>
        </div>
    );
}

export default ShoratgeSupplies;