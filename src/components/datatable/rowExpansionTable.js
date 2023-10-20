import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';

import { Button } from '../button';

export default function RowExpansionTable(props) {
    const {
        parentClass,
        custom,
        rowExpansionField,
        outerColumn,
        innerColumn,
        inner1Column,
        innerColumn1,
        value,
        id,
        paginator,
        rows,
        rowClassName,
        filterDisplay,
        style,
        size,
        stripedRows,
        paginatorLeft,
        paginatorRight,
        emptyMessage,
        tableStyle,
        rowExpansionStyle,
        rowExpansionTableStyle,
        rowExpansionSize,
        responsiveLayout,
        columnStyle,
        rowExpansionColumnStyle,
        rowsPerPageOptions,
        showGridlines,
        rowExpanisonGridlines,
        className,
        rowExpansionClassName,
        rowExpansionOnRowClick,
        onRowClick,
        expandAllTrigger,
        expandAllButtonProps,
        ...restProps
    } = props;

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
            <div className='rowExpansionTable'>
                <DataTable className={`${rowExpansionClassName}`} id={id} showGridlines={rowExpanisonGridlines || 'true'} onRowClick={rowExpansionOnRowClick} value={data[rowExpansionField]} size={rowExpansionSize} style={rowExpansionStyle} tableStyle={rowExpansionTableStyle || { minWidth: '20rem' }}>
                    {innerColumn.map((column, index) => (
                        <Column
                            key={index}
                            field={column.field}
                            header={column.header}
                            sortable={column.sortable}
                            className={column.className}
                            alignHeader={column.alignHeader}
                            headerClassName={column.headerClassName}
                            style={{
                                minWidth: column.minWidth && column.minWidth,
                                display: column.display,
                                textAlign: column.textAlign && column.textAlign, ...rowExpansionColumnStyle
                            }}
                            headerStyle={column.headerStyle}
                            body={column.field === props.customRowExpansionActionsField ? column.body : column.body}
                        />
                    ))}
                </DataTable>
                {inner1Column && inner1Column.length > 0 && (
                    <DataTable className={`${rowExpansionClassName}`} id={id} showGridlines={rowExpanisonGridlines || 'true'} onRowClick={rowExpansionOnRowClick} value={data[rowExpansionField]} size={rowExpansionSize} style={rowExpansionStyle} tableStyle={rowExpansionTableStyle || { minWidth: '20rem' }}>
                        {inner1Column.map((column1, index) => (
                            <Column
                                key={index}
                                field={column1.field}
                                header={column1.header}
                                sortable={column1.sortable}
                                className={column1.className}
                                alignHeader={column1.alignHeader}
                                headerClassName={column1.headerClassName}
                                style={{ minWidth: column1.minWidth && column1.minWidth, textAlign: column1.textAlign && column1.textAlign, ...rowExpansionColumnStyle }}
                                headerStyle={column1.headerStyle}
                                body={column1.field === props.customRowExpansionActionsField ? column1.body : column1.body}
                            />
                        ))}
                    </DataTable>
                )}
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button buttonProps={{ icon: "pi pi-plus", text: " Expand All", onClick: expandAll }} />
            <Button buttonProps={{ icon: "pi pi-minus", text: " Collapse All", onClick: collapseAll }} />
        </div>
    );

    useEffect(()=>{
        if(expandAllTrigger){
            expandAll();
        }
        else{
            collapseAll();
        }
    }, [expandAllTrigger])

    return (
        <div className={`${parentClass} ${custom || 'custom-table'}`}>
            <Toast ref={toast} />
            <DataTable paginator={paginator}
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="{first} - {last} / {totalRecords}"
                rows={rows || 5}
                className={`${className}`}
                value={props.value}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id"
                header={expandAllButtonProps}
                rowClassName={rowClassName}
                filterDisplay={filterDisplay}
                emptyMessage={emptyMessage}
                style={style}
                size={size}
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                stripedRows={stripedRows}
                showGridlines={showGridlines || 'true'}
                onRowClick={onRowClick}
                responsiveLayout={responsiveLayout}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={tableStyle || { minWidth: '50rem' }}
                {...restProps}>

                {outerColumn.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable}
                        expander={col.expander}
                        className={col.className}
                        alignHeader={col.alignHeader}
                        headerStyle={col.headerStyle}
                        headerClassName={col.headerClassName}
                        style={{
                            minWidth: col.minWidth && col.minWidth,
                            display: col.display,
                            textAlign: col.textAlign && col.textAlign, ...columnStyle
                        }}
                        body={col.field === props.customActionsField ? col.body : col.body} />
                ))}
                <Column expander={allowExpansion} style={{ width: '5rem', textAlign: "center" }} />
            </DataTable>
        </div>
    );
}