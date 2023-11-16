import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { getYYYYMMDDHHSSSSDateTimeFormat, getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { ExternalEvacuationServices } from '@/services/external_evacuation.services';
import EvacueeDetailModal from './evacueeDetailModal';

export default function ExteranalEvacuationPage() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState({
        name: "--",
        id: 0
    });
    const [selectedSiteType, setSelectedSiteType] = useState({
        name: "--",
        id: 0
    });
    const [selectedFoodSupport, setSelectedFoodSupport] = useState({
        name: "--",
        id: 2
    });
    const [externalEvacueesList, setExternalEvacueesList] = useState([]);
    const [externalPersonCount, setExternalPersonCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [evacuationStatusOptions, setEvacuationStatusOptions] = useState([]);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: ""
        },
        food_required: "",
        evacuationCenter: "",
        place_category: ""
    });

    const [evacuee, setEvacuee] = useState(null);
    const [evacueeDetailsOpen, setEvacueeDetailsOpen] = useState(false);

    const evacuationFoodSupport = [
        { name: "--", id: 2 },
        { name: translate(localeJson, 'yes'), id: 1 },
        { name: translate(localeJson, 'no'), id: 0 },
    ];

    const evacuationSiteType = [
        { name: "--", id: 0 },
        { name: translate(localeJson, 'city_in'), id: 1 },
        { name: translate(localeJson, 'city_out'), id: 2 },
        { name: translate(localeJson, 'pref_out'), id: 3 },
    ];

    const externalEvacueesListColumns = [
        { field: "si_no", header: translate(localeJson, 'si_no'), className: "sno_class", sortable: false, textAlign: "center" },
        { field: "id", header: translate(localeJson, 'si_no'), minWidth: "7rem", sortable: false, display: 'none', className: "sno_class" },
        { field: "evacuation_site_type", header: translate(localeJson, 'shelter_site_type'), minWidth: "10rem", sortable: false },
        { field: "place", header: translate(localeJson, 'place_detail'), minWidth: "10rem",maxWidth:"10rem", sortable: false },
        { field: "food_support", header: translate(localeJson, 'food_support'), minWidth: "10rem", sortable: false },
        {
            field: "people_count", header: translate(localeJson, 'people_count'),
            minWidth: "5rem", sortable: false, textAlign: "right", alignHeader: "center",
            body: (rowData) => (
                rowData['people_count'] > 0 ?
                    <p className='text-link-class clickable-row' onClick={() => {
                        setEvacuee(rowData);
                        setEvacueeDetailsOpen(true);
                    }}>
                        {rowData['people_count']}
                    </p> : rowData['people_count']
            ),
        },
        { field: "shelter_place", header: translate(localeJson, 'shelter_place'), minWidth: "10rem", sortable: false },
        { field: "mail_address", header: translate(localeJson, 'mail_address'), minWidth: "10rem", sortable: false },
        { field: "post_code", header: translate(localeJson, 'postal_code'), minWidth: "8rem", sortable: false, textAlign: "right", alignHeader: "center" },
        { field: "prefecture", header: translate(localeJson, 'prefecture_symbol'), minWidth: "5rem", sortable: false },
        { field: "address", header: translate(localeJson, 'address'), minWidth: "12rem", sortable: false }
    ];

    /* Services */
    const { getList, exportExternalEvacueesCSVList, getPlaceDropdownList } = ExternalEvacuationServices;

    const downloadExternalEvacueesListCSV = () => {
        exportExternalEvacueesCSVList(getListPayload, exportExternalEvacueesCSV);
    }

    const exportExternalEvacueesCSV = (response) => {
        if (response.success) {
            const downloadLink = document.createElement("a");
            const fileName = "ExternalEvacuation_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
            downloadLink.href = response.result.filePath;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    };

    const onGetExternalEvacueesListOnMounting = () => {
        getList(getListPayload, getExternalEvacueesList)
    }

    const onGetPlaceDropdownListOnMounting = () => {
        getPlaceDropdownList({}, updatePlaceDropdownList)
    }

    const updatePlaceDropdownList = (response) => {
        let placeDropdownList = [{
            name: "--",
            id: 0
        }]
        if (response.success && !_.isEmpty(response.data) && response.data.model.length > 0) {
            const data = response.data.model;
            data.map((item) => {
                let option = {
                    name: locale == 'ja' ? item.name : item.name,
                    id: item.id
                };
                placeDropdownList.push(option);
            });
            setEvacuationStatusOptions(placeDropdownList);
        }
    }

    const getFormattedPostCode = (code) => {
        let newValue = code.toString();
        const formattedValue = newValue.substring(0, 3) + "-" + newValue.substring(3);
        return formattedValue;
    }

    const getExternalEvacueesList = (response) => {
        if (response.success && !_.isEmpty(response.data) && response.data.model.list.length > 0) {
            const data = response.data.model.list;
            let externalEvacueesList = [];
            data.map((item, index) => {
                let evacuees = {
                    si_no: index + 1,
                    id: item.id,
                    evacuation_site_type: item.place_category,
                    place: item.place_detail,
                    food_support: item.food_required ? item.food_required : translate(localeJson, 'no'),
                    people_count: item.external_person_count,
                    shelter_place: item.hinan_id,
                    mail_address: item.email,
                    post_code: item.zipcode ? getFormattedPostCode(item.zipcode) : "",
                    prefecture: item.prefecture_name,
                    address: item.address
                };
                externalEvacueesList.push(evacuees);
            })
            setTableLoading(false);
            setExternalEvacueesList(externalEvacueesList);
            setTotalCount(response.data.model.total);
            setExternalPersonCount(response.data.model.external_person_count)
        }

        else {
            setExternalEvacueesList([]);
            setTableLoading(false);
            setTotalCount(0);
        }
    }

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: 0,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc"
            },
            food_required: selectedFoodSupport && selectedFoodSupport.id != 2 ? selectedFoodSupport.id : "",
            evacuationCenter: selectedOption.id != 0 ? selectedOption.id : "",
            place_category: selectedSiteType.id != 0 ? selectedSiteType.id : ""
        }
        getList(payload, getExternalEvacueesList);
        setGetListPayload(payload);
    };

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

    const onEvacueeDetailClose = () => {
        setEvacuee(null);
        setEvacueeDetailsOpen(false);
    };

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetExternalEvacueesListOnMounting();
            await onGetPlaceDropdownListOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    return (
        <>
            {evacuee && <EvacueeDetailModal
                open={evacueeDetailsOpen}
                close={onEvacueeDetailClose}
                evacuee={evacuee}
            />}
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                            <h5 className='page-header1'>{translate(localeJson, 'external_evacuee_details')}</h5>
                            <span>{translate(localeJson, 'external_evacuees_count') + ": " + externalPersonCount + "人"}</span>
                        </div>
                        <hr />
                        <div className='flex justify-content-end'>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => downloadExternalEvacueesListCSV()
                                }} parentClass={"mb-3"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <form>
                                    <div className='mt-2 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                        <InputSelectFloatLabel
                                            dropdownFloatLabelProps={{
                                                id: "evacueeSiteType",
                                                value: selectedSiteType,
                                                options: evacuationSiteType,
                                                optionLabel: "name",
                                                inputSelectClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                                style: { height: "40px" },
                                                onChange: (e) => setSelectedSiteType(e.value),
                                                text: translate(localeJson, 'shelter_site_type')
                                            }}
                                            parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem"
                                        />
                                        <InputSelectFloatLabel
                                            dropdownFloatLabelProps={{
                                                id: "evacuationCity",
                                                value: selectedOption,
                                                options: evacuationStatusOptions,
                                                optionLabel: "name",
                                                inputSelectClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                                style: { height: "40px" },
                                                onChange: (e) => setSelectedOption(e.value),
                                                text: translate(localeJson, 'shelter_place'),
                                                disabled: selectedSiteType.id == 2 || selectedSiteType.id == 3
                                            }}
                                            parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem"
                                        />
                                        <InputSelectFloatLabel
                                            dropdownFloatLabelProps={{
                                                id: "evacueeFoodSupport",
                                                value: selectedFoodSupport,
                                                options: evacuationFoodSupport,
                                                optionLabel: "name",
                                                inputSelectClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                                style: { height: "40px" },
                                                onChange: (e) => setSelectedFoodSupport(e.value),
                                                text: translate(localeJson, 'food_support'),
                                                custom: "mobile-input",
                                                disabled: selectedSiteType.id == 2 || selectedSiteType.id == 3
                                            }}
                                            parentClass="w-20rem lg:w-13rem md:w-14rem sm:w-10rem"
                                        />
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button mobile-input ",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary",
                                                type: "button",
                                                onClick: () => searchListWithCriteria()
                                            }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <NormalTable
                            lazy
                            id={"external-evacuation-list"}
                            totalRecords={totalCount}
                            loading={tableLoading}
                            size={"small"}
                            stripedRows={true}
                            paginator={"true"}
                            showGridlines={"true"}
                            value={externalEvacueesList}
                            columns={externalEvacueesListColumns}
                            emptyMessage={translate(localeJson, "data_not_found")}
                            first={getListPayload.filters.start}
                            rows={getListPayload.filters.limit}
                            paginatorLeft={true}
                            onPageHandler={(e) => onPaginationChange(e)}
                        />

                        <div className='mt-3 flex justify-content-center'>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    buttonClass: "text-600 w-8rem",
                                    bg: "bg-white",
                                    hoverBg: "hover:surface-500 hover:text-white",
                                    text: translate(localeJson, 'back'),
                                    onClick: () => router.push('/admin/external/family'),
                                }} parentClass={"mb-3"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}