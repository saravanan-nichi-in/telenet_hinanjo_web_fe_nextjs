import React, { useEffect,useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import _ from 'lodash';

import { getJapaneseDateDisplayYYYYMMDDFormat, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalTable } from "@/components/datatable";
import { ExternalEvacueesService } from "@/services/externalEvacuees.service";
import { Button } from "@/components";
import { useSelector } from "react-redux";

export default function EvacueeDetailModal(props) {
    const { localeJson, locale, setLoader } = useContext(LayoutContext);
    const { open, close } = props && props;
    const [staffDetail, setStaffDetail] = useState([]);

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'external_evecuee_details_popup_table_slno'), className: "sno_class", textAlign:"center",alignHeader:"center"},
        { field: 'name_furigana', header: translate(localeJson, 'external_evecuee_details_popup_table_name_furigana'), maxWidth: "2rem" },
        { field: 'dob', header:translate(localeJson, 'external_evecuee_details_popup_table_dob'), maxWidth: "2rem" },
        { field: 'age', header:translate(localeJson, 'external_evecuee_details_popup_table_age'), maxWidth: "2rem",alignHeader:"center",textAlign:"right" },
        { field: 'gender', header:translate(localeJson, 'external_evecuee_details_popup_table_gender'), maxWidth: "2rem" }];

    // Main Table listing starts
    const { getEvacueeList } = ExternalEvacueesService;
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 5
        },
        "evacuee_id": props.staff.id,
        place_id: layoutReducer?.user?.place?.id,
    });

    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    
    const getStaffList = () => {
        // Get dashboard list
        getEvacueeList(getListPayload, (response) => {
            if (response.success && !_.isEmpty(response.data)) {
                if(response.data.externalEvacueeDetailList.total > 0) {
                    const data = response.data.externalEvacueeDetailList.list;
                    var additionalColumnsArrayWithOldData = [...columnsData];
                    let preparedList = [];
                    // Update prepared list to the state
                    // Preparing row data for specific column to display
                    data.map((obj, i) => {
                        let preparedObj = {
                            slno: i + getListPayload.filters.start + 1,
                            name_furigana: obj.name_furigana ?? "",
                            dob: getJapaneseDateDisplayYYYYMMDDFormat(obj.dob) ?? "",
                            age: obj.age ?? "",
                            gender: obj.gender ?? "",
                            id: obj.id ?? "",
                        }
                        preparedList.push(preparedObj);
                    })
                    setList(preparedList);
                    setColumns(additionalColumnsArrayWithOldData);
                    setTotalCount(response.data.externalEvacueeDetailList.total);
                    setTableLoading(false);
                } else {
                    setTableLoading(false);
                    setList([]);
                }
            } else {
                setTableLoading(false);
                setList([]);
            }
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

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getStaffList()
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload, props.staff]);

    const header = (
        <div className="custom-modal">
            {translate(localeJson,'external_evecuee_details_popup_header')}
        </div>
    );

    return (
        <React.Fragment>
            <div>
                <Dialog
                    className="custom-modal"
                    header={header}
                    visible={open}
                    style={{ minWidth: "20rem" }}
                    draggable={false}
                    onHide={() => close()}
                    footer={
                        <div className="text-center">
                            <Button buttonProps={{
                                buttonClass: "text-600 w-8rem",
                                bg: "bg-white",
                                hoverBg: "hover:surface-500 hover:text-white",
                                text: translate(localeJson, 'back'),
                                onClick: () => close(),
                            }} parentClass={"inline"} />
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