import React, { useRef, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { getValueByKeyRecursively as translate } from '@/utils/functions'
import { LayoutContext } from '@/layout/context/layoutcontext';


const sampleProducts = [
    { "番号": "", "避難所": "合計", "避難可能人数": "66920人", "現在の避難者数": "2124人	", "避難者数": "15.77%", "避難中の世帯数": "443世帯", "個人情報なしの避難者数": "1555人", "男": "153人" },
    { "番号": "1", "避難所": "避難所A", "避難可能人数": "20000人", "現在の避難者数": "4078人", "避難者数": "20%", "避難中の世帯数": "62世帯", "個人情報なしの避難者数": "4000人", "男": "42人" },
    {
        "番号": "2", "避難所": "Test 広島市中区東白島町Test 広島市中区東白島町Test 広島市中区東白島町Test 広島市中区東白島町Test 広島市中区東白島町Test 広島市中区東白島町Test 広島市中区東白島町",
        "避難可能人数": "32000人", "現在の避難者数": "4007人", "避難者数": "12.5%", "避難中の世帯数": "7世帯", "個人情報なしの避難者数": "4000人", "男": "2人"
    },
    { "番号": "3", "避難所": "テスト", "避難可能人数": "100人", "現在の避難者数": "11人", "避難者数": "10%", "避難中の世帯数": "1世帯", "個人情報なしの避難者数": "10人", "男": "1人" },
    { "番号": "4", "避難所": "テスト日本大阪", "避難可能人数": "100人", "現在の避難者数": "99人", "避難者数": "99%", "避難中の世帯数": "0世帯", "個人情報なしの避難者数": "99人", "男": "0人" },
    { "番号": "5", "避難所": "sasdasdsad", "避難可能人数": "33人", "現在の避難者数": "0人", "避難者数": "0%", "避難中の世帯数": "0世帯", "個人情報なしの避難者数": "0人", "男": "0人" },
    { "番号": "6", "避難所": "ddsdsds", "避難可能人数": "33人", "現在の避難者数": "0人", "避難者数": "0%", "避難中の世帯数": "0世帯", "個人情報なしの避難者数": "0人", "男": "0人" },
]

function AdminDashboard() {

    const dt = useRef(null);
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const cols = [
        { field: '番号', header: '番号', minWidth: '8rem' },
        { field: '避難所', header: '避難所', minWidth: '15rem' },
        { field: '避難可能人数', header: '避難可能人数', minWidth: '15rem' },
        { field: '現在の避難者数', header: '現在の避難者数', minWidth: '15rem' },
        { field: '避難者数', header: '避難者数', minWidth: '15rem' },
        { field: '避難中の世帯数', header: '避難中の世帯数', minWidth: '15rem' },
        { field: '個人情報なしの避難者数', header: '個人情報なしの避難者数', minWidth: '20rem' },
        { field: '男', header: '男', minWidth: '15rem' },
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));



    useEffect(() => {
        setProducts(sampleProducts);
    }, [])

    const toggleAll = () => {
        if (allExpanded) collapseAll();
        else expandAll();
    };

    const expandAll = () => {
        let _expandedRows = {};
        products.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
        setAllExpanded(true);
    };

    const collapseAll = () => {
        setExpandedRows(null);
        setAllExpanded(false);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const rowClass = (data) => {
        return {
            'last-row': data.避難所 === '合計',
            'font-bold': data.避難所 === '合計'
        };
    };


    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for {data.name}</h5>
                <DataTable value={data.orders} responsiveLayout="scroll">
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="customer" header="Customer" sortable></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="amount" header="Amount" body={amountBodyTemplate} sortable></Column>
                    <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable></Column>
                    <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, products);
                doc.save('products.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'products');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const statusOrderBodyTemplate = (rowData) => {
        return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    };

    const searchBodyTemplate = () => {
        return <Button icon="pi pi-search" />;
    };

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const header = (
        <div className="flex align-items-center justify-content-end gap-2 py-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>
                            {translate(localeJson, 'evacuation_status_list')}
                        </h5>
                        <Divider />

                        {/* Table */}
                        <div className="col-12">
                            <DataTable
                                ref={dt}
                                value={products}
                                header={header}
                                responsiveLayout="scroll"
                                rowExpansionTemplate={rowExpansionTemplate}
                                dataKey="id"
                                paginator
                                rowClassName={rowClass}
                                className="p-datatable-gridlines"
                                showGridlines
                                rows={5}
                                filterDisplay="menu"
                                emptyMessage="No customers found."
                                style={{
                                    fontSize: "18px",
                                }}
                                size={"small"}
                                stripedRows
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                paginatorLeft={paginatorLeft}
                                paginatorRight={paginatorRight}
                            >
                                {cols.map((col, index) => (
                                    <Column key={index} field={col.field} header={col.header} sortable style={{
                                        minWidth: col.minWidth && col.minWidth,
                                        textAlign: 'center',
                                    }} />
                                ))}
                            </DataTable>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}



export default AdminDashboard;
