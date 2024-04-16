import React, { useEffect, useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import _ from 'lodash';

import {
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    hideOverFlow,
    showOverFlow,
    getValueByKeyRecursively as translate
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, NormalTable } from "@/components";
import { ExternalEvacuationServices } from "@/services";

export default function EvacueeDetailModal(props) {
    const { localeJson, locale } = useContext(LayoutContext);

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
        },
        "evacuee_id": props.evacuee.id,
    });
    const { open, close } = props && props;

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'external_evecuee_details_popup_table_slno'), className: "sno_class", textAlign: "center", alignHeader: "center" },
        { field: 'name_furigana', header: translate(localeJson, 'external_evecuee_details_popup_table_name_furigana'), minWidth: "8rem", maxWidth: "8rem" },
        { field: 'dob', header: translate(localeJson, 'external_evecuee_details_popup_table_dob'), minWidth: "8rem", maxWidth: "8rem" },
        { field: 'age', header: translate(localeJson, 'external_evecuee_details_popup_table_age'), minWidth: "3rem", maxWidth: "3rem", textAlign: "center", alignHeader: "center" },
        { field: 'gender', header: translate(localeJson, 'external_evecuee_details_popup_table_gender'), minWidth: "3rem", maxWidth: "3rem" }
    ];

    const { getExternalEvacueesDetail } = ExternalEvacuationServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getEvacueesList()
        };
        fetchData();
    }, [locale, getListPayload, props.evacuee]);

    useEffect(() => {
        if (open) {
            hideOverFlow();
        } else {
            showOverFlow();
        }

        return () => {
            // Cleanup when the component unmounts
            showOverFlow();
        };
    }, [open]);

    const getEvacueesList = () => {
        getExternalEvacueesDetail(getListPayload, (response) => {
            var additionalColumnsArrayWithOldData = [...columnsData];
            var preparedList = [];
            var listTotalCount = 0;
            if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
                const data = response.data.model.list;
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        name_furigana: obj.name_furigana ? obj.name_furigana : "",
                        dob: obj.dob ? (locale === "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(obj.dob) : getEnglishDateDisplayFormat(obj.dob)) : "",
                        age: obj.age ? obj.age : "",
                        gender: obj.gender ? obj.gender : "",
                        id: obj.id ? obj.id : "",
                    }
                    preparedList.push(preparedObj);
                })
                listTotalCount = response.data.model.total;
            }
            setTableLoading(false);
            setColumns(additionalColumnsArrayWithOldData);
            setList(preparedList);
            setTotalCount(listTotalCount);
        });
    }

    /**
     * Pagination handler
     * @param {*} e 
     */
    const onPaginationChange = async (e) => {
        setTableLoading(true);
        if (!_.isEmpty(e)) {
            const newStartValue = e.first; // Replace with your desired page value
            const newLimitValue = e.rows; // Replace with your desired limit value
            await setGetListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    const header = (
        <div className="new-custom-modal">
            {translate(localeJson, 'external_evecuee_details_popup_header')}
        </div>
    );

    return (
        <React.Fragment>
            <div>
                <Dialog
                    className="new-custom-modal"
                    header={header}
                    visible={open}
                    draggable={false}
                    blockScroll={true}
                    onHide={() => close()}
                    footer={
                        <div className="text-center">
                            <Button buttonProps={{
                                buttonClass: "w-8rem back-button",
                                text: translate(localeJson, 'back'),
                                onClick: () => close(),
                            }} parentClass={"inline back-button"} />
                        </div>
                    }
                >
                    <div className={`modal-content`}>
                        <div>
                            <div className="modal-header">
                                {translate(localeJson, 'external_evecuee_details_popup_header')}
                            </div>
                            <div className="">
                                <div>
                                    <NormalTable
                                        lazy
                                        tableStyle={{ maxWidth: "w-full" }}
                                        totalRecords={totalCount}
                                        loading={tableLoading}
                                        stripedRows={true}
                                        className={"custom-table-cell"}
                                        showGridlines={"true"}
                                        value={list}
                                        columns={columns}
                                        filterDisplay="menu"
                                        emptyMessage={translate(localeJson, "data_not_found")}
                                        first={getListPayload.filters.start}
                                        rows={getListPayload.filters.limit}
                                        scrollable
                                        scrollHeight="400px"
                                        onPageHandler={(e) => onPaginationChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="modal-button-footer-space-back">
                                    <Button buttonProps={{
                                        buttonClass: "w-full back-button",
                                        text: translate(localeJson, 'back'),
                                        onClick: () => close(),
                                    }} parentClass={"back-button"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}