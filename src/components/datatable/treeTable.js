import React from 'react';
import { TreeTable as TreeTab } from 'primereact/treetable';
import { Column } from 'primereact/column';

export default function TreeTable(props) {
<<<<<<< HEAD
    const { parentClass, custom, paginator, value, columns, rows, id, rowClassName,
        emptyMessage, style, size, stripedRows, tableStyle, customActionsField, columnStyle, ...restProps } = props;
=======
    const {
        parentClass,
        paginator,
        value,
        columns,
        rows,
        id,
        rowClassName,
        emptyMessage,
        style,
        size,
        stripedRows,
        tableStyle,
        customActionsField,
        columnStyle,
        ...restProps
    } = props;
>>>>>>> 6a0f1d1a79093d654356055a94c9f437f0bc79dd

    return (
        <div className={`${parentClass} ${custom || 'custom-table'}`} >
            <TreeTab id={id}
                value={value}
                paginator={paginator}
                rows={rows || 5}
                rowClassName={rowClassName}
                emptyMessage={emptyMessage}
                style={style}
                size={size}
                stripedRows={stripedRows}
                tableStyle={{ minWidth: '50rem' } || tableStyle}
                {...restProps}>
                {columns.map((col, i) => (
                    <Column key={col.field}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable}
                        expander={col.expander}
                        frozen={col.frozen}
                        headerClassName={col.headerClassName}
                        className={col.className}
                        style={{ minWidth: col.minWidth && col.minWidth, ...columnStyle }}
                        body={col.field === customActionsField ? col.body : undefined} />
                ))}
            </TreeTab>
        </div>
    );
}   