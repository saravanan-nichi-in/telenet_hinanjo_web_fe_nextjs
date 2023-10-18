import React, { useEffect } from "react";
import { DataTable as TableData } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";

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
    selectedCell,
    cellClassName,
    isDataSelectable,
    onPageHandler,
    ...restProps
  } = props;

  return (
    <div className={`${parentClass} ${custom || "custom-table"}`}>
      <TableData
        id={id}
        value={value}
        className={`${className}`}
        expandedRows={expandedRows}
        paginator={paginator}
        rows={rows || 5}
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
        tableStyle={tableStyle || { minWidth: "50rem" }}
        paginatorClassName={paginatorClassName}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        rowExpansionTemplate={rowExpansionTemplate}
        paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="{first} - {last} / {totalRecords}"
        cellClassName={cellClassName}
        isDataSelectable={isDataSelectable}
        onPage={_.isFunction(onPageHandler) ? (e) => onPageHandler(e) : false}
        {...restProps}
      >
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            headerStyle={col.headerStyle}
            alignHeader={alignHeader}
            className={col.className}
            style={{
              minWidth: col.minWidth && col.minWidth,
              maxWidth: col.maxWidth && col.maxWidth,
              width: col.width && col.width,
              ...columnStyle,
              textAlign: col.textAlign && col.textAlign,
              fontWeight: col.fontWeight && col.fontWeight,
              display: col.display,
              wordWrap: "break-word"
            }}
            body={col.field === customActionsField ? col.body : col.body}
          />
        ))}
      </TableData>
    </div>
  );
}
