import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
export default function TableData(props) {
    return (
        <div>
            {props.paginator ? (
                <DataTable value={props.value} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" >
                    {props.columns.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} style={{ width: '25%' }} body={col.field === props.customActionsField ? col.body : undefined} />
                    ))}
                </DataTable>
            ) : (
                <DataTable value={props.value} rows={5} tableStyle={{ minWidth: '50rem' }}
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" >
                    {props.columns.map((col, index) => (
                        <Column key={index} field={col.field} header={col.header} style={{ width: '25%' }} body={col.field === props.customActionsField ? col.body : undefined} />
                    ))}
                </DataTable>
            )}
        </div>
    );
}
