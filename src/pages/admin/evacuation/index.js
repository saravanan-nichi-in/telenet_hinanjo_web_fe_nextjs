import React, { useState, useContext, useEffect } from 'react';
import _ from 'lodash';

import { getGeneralDateTimeSlashDisplayFormat, getJapaneseDateDisplayFormat, getYYYYMMDDHHSSSSDateTimeFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable } from '@/components';
import { InputFloatLabel } from '@/components/input';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { EvacuationServices } from '@/services/evacuation.services';
import Link from 'next/link';

export default function EvacuationPage() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const [familyCount, setFamilyCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({
        name: "--",
        id: 0
    });
    const [evacueesDataList, setEvacueesDataList] = useState([]);
    const [evacuationPlaceList, setEvacuationPlaceList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [familyCode, setFamilyCode] = useState(null);
    const [refugeeName, setRefugeeName] = useState(null);
    const [emptyTableMessage, setEmptyTableMessage] = useState(null);
    const [evacuationTableFields, setEvacuationTableFields] = useState([]);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
            place_id: "",
            family_code: "",
            refugee_name: ""
        }
    });

    const evacuationTableColumns = [
        { field: 'si_no', header: translate(localeJson, 'si_no'), sortable: false, textAlign: 'left', minWidth: "5rem" },
        { field: 'id', header: 'ID', sortable: false, textAlign: 'left', minWidth: "5rem", display: 'none' },
        { field: 'family_count', header: translate(localeJson, 'family_count'), sortable: false, textAlign: 'left', minWidth: "6rem" },
        { field: 'family_code', header: translate(localeJson, 'family_code'), minWidth: "6rem", sortable: false, textAlign: 'left' },
        { field: 'is_owner', header: translate(localeJson, 'representative'), sortable: false, textAlign: 'left', minWidth: '5rem' },
        { field: 'refugee_name', header: translate(localeJson, 'refugee_name'), minWidth: "12rem", sortable: false, textAlign: 'left' },
        { field: "name", header: translate(localeJson, 'name'), sortable: false, textAlign: 'left', minWidth: "8rem" },
        { field: "gender", header: translate(localeJson, 'gender'), sortable: false, textAlign: 'left', minWidth: "8rem" },
        { field: "dob", header: translate(localeJson, 'dob'), minWidth: "10rem", sortable: false, textAlign: 'left' },
        { field: "age", header: translate(localeJson, 'age'), sortable: false, textAlign: 'left', minWidth: "5rem", display: 'none' },
        { field: "age_month", header: translate(localeJson, 'age_month'), sortable: false, textAlign: 'left', minWidth: "7rem", display: 'none' },
        { field: "special_care_name", header: translate(localeJson, 'special_care_name'), minWidth: "10rem", sortable: false, textAlign: 'left', display: 'none' },
        { field: "connecting_code", header: translate(localeJson, 'connecting_code'), minWidth: "7rem", sortable: false, textAlign: 'left', display: 'none' },
        { field: "remarks", header: translate(localeJson, 'remarks'), sortable: false, textAlign: 'left', minWidth: "8rem", display: 'none' },
        { field: "place", header: translate(localeJson, 'shelter_place'), sortable: false, textAlign: 'left', minWidth: "12rem", display: 'none' },
        { field: "out_date", header: translate(localeJson, 'out_date'), sortable: false, textAlign: 'left', minWidth: "9rem", display: 'none' }
    ];

    const downloadEvacueesListCSV = () => {
        exportEvacueesCSVList(getListPayload, exportEvacueesCSV);
    }

    const exportEvacueesCSV = (response) => {
        if (response.success) {
            const downloadLink = document.createElement("a");
            const fileName = "Evacuation_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
            downloadLink.href = response.result.filePath;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    }

    /**
     * Get Evacuees list on mounting
     */
    const onGetEvacueesListOnMounting = () => {
        getList(getListPayload, onGetEvacueesList);
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

    const getSpecialCareName = (nameList) => {
        let specialCareName = null;
        nameList.map((item) => {
            specialCareName = specialCareName ? (specialCareName + ", " + item.name) : item.name;
        });
        return specialCareName;
    }

    const onGetEvacueesList = (response) => {
        let evacuationColumns = [...evacuationTableColumns];
        if (response.success && !_.isEmpty(response.data) && response.data.list.length > 0) {
            const data = response.data.list;
            const questionnaire = response.data.questionnaire;
            const places = response.places;
            let evacueesList = [];
            let placesList = [{
                name: "--",
                id: 0
            }];
            let index;
            let previousItem = null;
            let siNo = getListPayload.filters.start + 1;
            if (questionnaire.length > 0) {
                questionnaire.map((ques, num) => {
                    let column = {
                        field: "question_" + num,
                        header: (locale == "ja" ? ques.title : ques.title_en),
                        minWidth: "10rem"
                    };
                    evacuationColumns.push(column);
                });
            }
            data.map((item, i) => {
                if (previousItem && previousItem.id == item.family_id) {
                    index = index + 1;
                } else {
                    if (evacueesDataList.length > 0 && data.indexOf(item) === 0) {
                        let evacueesData = evacueesDataList[evacueesDataList.length - 1];
                        if (evacueesData.id == item.family_id) {
                            index = evacueesData.family_count + 1;
                        }
                        else {
                            index = 1;
                        }
                    }
                    else {
                        index = 1;
                    }
                }
                let evacuees = {
                    "si_no": siNo,
                    "id": item.family_id,
                    "family_count": index,
                    "family_code": item.families.family_code,
                    "is_owner": item.is_owner == 0 ? translate(localeJson, 'representative') : "",
                    "refugee_name": <Link className="text-higlight" href={{
                        pathname: '/admin/evacuation/family-detail',
                        query: { family_id: item.family_id }
                    }}>{item.refugee_name}</Link>,
                    "name": item.name,
                    "gender": getGenderValue(item.gender),
                    "dob": getJapaneseDateDisplayFormat(item.dob),
                    "age": item.age,
                    "age_month": item.age_month,
                    "special_care_name": item.special_cares ? getSpecialCareName(item.special_cares) : "-",
                    "remarks": item.note,
                    "place": response.locale == 'ja' ? (item.families.place ? item.families.place.name : (item.families.place ? item.families.place.name_en : "")) : "",
                    "connecting_code": item.connecting_code,
                    "out_date": item.families.out_date ? getGeneralDateTimeSlashDisplayFormat(item.families.out_date) : "",
                };

                if (questionnaire.length > 0) {
                    questionnaire.map((ques, num) => {
                        evacuees[`question_${num}`] = ques.answer ? getAnswerData(ques.answer.answer) : "";
                    })
                }
                previousItem = evacuees;
                evacueesList.push(evacuees);
                siNo = siNo + 1;
            });
            places.map((place) => {
                let placeData = {
                    name: response.locale == 'ja' ? place.name : place.name,
                    id: place.id
                }
                placesList.push(placeData);
            });
            setEvacuationTableFields(evacuationColumns);
            setEvacueesDataList(evacueesList);
            setFamilyCount(response.data.total_family);
            setTableLoading(false);
            setEvacuationPlaceList(placesList);
            setTotalCount(response.data.count);
        }
        else {
            setEvacueesDataList([]);
            setEvacuationTableFields(evacuationColumns);
            setEmptyTableMessage(response.message);
            setTableLoading(false);
            setTotalCount(0);
            setFamilyCount(0);
        }
    }

    const getAnswerData = (answer) => {
        let answerData = null;
        answer.map((item) => {
            answerData = answerData ? (answerData + ", " + item) : item
        });
        return answerData;
    }

    /* Services */
    const { getList, exportEvacueesCSVList } = EvacuationServices;

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
            await onGetEvacueesListOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: 0,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc",
                place_id: selectedOption && selectedOption.id != 0 ? selectedOption.id : "",
                family_code: familyCode,
                refugee_name: refugeeName
            }
        }
        getList(payload, onGetEvacueesList);
        setGetListPayload(payload);
    }

    const handleFamilyCode = (e) => {
        if ((e.target.value).length == 4) {
            const newValue = e.target.value;
            if (newValue.indexOf("-") !== -1) {
                setFamilyCode(e.target.value);
            }
            else{
                const formattedValue = newValue.substring(0, 3) + "-" + newValue.substring(3);
                setFamilyCode(formattedValue);
            }
        }
        else if ((e.target.value).length == 3) {
            const newValue = e.target.value;
            const formattedValue = newValue.substring(0, 3);
            setFamilyCode(formattedValue);
        }
        else {
            setFamilyCode(e.target.value)
        }
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <h5 className='page-header1'>{translate(localeJson, 'list_of_evacuees')}</h5>
                    <hr />
                    <div>
                        <div>
                            <form>
                                <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                    <InputSelectFloatLabel
                                        dropdownFloatLabelProps={{
                                            id: "evacuationCity",
                                            value: selectedOption,
                                            options: evacuationPlaceList,
                                            optionLabel: "name",
                                            inputSelectClass: "w-20rem lg:w-14rem md:w-14rem sm:w-10rem",
                                            onChange: (e) => setSelectedOption(e.value),
                                            text: translate(localeJson, 'evacuation_site')
                                        }}
                                        parentClass="w-20rem lg:w-14rem md:w-14rem sm:w-10rem"
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            id: 'householdNumber',
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'household_number'),
                                            value: familyCode,
                                            onChange: (e) => handleFamilyCode(e)
                                        }}
                                    />
                                    <InputFloatLabel
                                        inputFloatLabelProps={{
                                            id: 'fullName',
                                            inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                            text: translate(localeJson, 'name'),
                                            custom: "mobile-input custom_input",
                                            value: refugeeName,
                                            onChange: (e) => setRefugeeName(e.target.value)
                                        }}
                                    />
                                    <div className="">
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <p className='pt-4 page-header2 font-bold'>{translate(localeJson, "totalSummary")}: {familyCount}</p>
                            </div>
                            <div className='flex pt-3' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    onClick: () => downloadEvacueesListCSV()
                                }} parentClass={"mb-3"} />
                            </div>
                        </div>
                    </div>
                    <NormalTable
                        lazy
                        id={"evacuation-list"}
                        totalRecords={totalCount}
                        loading={tableLoading}
                        size={"small"}
                        stripedRows={true}
                        paginator={"true"}
                        showGridlines={"true"}
                        value={evacueesDataList}
                        columns={evacuationTableFields}
                        emptyMessage={emptyTableMessage}
                        first={getListPayload.filters.start}
                        rows={getListPayload.filters.limit}
                        paginatorLeft={true}
                        onPageHandler={(e) => onPaginationChange(e)}
                    />
                </div>
            </div>
        </div>
    )
}