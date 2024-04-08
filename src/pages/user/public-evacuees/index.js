import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { PublicEvacueeService } from "@/services";
import { Button, CustomHeader, NormalTable, Input } from "@/components";
import { prefectures } from "@/utils/constant";

export default function PublicEvacuee() {
    const { localeJson, setLoader, locale } = useContext(LayoutContext);
    const [tableLoading, setTableLoading] = useState(false);
    const [publicEvacueesColumn, setPublicEvacueesColumn] = useState([])
    const [searchName, setSearchName] = useState('');
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
            refugee_name: ""
        }
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

    const getPrefectureName = (id) => {
        let prefecture = prefectures.find((prefecture) => prefecture.value == id);
        return prefecture?.name;
    }

    /**
     * Get dashboard list on mounting
     */
    const onGetMaterialListOnMounting = () => {
        // Get dashboard list
        let columnHeaders = [{ field: 'place_name', header: translate(localeJson, 'shelter_place_name'), minWidth: '10rem' }];
        let payload = {
            filters: {
                start: getListPayload.filters.start,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc",
                refugee_name: getListPayload.filters.refugee_name
            }
        }
        getList(payload, (response) => {
            if (response.success && !_.isEmpty(response.data) && response.data.total > 0) {
                const data = response.data.list;
                const dynamicColumns = response.data.public_display_order;
                const places = response.data.places;
                dynamicColumns.map((value, index) => {
                    if (value.is_visible == 1) {
                        let tempHeader = { field: value.column_name, header: translate(localeJson, `public_evacuee_table_${value.column_name}`), minWidth: '4rem' };
                        if (value.column_name == "gender") {
                            tempHeader['minWidth'] = "7rem";
                        }
                        columnHeaders.push(tempHeader);
                        if (value.column_name == "age") {
                            tempHeader['minWidth'] = '4rem';
                            tempHeader['textAlign'] = 'left';
                            tempHeader['alignHeader'] = 'left';
                        }
                    }

                });
                setPublicEvacueesColumn(columnHeaders);

                let preparedList = [];

                // Preparing row data for specific column to display
                let serialIndex = getListPayload.filters.start + 1;
                data.map((obj, i) => {
                    let preparedObj = {
                        slno: serialIndex,
                        place_name: obj.place_id ? places.find(item => item.id == obj.place_id) ?
                            (locale == "ja" ? places.find(item => item.id == obj.place_id).name
                                : (places.find(item => item.id == obj.place_id).name_en ?
                                    places.find(item => item.id == obj.place_id).name_en
                                    : places.find(item => item.id == obj.place_id).name))
                            : translate(localeJson, "no_place_to_enter")
                            : translate(localeJson, "no_place_to_enter"),
                        placeNameEn: obj.place_id ? (places.find(obj => obj.id == obj.place_id) ? places.find(obj => obj.id == obj.place_id).name_en : "") : "",
                        family_id: obj.f_id ?? "",
                        family_code: obj.family_code ?? "",
                        gender: getGenderValue(obj.person_gender) ?? "",
                        address: obj.family_address ? translate(localeJson, 'post_letter') + obj.family_zip_code + getPrefectureName(obj.family_prefecture_id) + " " + obj.family_address : "",
                        address_default: obj.family_address_default ?? "",
                        refugee_name: obj.person_refugee_name ?? "",
                        personId: obj.person_id ?? "",
                        name: obj.person_name ?? "",
                        month: obj.person_month ?? "",
                        age: obj.person_age ?? "",
                        is_registered: obj.family_is_registered ?? "",
                        is_owner: obj.person_is_owner ?? "",
                    }
                    preparedList.push(preparedObj);
                    serialIndex = serialIndex + 1;
                })

                setList(preparedList);
                setTotalCount(response.data.total);
                setTableLoading(false);
            } else {
                setTableLoading(false);
                setPublicEvacueesColumn(columnHeaders);
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
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "Evacuee_Search_random_order")} />
                        <div>
                            <form>
                                <div className='pt-2 flex flex-wrap float-right justify-content-end gap-2 mobile-input'>
                                    <Input
                                        inputProps={{
                                            inputParentClassName: "mobile-input custom_input",
                                            labelProps: {
                                                text: translate(localeJson, 'name_public_evacuee'),
                                                inputLabelClassName: "block",
                                            },
                                            inputClassName: "w-20rem lg:w-13rem md:w-15rem sm:w-14rem",
                                            id: 'fullName',
                                            onChange: (e) => { setSearchName(e.target.value) }
                                        }}
                                    />
                                    <div className="flex align-items-end">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 back-button",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            type: "button",
                                            onClick: () => {
                                                setGetListPayload(prevState => ({
                                                    ...prevState,
                                                    filters: {
                                                        ...prevState.filters,
                                                        refugee_name: searchName.replace(/\s/g, '')
                                                    }
                                                }));
                                            }
                                        }} parentClass={"back-button"} />
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
                                    columns={publicEvacueesColumn}
                                    filterDisplay="menu"
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginator={true}
                                    first={getListPayload.filters.start}
                                    rows={getListPayload.filters.limit}
                                    paginatorLeft={true}
                                    onPageHandler={(e) => onPaginationChange(e)}
                                    parentClass={"custom-table"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}