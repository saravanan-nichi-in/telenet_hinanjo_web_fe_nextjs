import React, { useState, useEffect, useContext } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { PublicEvacueeService } from "@/helper/publicEvacueeService";
import { Button, InputFloatLabel, NormalTable } from "@/components";

export default function PublicEvacuee() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [tableLoading, setTableLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const columns = [
        { field: 'place_name', header: translate(localeJson, 'place_name_list') },
        { field: 'name_phonetic', header: translate(localeJson, 'name_phonetic'), minWidth: "15rem" },
        { field: 'name_kanji', header: translate(localeJson, 'name_kanji') },
        { field: 'age', header: translate(localeJson, 'age') },
        { field: 'gender', header: translate(localeJson, 'gender') },
        { field: 'Address', header: translate(localeJson, 'address') },
    ];

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            setLoader(false);
        };
        PublicEvacueeService.getPublicEvacueeListMedium().then((data) => setCustomers(data));
        fetchData();
    }, []);
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
                                        }}
                                    />
                                    <div className="">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button mobile-input ",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            severity: "primary",
                                            type: "button",
                                            // onClick: () => searchListWithCriteria()
                                        }} />
                                    </div>
                                </div>
                            </form>
                            <div className="mt-3">
                                <NormalTable
                                    customActionsField="actions"
                                    value={customers} columns={columns}
                                    // loading={tableLoading}
                                    showGridlines={"true"}
                                    stripedRows={true}
                                    paginator={"true"}
                                    columnStyle={{ textAlign: "center" }}
                                    className={"custom-table-cell"}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginatorLeft={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
