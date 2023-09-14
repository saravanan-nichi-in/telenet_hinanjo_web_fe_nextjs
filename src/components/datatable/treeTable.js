import React from 'react';
import { TreeTable as TreeTab } from 'primereact/treetable';
import { Column } from 'primereact/column';

export default function TreeTable(props) {
    const { parentClass, paginator, value, columns, rows, id, rowClassName,
        emptyMessage, style, size, stripedRows, tableStyle, customActionsField, columnStyle, ...restProps } = props;

    return (
        <div className={`${parentClass} table-paginator`} >
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
                        style={{ minWidth: col.minWidth && col.minWidth, ...columnStyle }}
                        body={col.field === customActionsField ? col.body : undefined} />
                ))}
            </TreeTab>
        </div>
    );
}   