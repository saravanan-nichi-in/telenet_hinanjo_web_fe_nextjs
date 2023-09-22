import React, { useRef, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DetailModal, DividerComponent } from '@/components';

const sampleProducts = [
    { "避難所": "Vacant Test", "Test1(2)": "505", "Test2(2)": "3"},
    { "避難所": "Starting to get Crowded", "Test1(2)": "201", "Test2(2)": "16" },
    { "避難所": "crowded", "Test1(2)": "2999993", "Test2(2)": "6" },
    { "避難所": "避難所B", "Test1(2)": "980766", "Test2(2)": "1"},
    { "避難所": "Nara", "Test1(2)": "3981574", "Test2(2)": "33"}
]

function ShoratgeSupplies() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [lockedSupplies, setLockedSupplies] = useState([]);

    const onRowClick = (event) => {
        console.log(event.data);
        setSelectedRow(event.data.避難所)
        setShowModal(true);
    };

    const dt = useRef(null);
    const [products, setProducts] = useState([]);

    const cols = [
        { field: '避難所', header: '避難所', minWidth: '20rem' },
        { field: 'Test1(2)', header: 'Test1(2)', minWidth: '12rem' },
        { field: 'Test2(2)', header: 'Test2(2)', minWidth: '12rem' }
    ];

    useEffect(() => {
        setProducts(sampleProducts);
        setLockedSupplies([
            {
              "避難所": "不足合計",
              "Test1(2)": "3981574",
              "Test2(2)": "33",
            }
          ]);
    }, [])

    const rowClass = (data) => {
        return {
            'last-row': data.避難所 === '不足合計',
            'font-bold': data.避難所 === '不足合計',
            // 'text-higlight':data.避難所 === '日本の避難所',
            'clickable-row': data.避難所 === '不足合計' ? false : true,
        };
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const headContent = (
        <div>
            <h2 style={{ fontSize: "16px" }}>{selectedRow}</h2>
        </div>
    )
    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'shortage_supplies_list')}</h5>
                        <hr />
                        {/* <DividerComponent /> */}
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
                                responsiveLayout="scroll"
                                dataKey="id"
                                className="p-datatable-gridlines"
                                showGridlines
                                rows={5}
                                rowClassName={rowClass}
                                frozenValue={lockedSupplies}
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
                                {cols.map((col, index) => (
                                    <Column key={index} field={col.field} sortable header={col.header} style={{
                                        minWidth: col.minWidth && col.minWidth,
                                        textAlign: 'center',
                                    }}
                                    alignHeader={'center'}
                                    body={(rowData) => {
                                        console.log(col.field);
                                        if (col.field === '避難所') {
                                            return (
                                                <span className={rowData[col.field] === 'Nara' ? 'text-higlight' : ''}>
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
                    onHide: () => setShowModal(false),
                    value1: "food",
                    value2: "chain"
                }} />
            </div>
        </div>
    );
}

export default ShoratgeSupplies;