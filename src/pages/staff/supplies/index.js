import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, NormalTable,Counter } from '@/components';
import { StaffSuppliesServices } from '@/services/supplies.services';
import _ from 'lodash';

export default function Supplies() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'material_management_table_header_slno'), className: "sno_class" },
        { field: 'name', header: translate(localeJson, 'material_management_table_header_name'), minWidth: "15rem", maxWidth: "15rem" },
        { field: 'unit', header: translate(localeJson, 'material_management_table_header_unit'), minWidth: "10rem", maxWidth: "10rem",
        body: (rowData) => (
            <>
            <Counter 
                    inputClass={'border-noround-bottom border-noround-top text-center'}
                    onValueChange= {(value)=>{
                        rowData.number= value+""
                    } }
                    value={rowData?.number+""}
                />
            </>
        ), },
    ];

    const [getListPayload, setGetListPayload] = useState({
       place_id:"2"
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);


    /* Services */
    const { getList,create } = StaffSuppliesServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetMaterialListOnMounting()
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    /**
     * Get dashboard list on mounting
     */
    const onGetMaterialListOnMounting = () => {
        // Get dashboard list
        getList(getListPayload, (response) => {
            console.log(response)
            if (response.success && !_.isEmpty(response.data) && response.data.supplies?.length > 0) {
                const data = response.data.supplies;
                console.log(data)
                // var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i,
                        id: obj.id ?? "",
                        name: obj.name ?? "",
                        unit: obj.unit ?? "",
                        number:obj.number??""
                    }
                    preparedList.push(preparedObj);
                })

                setList(preparedList);
                // setColumns(additionalColumnsArrayWithOldData);
                // setTotalCount(response.data.model.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setList([]);
            }

        });
    }






    const hideOverFlow = () => {
        document.body.style.overflow = 'hidden';
    }


    /**
     * Pagination handler
     * @param {*} e 
     */
    // const onPaginationChange = async (e) => {
    //     setTableLoading(true);
    //     if (!_.isEmpty(e)) {
    //         const newStartValue = e.first; // Replace with your desired page value
    //         const newLimitValue = e.rows; // Replace with your desired limit value
    //         await setGetListPayload(prevState => ({
    //             ...prevState,
    //             filters: {
    //                 ...prevState.filters,
    //                 start: newStartValue,
    //                 limit: newLimitValue
    //             }
    //         }));
    //     }
    // }

    return (
        <>

            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                            <h5 className='page-header1'>{translate(localeJson, 'material')}</h5>
                            <hr />
                            <div>
                                <div className='mt-3'>
                                    <NormalTable
                                        lazy
                                        totalRecords={totalCount}
                                        loading={tableLoading}
                                        stripedRows={true}
                                        className={"custom-table-cell"}
                                        showGridlines={"true"}
                                        value={list}
                                        columns={columnsData}
                                        filterDisplay="menu"
                                        emptyMessage={translate(localeJson, "data_not_found")}
                                        // paginator={true}
                                        // first={getListPayload.filters.start}
                                        // rows={getListPayload.filters.limit}
                                        // paginatorLeft={true}
                                        // onPageHandler={(e) => onPaginationChange(e)}
                                    />
                                </div>
                                <div className='mt-3'>
                                <Button 
                        parentStyle={{ display: "inline" }}
                        buttonProps={{
                        text: translate(localeJson, 'edit'), 
                        buttonClass: "text-primary ",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => {
                            console.log(list)
                        },
                    }} />
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </>
    )
}