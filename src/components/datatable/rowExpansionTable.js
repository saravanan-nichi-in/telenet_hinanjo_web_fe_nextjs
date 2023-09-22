import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from '../button';

export default function RowExpansionTable(props) {
    const { parentClass, rowExpansionField, outerColumn, innerColumn, value, id, paginator, rows,
        rowClassName, filterDisplay, style, size, stripedRows, emptyMessage, tableStyle, rowExpansionStyle,
        rowExpansionTableStyle, rowExpansionSize, responsiveLayout, columnStyle, rowExpansionColumnStyle,
        rowsPerPageOptions, showGridlines, rowExpanisonGridlines, className, rowExpansionClassName,
        rowExpansionOnRowClick, custom, onRowClick, ...restProps } = props;

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

                <DataTable className={rowExpansionClassName} id={id} showGridlines={rowExpanisonGridlines || 'true'} onRowClick={rowExpansionOnRowClick} value={data[rowExpansionField]} size={rowExpansionSize} style={rowExpansionStyle} tableStyle={rowExpansionTableStyle || { minWidth: '20rem' }}>
                    {innerColumn.map((column, index) => (
                        <Column
                            key={index}
                            field={column.field}
                            header={column.header}
                            sortable={column.sortable}
                            className={column.className}
                            headerClassName={column.headerClassName}
                            style={{ minWidth: column.minWidth && column.minWidth, ...rowExpansionColumnStyle }}
                            headerStyle={column.headerStyle}
                            body={column.field === props.customRowExpansionActionsField ? column.body : undefined}
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
        <div className={`${parentClass}  ${custom || 'custom-table'} `}>
            <Toast ref={toast} />
            <DataTable paginator={paginator}
                rows={rows || 5}
                className={`${className}`}
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
                onRowClick={onRowClick}
                responsiveLayout={responsiveLayout}
                tableStyle={tableStyle || { minWidth: '50rem' }}
                {...restProps}>
                <Column expander={allowExpansion} style={{ maxWidth: '10px' }} />
                {outerColumn.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable}
                        className={col.className}
                        headerClassName={col.headerClassName}
                        style={{ minWidth: col.minWidth && col.minWidth, ...columnStyle }}
                        body={col.field === props.customActionsField ? col.body : undefined} />
                ))}
            </DataTable>
        </div>
    );
}