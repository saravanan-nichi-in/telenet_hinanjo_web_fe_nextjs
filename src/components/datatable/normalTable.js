import React from 'react';
import { DataTable as TableData } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function NormalTable(props) {
    const {
        parentClass,
        custom,
        paginator,
        rows,
        value,
        customActionsField,
        customBody,
        columns,
        id,
        rowClassName,
        filterDisplay,
        style,
        size,
        frozenValue,
        stripedRows,
        emptyMessage,
        tableStyle,
        responsiveLayout,
        columnStyle,
        rowsPerPageOptions,
        showGridlines,
        className,
        onRowClick,
        paginatorClassName,
        paginatorLeft,
        paginatorRight,
        alignHeader,
        expander,
        rowExpansionTemplate,
        expandedRows,
        onRowToggle,
        ...restProps
    } = props;

    return (
        <div className={`${parentClass} ${custom || 'custom-table'}`} >
            <TableData id={id} value={value}
                className={`${className}`}
                expandedRows={expandedRows}
                paginator={paginator} rows={rows || 5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                rowClassName={rowClassName}
                filterDisplay={filterDisplay}
                emptyMessage={emptyMessage}
                style={style}
                size={size}
                frozenValue={frozenValue}
                onRowClick={onRowClick}
                onRowToggle={onRowToggle}
                showGridlines={showGridlines}
                stripedRows={stripedRows}
                responsiveLayout={responsiveLayout}
                tableStyle={tableStyle || { minWidth: '50rem' }}
                paginatorClassName={paginatorClassName}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                rowExpansionTemplate={rowExpansionTemplate}
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
                        body={col.field === customActionsField ? col.body : col.body} />
                ))}
            </TableData>
        </div>
    );
}