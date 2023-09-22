import React from 'react';
import { DataTable as TableData } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function NormalTable(props) {
    const { parentClass, custom, paginator, rows, value, customActionsField, columns, id,
        rowClassName, filterDisplay, style, size, stripedRows, emptyMessage,
        tableStyle, responsiveLayout, columnStyle, rowsPerPageOptions, showGridlines, className,
        onRowClick, paginatorClassName, paginatorLeft, paginatorRight, alignHeader, ...restProps } = props

    return (
        <div className={`${parentClass} ${custom || 'custom-table'}`} >
            <TableData id={id} value={value}
                className={`${className}`}
                paginator={paginator} rows={rows || 5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowClassName={rowClassName}
                filterDisplay={filterDisplay}
                emptyMessage={emptyMessage}
                style={style}
                size={size}
                onRowClick={onRowClick}
                showGridlines={showGridlines}
                stripedRows={stripedRows}
                responsiveLayout={responsiveLayout}
                tableStyle={tableStyle || { minWidth: '50rem' }}
                paginatorClassName={paginatorClassName}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                // paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="{first} - {last} / {totalRecords}"
                {...restProps}
            >
                {columns.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable}
                        alignHeader={alignHeader}
                        style={{ minWidth: col.minWidth && col.minWidth, ...columnStyle, textAlign: col.textAlign && col.textAlign }}
                        body={col.field === customActionsField ? col.body : undefined} />
                ))}
            </TableData>
        </div>
    );
}