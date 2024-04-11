import React, { useEffect, useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { useSelector } from "react-redux";
import _ from 'lodash';

import { getEnglishDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ExternalEvacueesService } from "@/services/externalEvacuees.service";
import { Button, NormalTable } from "@/components";

export default function EvacueeDetailModal(props) {
    const { localeJson, locale, setLoader } = useContext(LayoutContext);
    const layoutReducer = useSelector((state) => state.layoutReducer);
    
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10
        },
        person_id: props.staff.external_person_id,
        place_id: layoutReducer?.user?.place?.id,
    });
    const { open, close } = props && props;

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'external_evecuee_details_popup_header')}
        </div>
    );

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'external_evecuee_details_popup_table_slno'), className: "sno_class", textAlign: "center", alignHeader: "center" },
        { field: 'name_furigana', header: translate(localeJson, 'external_evecuee_details_popup_table_name_furigana'), maxWidth: "2rem" },
        { field: 'dob', header: translate(localeJson, 'external_evecuee_details_popup_table_dob'), maxWidth: "2rem" },
        { field: 'age', header: translate(localeJson, 'external_evecuee_details_popup_table_age'), maxWidth: "2rem", alignHeader: "center", textAlign: "center" },
        { field: 'gender', header: translate(localeJson, 'external_evecuee_details_popup_table_gender'), maxWidth: "2rem" }];

    // Main Table listing starts
    const { getEvacueeList } = ExternalEvacueesService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getStaffList()
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload, props.staff]);

    const getStaffList = () => {
        getEvacueeList(getListPayload, (response) => {
            var preparedList = [];
            var additionalColumnsArrayWithOldData = [...columnsData];
            var listTotalCount = 0;
            if (response.success && !_.isEmpty(response.data)) {
                if (response.data.externalEvacueeDetailList.list) {
                    const data = response.data.externalEvacueeDetailList.list;
                    // Preparing row data for specific column to display
                    data.map((obj, i) => {
                        let preparedObj = {
                            slno: i + getListPayload.filters.start + 1,
                            name_furigana: obj.name_furigana ?? "",
                            dob: obj.dob ? (locale === "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(obj.dob) : getEnglishDateDisplayFormat(obj.dob)) : "",
                            age: obj.age ?? "",
                            gender: obj.gender ?? "",
                            id: obj.id ?? "",
                        }
                        preparedList.push(preparedObj);
                    })
                    listTotalCount = response.data.externalEvacueeDetailList.total
                }
            }
            setTableLoading(false);
            setList(preparedList);
            setColumns(additionalColumnsArrayWithOldData);
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

    return (
        <React.Fragment>
            <div>
                <Dialog
                    className="custom-modal"
                    header={header}
                    visible={open}
                    style={{ minWidth: "20rem" }}
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
                            <div className="mt-5">
                                <div>
                                    <NormalTable
                                        lazy
                                        totalRecords={totalCount}
                                        loading={tableLoading}
                                        stripedRows={true}
                                        className={"custom-table-cell"}
                                        parentClass={"staff-external-table"}
                                        showGridlines={"true"}
                                        value={list}
                                        columns={columns}
                                        filterDisplay="menu"
                                        emptyMessage={translate(localeJson, "data_not_found")}
                                        paginator={true}
                                        first={getListPayload.filters.start}
                                        rows={getListPayload.filters.limit}
                                        paginatorLeft={true}
                                        onPageHandler={(e) => onPaginationChange(e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}