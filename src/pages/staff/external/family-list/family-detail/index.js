import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import _ from 'lodash';
import { IoIosArrowBack } from "react-icons/io";

import {
    getValueByKeyRecursively as translate,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateDisplayFormat
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, NormalTable } from '@/components';
import { useAppSelector } from "@/redux/hooks";
import { ExternalEvacueesService } from '@/services';

export default function EventFamilyDetail() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const param = useAppSelector((state) => state.familyReducer.staffExternalFamily);

    const [tableLoading, setTableLoading] = useState(false);
    const [externalDataset, setExternalDataset] = useState(null);

    const externalColumns = [
        { field: "si_no", header: translate(localeJson, 'number'), sortable: false, className: "sno_class", textAlign: "left", alignHeader: "left" },
        {
            field: 'name', header: translate(localeJson, 'name_public_evacuee'), sortable: false, alignHeader: "left",
            body: (rowData) => {
                return <div className="flex flex-column">
                    <div className="text-highlighter-user-list">{rowData.name_kanji}</div>
                    <div>{rowData.name_furigana}</div>
                </div>
            },
        },
        { field: "gender", header: translate(localeJson, 'gender'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "dob", header: translate(localeJson, 'dob'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "age", header: translate(localeJson, 'age'), sortable: false, textAlign: 'center', alignHeader: "center", minWidth: '3rem', maxWidth: '3rem' },
    ];

    /* Services */
    const { getEvacueeList } = ExternalEvacueesService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyAttendeesDetailOnMounting();
        };
        fetchData();
    }, [locale]);

    const onGetEvacueesFamilyAttendeesDetailOnMounting = () => {
        getEvacueeList(param, getEvacueesFamilyAttendeesDetail);
    }

    const getEvacueesFamilyAttendeesDetail = (response) => {
        var externalArray = [];
        if (response?.success && !_.isEmpty(response?.data) && response?.data?.externalEvacueeDetailList?.list.length > 0) {
            const data = response.data.externalEvacueeDetailList.list;
            data.map((item, index) => {
                let preparedData = {
                    ...item,
                    si_no: index + 1,
                    dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(item.dob) : getEnglishDateDisplayFormat(item.dob),
                };
                externalArray.push(preparedData);
            })
        }
        setTableLoading(false);
        setExternalDataset(externalArray);
    }

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "external_evacuees_list_detail_back"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/staff/external/family-list'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "external_evacuee_details")} />
                        <NormalTable
                            size={"small"}
                            loading={tableLoading}
                            emptyMessage={translate(localeJson, "data_not_found")}
                            stripedRows={true}
                            paginator={false}
                            showGridlines={true}
                            value={externalDataset}
                            columns={externalColumns}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}