import React from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';

export default function TreeTab(props) {
    const { paginator, value, columns, rows } = props && props
    return (
        <div>

            <TreeTable value={value} paginator={paginator} rows={rows || 5} tableStyle={{ minWidth: '50rem' }}>
                {columns.map((col, i) => (
                    <Column key={col.field}
                        field={col.field}
                        header={col.header}
                        expander={col.expander} />
                ))}
            </TreeTable>
        </div>
    );
}
