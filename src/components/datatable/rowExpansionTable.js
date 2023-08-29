import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function RowExpansionTable(props) {
    const { rowExpansionField, outerColumn, innerColumn, value, id, paginator, rows } = props
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);

    const expandAll = () => {
        let _expandedRows = {};

        value.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const allowExpansion = (rowData) => {
        return rowData[rowExpansionField] && rowData[rowExpansionField].length > 0;
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">

                <DataTable id={id} value={data[rowExpansionField]} tableStyle={{ minWidth: '20rem' }}>
                    {innerColumn.map((column, index) => (
                        <Column
                            key={index}
                            field={column.field}
                            header={column.header}
                            body={column.body}
                            sortable={column.sortable}
                            headerStyle={column.headerStyle}
                        />
                    ))}
                </DataTable>
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <DataTable paginator={paginator} rows={rows || 5} value={props.value} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id" header={header} tableStyle={{ minWidth: '50rem' }}>
                <Column expander={allowExpansion} style={{ maxWidth: '10px' }} />
                {outerColumn.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}

                        style={{ width: '25%' }}
                        body={col.field === props.customActionsField ? col.body : undefined} />

                ))}

            </DataTable>
        </div>
    );
}