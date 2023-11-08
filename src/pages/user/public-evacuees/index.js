import React, { useState, useEffect, useContext } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { PublicEvacueeService } from "@/helper/publicEvacueeService";
import { Button, InputFloatLabel, NormalTable } from "@/components";
import _ from "lodash";

export default function PublicEvacuee() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    const [tableLoading, setTableLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [columns, setColumns] = useState([
    ]);
    const [searchName, setSearchName] = useState('');

    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 5
        },
        "search": ""
    });

    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    /* Services */
    const { getList } = PublicEvacueeService;

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
            if (response.success && !_.isEmpty(response.data) && response.data.count > 0) {
                const data = response.data.list;
                const dynamicColumns = response.data.public_display_order;
                let columnHeaders = [];

                dynamicColumns.map((value, index) => {
                    if (value.is_visible == 1) {
                        let tempHeader = { field: value.column_name, header: translate(localeJson, `public_evacuee_table_${value.column_name}`), minWidth: '4rem' };
                        if(value.column_name == "gender"){
                            tempHeader['minWidth'] = "7rem";
                        }
                        columnHeaders.push(tempHeader);
                    }
                });
                setColumns(columnHeaders);

                let preparedList = [];
                // Update prepared list to the state
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        family_id: obj.family_id ?? "",
                        family_code: obj.family_code ?? "",
                        gender: getGenderValue(obj.gender) ?? "",
                        address: obj.address ?? "",
                        address_default: obj.address_default ?? "",
                        refugee_name: obj.refugee_name ?? "",
                        placeNameEn: obj.placeNameEn ?? "",
                        personId: obj.personId ?? "",
                        name: obj.name ?? "",
                        month: obj.month ?? "",
                        age: obj.age ?? "",
                        is_registered: obj.is_registered ?? "",
                        is_owner: obj.is_owner ?? "",
                    }
                    preparedList.push(preparedObj);
                })

                setList(preparedList);
                // setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.count);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setList([]);
                setTotalCount(0);
            }

        });
    }

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'others_count');
        }
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
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5 className="page-header1">{translate(localeJson, "Evacuee_Search_random_order")}</h5>
                        <hr />
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            id: 'fullName',
                                            inputClass: "w-20rem lg:w-13rem md:w-15rem sm:w-14rem",
                                            text: translate(localeJson, 'name_public_evacuee'),
                                            custom: "mobile-input custom_input",
                                            onChange: (e) => { setSearchName(e.target.value) }
                                        }}
                                    />
                                    <div className="">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input ",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            severity: "primary",
                                            type: "button",
                                            onClick: () => {
                                                setGetListPayload({ ...getListPayload, search: searchName });
                                            }
                                        }} />
                                    </div>
                                </div>
                            </form>
                            <div className="mt-3">
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
            </div>
        </div>
    )
}
