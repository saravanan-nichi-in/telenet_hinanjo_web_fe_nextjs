import React from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';

export default function TreeTab(props) {

    return (
        <div className="card">
            {props.paginator ? (
                <TreeTable value={props.value} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
                    {props.columns.map((col, i) => (
                        <Column key={col.field}
                            field={col.field}
                            header={col.header}
                            expander={col.expander} />
                    ))}
                </TreeTable>
            ) : (
                <TreeTable value={props.value} tableStyle={{ minWidth: '50rem' }}>
                    {props.columns.map((col, i) => (
                        <Column key={col.field}
                            field={col.field}
                            header={col.header}
                            expander={col.expander} />
                    ))}
                </TreeTable>
            )}
        </div>
    );
}
