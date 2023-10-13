import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { getValueByKeyRecursively as translate, getTotalCountFromArray } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DetailModal } from '@/components';
import { ShortageSuppliesServices } from '@/services';
import { NormalTable } from '@/components';

function ShortageSupplies() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const columnsData = [
        { field: 'evacuation_place', header: translate(localeJson, 'evacuation_place'), minWidth: '15rem', headerClassName: "custom-header", textAlign: 'left' },
    ]
    const [tableLoading, setTableLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [frozenArray, setFrozenArray] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    /* Services */
    const { callExport, getList } = ShortageSuppliesServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await loadShortageSuppliesList();
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    /**
     * Load shortage supplies list
    */
    const loadShortageSuppliesList = () => {
        // Get shortage supplies list
        getList(onloadShortageSuppliesListDone);
    }

    /**
     * Function will get data & update shortage supplies list
     * @param {*} response 
     */
    const onloadShortageSuppliesListDone = (response) => {
        if (response.success && !_.isEmpty(response.data)) {
            const dynamicColumns = response.data.supplies;
            const data = response.data.supplyInfo;
            var additionalColumnsKeys = [];
            var additionalColumnsArrayWithOldData = [...columnsData];
            var preparedList = [];
            // Prepare table dynamic columns
            if (dynamicColumns) {
                dynamicColumns.map((obj, i) => {
                    let preparedColumnObjToMerge = {
                        field: obj.id, header: () => (
                            <div className='table_header_flexColumn'>
                                <div>
                                    {obj.name}
                                </div>
                                {obj.unit && (
                                    <div>
                                        {`( ${obj.unit} )`}
                                    </div>
                                )}
                            </div>
                        ), minWidth: "10rem", headerClassName: "custom-header", textAlign: 'left'
                    };
                    additionalColumnsKeys.push(preparedColumnObjToMerge.field);
                    additionalColumnsArrayWithOldData.push(preparedColumnObjToMerge);
                })
            }
            // Preparing row data for specific column to display
            data.map((obj, i) => {
                let preparedObj = {
                    evacuation_place: <div className={obj.note || obj.comment ? "text-higlight clickable-row" : "clickable-row"} onClick={() => onClickEvacuationPlace(obj)}>{locale === "en" && !_.isNull(obj.place_name_en) ? obj.place_name_en : obj.place_name}</div>
                }
                dynamicColumns.map((objSub, i) => {
                    preparedObj[objSub.id] = `${obj.supply[objSub.id]}`;
                })
                preparedList.push(preparedObj);
            })
            // Update frozen data
            var frozenObj = {
                evacuation_place: translate(localeJson, 'shortage_total'),
            };
            additionalColumnsKeys.map((frozenObjSub, i) => {
                frozenObj[frozenObjSub] = `${getTotalCountFromArray(preparedList, frozenObjSub)}`
            })
            // Update prepared list to the state
            setColumns(additionalColumnsArrayWithOldData);
            setFrozenArray([frozenObj]);
            setList([...preparedList]);
            setTableLoading(false);
        }
    }

    /**
     * Evacuation place on click display comment & note information
     * @param {*} rowData 
     */
    const onClickEvacuationPlace = (rowData) => {
        setSelectedRow(rowData);
        setShowModal(true);
        document.body.classList.add('dialog-open'); // Add class to block scroll
    }

    return (
        <React.Fragment>
            <DetailModal detailModalProps={{
                headerContent: () => (
                    <div>
                        {locale === "en" && !_.isNull(selectedRow.place_name_en) ? selectedRow.place_name_en : selectedRow.place_name}
                    </div>
                ),
                visible: showModal,
                style: { width: '600px' },
                position: 'center',
                onHide: () => {
                    setShowModal(false);
                    document.body.classList.remove('dialog-open'); // Remove class to enable scroll
                },
                note: selectedRow && selectedRow.note ? selectedRow.note : translate(localeJson, 'not'),
                comment: selectedRow && selectedRow.comment ? selectedRow.comment : translate(localeJson, 'not')
            }} />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>{translate(localeJson, 'shortage_supplies_list')}</h5>
                        <hr />
                        <div className="col-12 custom-table">
                            <div className="flex justify-content-end ">
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => callExport()
                                }} parentClass={"mb-3"} />
                            </div>
                            <NormalTable
                                loading={tableLoading}
                                stripedRows={true}
                                className={"custom-table-cell"}
                                showGridlines={"true"}
                                value={list}
                                frozenValue={_.size(list) > 0 && frozenArray}
                                columns={columns}
                                filterDisplay="menu"
                                emptyMessage="No data found."
                                paginator={true}
                                rows={5}
                                paginatorLeft={true}
                            />
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ShortageSupplies;