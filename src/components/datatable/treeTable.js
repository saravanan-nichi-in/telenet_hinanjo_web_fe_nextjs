import React from 'react';
import { TreeTable as TreeTab } from 'primereact/treetable';
import { Column } from 'primereact/column';

export default function TreeTable(props) {
    const { paginator, value, columns, rows, id } = props && props

    return (
        <div>
            <TreeTab id={id} value={value} paginator={paginator} rows={rows || 5} tableStyle={{ minWidth: '50rem' }}>
                {columns.map((col, i) => (
                    <Column key={col.field}
                        field={col.field}
                        header={col.header}
                        expander={col.expander} />
                ))}
            </TreeTab>
        </div>
    );
}