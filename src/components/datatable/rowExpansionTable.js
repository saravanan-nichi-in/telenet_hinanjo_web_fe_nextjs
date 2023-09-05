import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from '../button';

export default function RowExpansionTable(props) {
    const { parentClass, rowExpansionField, outerColumn, innerColumn, value, id, paginator, rows,
        rowClassName, filterDisplay, style, size, stripedRows, emptyMessage, tableStyle, rowExpansionStyle,
        rowExpansionTableStyle, rowExpansionSize, responsiveLayout, columnStyle, rowExpansionColumnStyle,
        rowsPerPageOptions, showGridlines, rowExpanisonGridlines } = props;

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

                <DataTable id={id} showGridlines={rowExpanisonGridlines} value={data[rowExpansionField]} size={rowExpansionSize} style={rowExpansionStyle} tableStyle={{ minWidth: '20rem' } || rowExpansionTableStyle}>
                    {innerColumn.map((column, index) => (
                        <Column
                            key={index}
                            field={column.field}
                            header={column.header}
                            body={column.body}
                            style={{minWidth: column.minWidth && column.minWidth,...rowExpansionStyle}}
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
            <Button buttonProps={{ icon: "pi pi-plus", text: " Expand All", onClick: expandAll }} />
            <Button buttonProps={{ icon: "pi pi-minus", text: " Collapse All", onClick: collapseAll }} />
        </div>
    );

    return (
        <div className={`${parentClass} table-paginator`}>
            <Toast ref={toast} />
            <DataTable paginator={paginator}
                rows={rows || 5}
                value={props.value}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                header={header}
                rowsPerPageOptions={rowsPerPageOptions}
                rowClassName={rowClassName}
                filterDisplay={filterDisplay}
                emptyMessage={emptyMessage}
                style={style}
                size={size}
                stripedRows={stripedRows}
                showGridlines={showGridlines}
                responsiveLayout={responsiveLayout}
                tableStyle={{ minWidth: '50rem' } || tableStyle}>
                <Column expander={allowExpansion} style={{ maxWidth: '10px' }} />
                {outerColumn.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}
                        style={{minWidth: col.minWidth && col.minWidth,...columnStyle}}
                        body={col.field === props.customActionsField ? col.body : undefined} />
                ))}
            </DataTable>
        </div>
    );
}