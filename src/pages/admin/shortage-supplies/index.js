import React, { useRef, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Btn, DetailModal } from '@/components';


const sampleProducts = [
    { "避難所": "日本の避難所", "Test1(2)": "505", "Test2(2)": "3", "test3(3)": "2", "test6(5)": "1" },
    { "避難所": "広島市中区東白島町", "Test1(2)": "201", "Test2(2)": "16", "test3(3)": "9", "test6(5)": "0" },

    { "避難所": "テスト", "Test1(2)": "2999993", "Test2(2)": "6", "test3(3)": "6", "test6(5)": "0" },
    { "避難所": "避難所B", "Test1(2)": "980766", "Test2(2)": "1", "test3(3)": "1", "test6(5)": "0" },
    { "避難所": "不足合計", "Test1(2)": "3981574", "Test2(2)": "33", "test3(3)": "32", "test6(5)": "5" },
]

function ShoratgeSupplies() {
    const header = (
        <>
            <div>
                <h5 style={{
                    fontSize: "22px",
                    // borderBottom: "1px solid black",
                }}>日本の避難所</h5>


            </div>
            <hr />
        </>
    )

    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [showModal, setShowModal] = useState(false);

    const onRowClick = (event) => {
        setShowModal(true);
    };
    const dt = useRef(null);
    const [products, setProducts] = useState([]);
    const cols = [
        { field: '避難所', header: '避難所', minWidth: '20rem' },
        { field: 'Test1(2)', header: 'Test1(2)', minWidth: '12rem' },
        { field: 'Test2(2)', header: 'Test2(2)', minWidth: '12rem' },
        { field: 'test3(3)', header: 'Test3(3)', minWidth: '12rem' },
        { field: 'test6(5)', header: 'Test6(5)', minWidth: '12rem' },

    ];
    useEffect(() => {
        setProducts(sampleProducts);
    }, [])

    const rowClass = (data) => {
        return {


            'last-row': data.避難所 === '不足合計',
            'font-bold': data.避難所 === '不足合計',

            // 'text-higlight':data.避難所 === '日本の避難所',
            'clickable-row': true,
        };
    };


    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

  const headContent=(
    <div>
    <h2>日本の避難所</h2>
    </div>
  )  
    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>{translate(localeJson, 'shortage_supplies_list')}</h5>
                        <Divider />
                        {/* Table */}
                        <div className="col-12">
                            <div className="flex justify-content-end ">
                                <Btn parentClass={"mb-1"} btnProps={{
                                    text: translate(localeJson, 'export'),
                                    rounded: "true",
                                    onClick:() => exportCSV(false)
                                }}/>
                            </div>
                            {/* Table */}
                            &nbsp;

                            <DataTable
                                ref={dt}
                                value={products}
                                responsiveLayout="scroll"
                                dataKey="id"
                                className="p-datatable-gridlines"
                                showGridlines
                                rows={5}
                                rowClassName={rowClass}

                                emptyMessage="No customers found."
                                style={{
                                    fontSize: "18px",

                                }}
                                size={"small"}
                                stripedRows
                                onRowClick={onRowClick}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                            >

                                {cols.map((col, index) => (
                                    <Column key={index} field={col.field} header={col.header} sortable style={{
                                        minWidth: col.minWidth && col.minWidth,
                                        textAlign: 'center',
                                    }} body={(rowData) => {
                                        if (col.field === '避難所') {
                                            return (
                                                <span className={rowData[col.field] === '日本の避難所' ? 'text-higlight' : ''}>
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
                {/* <Dialog header={header} visible={showModal} onHide={() => setShowModal(false)} style={{ width: '600px', padding: "10px" }}>
                    <label className='w-full font-18 font-bold pt-0'>{translate(localeJson, 'Other_shortage_supplies')}</label><br />
                    <textarea className="w-full font-18 textarea-bgcolor" rows="5" readonly="">food</textarea>
                    <br /><br />
                    <label className='w-full font-18 font-bold pt-0'>{translate(localeJson, 'Other_shortage_supplies')}</label><br />
                    <textarea className="w-full font-18 textarea-bgcolor " rows="5" readonly="">Chain</textarea>

                </Dialog> */}
                <DetailModal detailModalProps={{
                    headerContent:headContent,
                    visible:showModal,
                    onHide:()=>setShowModal(false),
                    value1:"food",
                    value2:"chain"

                }}/>
            </div>
        </div>
    );
}

export default ShoratgeSupplies;
