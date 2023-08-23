import React from 'react';
import { DataTable as TableData  } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function NormalTable(props) {
    const { paginator, rows, value, customActionsField, columns } = props && props
    return (
        <div>
            <TableData value={value}
                paginator={paginator} rows={rows || 5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" >
                {columns.map((col, index) => (
                    <Column key={index}
                        field={col.field}
                        header={col.header}
                        style={{ width: '25%' }}
                        body={col.field === customActionsField ? col.body : undefined} />
                ))}
            </TableData>
        </div>
    );
}
