import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { getJapaneseDateDisplayFormat, getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { ExternalEvacuationServices } from '@/services/external_evacuation.services';

export default function EvacuationPage() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const param = router.query;
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [externalEvacueesList, setExternalEvacueesList] = useState([]);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10
        },
        evacuee_id: param.evacuee_id
    });

    const externalEvacueesDetailColumns = [
        { field: "si_no", header: translate(localeJson, "si_no"),className: "sno_class",sortable: false },
        { field: "id", header: translate(localeJson, "id"), minWidth: "7rem", sortable: false, display: 'none' },
        { field: "refugee_name", header: translate(localeJson, "refugee_name"), minWidth: "10rem", sortable: false },
        { field: "dob", header: translate(localeJson, "dob"), minWidth: "7rem", sortable: false },
        { field: "age", header: translate(localeJson, "age"), minWidth: "10rem", sortable: false },
        { field: "gender", header: translate(localeJson, "gender"), minWidth: "5rem", sortable: false }
    ]

    /* Services */
    const { getExternalEvacueesDetail } = ExternalEvacuationServices;

    const onGetExternalEvacueesFamilyDetailOnMounting = () => {
        getExternalEvacueesDetail(getListPayload, bindExternalEvacueesDetail);
    }

    const bindExternalEvacueesDetail = (response) => {
        if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
            const data = response.data.model.list;
            console.log(data)
            let externalEvacueesDetailList = [];
            data.map((item, index) => {
                let evacueeDetail = {
                    si_no: index + 1,
                    id: item.id,
                    refugee_name: item.name_furigana,
                    dob: getJapaneseDateDisplayFormat(item.dob),
                    age: item.age,
                    gender: item.gender
                };
                externalEvacueesDetailList.push(evacueeDetail);
            });
            setExternalEvacueesList(externalEvacueesDetailList);
            setTotalCount(response.data.model.total);
            setTableLoading(false);
        }
        else {
            setTotalCount(0);
            setTableLoading(false);
            setExternalEvacueesList([]);
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

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetExternalEvacueesFamilyDetailOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div>
                        <h5 className='page-header1'>{translate(localeJson, 'external_evacuee_details')}</h5>
                    </div>
                    <hr />
                    <NormalTable
                        size={"small"}
                        stripedRows={true}
                        paginator={"true"}
                        showGridlines={"true"}
                        totalRecords={totalCount}
                        loading={tableLoading}
                        value={externalEvacueesList}
                        columns={externalEvacueesDetailColumns}
                        emptyMessage={translate(localeJson, "data_not_found")}
                        first={getListPayload.filters.start}
                        rows={getListPayload.filters.limit}
                        paginatorLeft={true}
                        onPageHandler={(e) => onPaginationChange(e)}
                        parentClass={"mt-3"}
                    />
                    <div className='mt-3 flex justify-content-center'>
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                buttonClass: "text-600 w-8rem",
                                bg: "bg-white",
                                hoverBg: "hover:surface-500 hover:text-white",
                                text: translate(localeJson, 'back'),
                                onClick: () => router.push('/admin/external/family/list'),
                            }} parentClass={"mb-3"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}