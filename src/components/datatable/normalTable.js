import React from 'react';
import { DataTable as TableData } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function NormalTable(props) {
    const { parentClass, paginator, rows, value, customActionsField, columns, id,
        rowClassName, filterDisplay, style, size, stripedRows, emptyMessage,
        tableStyle, responsiveLayout, columnStyle, rowsPerPageOptions, showGridlines } = props
    return (
        <div className={`${parentClass}`} >
            <TableData id={id} value={value}
                paginator={paginator} rows={rows || 5}
                rowsPerPageOptions={rowsPerPageOptions}
                rowClassName={rowClassName}
                filterDisplay={filterDisplay}
                emptyMessage={emptyMessage}
                style={style}
                size={size}
                showGridlines={showGridlines}
                stripedRows={stripedRows}
                responsiveLayout={responsiveLayout}
                tableStyle={{ minWidth: '50rem' } || tableStyle}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" >
                {columns.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}
                        style={{minWidth: col.minWidth && col.minWidth,...columnStyle}}
                        body={col.field === customActionsField ? col.body : undefined} />
                ))}
            </TableData>
        </div>
    );
}