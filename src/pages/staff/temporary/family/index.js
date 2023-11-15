import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { QrCodeModal } from '@/components/modal';
import { MdFlipCameraIos } from 'react-icons/md';
import { getGeneralDateTimeSlashDisplayFormat, getJapaneseDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, getNumberOfEvacuationDays, getYYYYMMDDHHSSSSDateTimeFormat, getValueByKeyRecursively as translate } from "@/helper";
import { TemporaryStaffRegistrantServices } from '@/services/staff_temporary_registrants.services';

function TemporaryRegistrants() {
    const router = useRouter();
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const [familyCount, setFamilyCount] = useState(0);
    const [evacueesDataList, setEvacueesDataList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [placeID, setPlaceID] = useState(!_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "")
    const [familyCode, setFamilyCode] = useState(null);
    const [refugeeName, setRefugeeName] = useState(null);
    const [evacuationTableFields, setEvacuationTableFields] = useState([]);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc"
        },
        place_id: placeID,
        family_code: "",
        refugee_name: ""

    });

    /* Services */
    const { getList, exportTemporaryEvacueesCSVList, updateCheckInDetail } = TemporaryStaffRegistrantServices;

    const handleFamilyCode = (e) => {
        if ((e.target.value).length == 4) {
            const newValue = e.target.value;
            if (newValue.indexOf("-") !== -1) {
                setFamilyCode(e.target.value);
            }
            else {
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
    const temporaryRegistrantsColumns = [
        {
            field: 'actions',
            header: translate(localeJson, 'action'),
            textAlign: "center",
            minWidth: "10rem",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'check_in'),
                        buttonClass: "text-primary ",
                        bg: "bg-white",
                        hoverBg: "hover:bg-primary hover:text-white",
                        onClick: () => updateCheckInStatus(rowData)
                    }} />
                </div>
            ),
        },
        { field: 'si_no', header: translate(localeJson, 'si_no'), sortable: false, textAlign: 'left', minWidth: "4rem" },
        { field: 'id', header: translate(localeJson, 'si_no'), headerClassName: "custom-header", display: 'none' },
        { field: 'family_count', header: translate(localeJson, 'number_of_household'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'family_code', header: translate(localeJson, 'family_code'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'is_owner', header: translate(localeJson, 'household_representative'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'refugee_name', header: translate(localeJson, 'name_phonetic'), headerClassName: "custom-header", minWidth: "9rem"},
        { field: 'name', header: translate(localeJson, 'name_kanji'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'gender', header: translate(localeJson, 'gender'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'dob', header: translate(localeJson, 'dob'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'age', header: translate(localeJson, 'age'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'age_month', header: translate(localeJson, 'age_month'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'special_care_name', header: translate(localeJson, 'special_Care_type'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'connecting_code', header: translate(localeJson, 'connecting_code'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'check_in_date', header: translate(localeJson, 'date_created'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'evacuation_days', header: translate(localeJson, 'evacuation_days'), headerClassName: "custom-header", minWidth: "6rem" },

    ];
    const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] = useState(false);

    /**
     * CommonDialog modal close
     */
    const onClickCancelButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    const updateCheckInStatus = (rowData) => {
        let param = {
            place_id: getListPayload.place_id,
            family_id: rowData.id
        }
        updateCheckInDetail(param, (response) => {
            if (response.success) {
               getList(getListPayload, onGetEvacueesList)
            }
        });
    }

    /**
     * CommonDialog modal open
     */
    const onClickOkButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    const downloadEvacueesListCSV = () => {
        exportTemporaryEvacueesCSVList(getListPayload, exportEvacueesCSV);
    }

    const exportEvacueesCSV = (response) => {
        if (response.success) {
            const downloadLink = document.createElement("a");
            const fileName = "TemporaryRegistrants_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
            downloadLink.href = response.result.filePath;
            downloadLink.download = fileName;
            downloadLink.click();
        }
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

    const getAnswerData = (answer) => {
        let answerData = null;
        answer.map((item) => {
            answerData = answerData ? (answerData + ", " + item) : item
        });
        return answerData;
    }

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: 0,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc"
            },
            place_id: getListPayload.place_id,
            family_code: familyCode,
            refugee_name: refugeeName
        }
        getList(payload, onGetEvacueesList);
        setGetListPayload(payload);
    }

    /**
     * Get Evacuees list on mounting
     */
    const onGetTemporaryRegistrantListOnMounting = () => {
        getList(getListPayload, onGetEvacueesList);
    }

    const onGetEvacueesList = (response) => {
        let evacuationColumns = [...temporaryRegistrantsColumns];
        if (response.success && !_.isEmpty(response.data) && response.data.list.length > 0) {
            const data = response.data.list;
            const questionnaire = response.data.questionnaire;
            let evacueesList = [];
            let index = 0;
            let previousItem = null;
            let siNo = getListPayload.filters.start + 1;
            if (questionnaire.length > 0) {
                questionnaire.map((ques, num) => {
                    let column = {
                        field: "question_" + ques.id,
                        header: (locale == "ja" ? ques.title : ques.title_en),
                        minWidth: "10rem",
                        display: "none"
                    };
                    evacuationColumns.push(column);
                });
            }
            setEvacuationTableFields(evacuationColumns);

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
                    "family_code": item.temp_families.family_code,
                    "is_owner": item.is_owner == 0 ? translate(localeJson, 'representative') : "",
                    "refugee_name": <Link className="text-higlight" href={{
                        pathname: '/staff/temporary/family-detail',
                        query: { family_id: item.family_id }
                    }}>{item.refugee_name}</Link>,
                    "name": item.name,
                    "gender": getGenderValue(item.gender),
                    "dob": item.dob ? getJapaneseDateDisplayYYYYMMDDFormat(item.dob) : "",
                    "age": item.age,
                    "age_month": item.month,
                    "special_care_name": item.special_cares ? getSpecialCareName(item.special_cares) : "-",
                    "remarks": item.note,
                    "place": response.locale == 'ja' ? (item.temp_families.place ? item.temp_families.place.name : (item.temp_families.place ? item.temp_families.place.name_en : "")) : "",
                    "connecting_code": item.connecting_code,
                    "check_in_date": item.created_at ? getGeneralDateTimeSlashDisplayFormat(item.created_at) : "",
                    "evacuation_days": item.created_at ? getNumberOfEvacuationDays(item.created_at): ""
                };
                if (item.add_question.length > 0) {
                    item.add_question.map((ques) => {
                        evacuees[`question_${ques.question_id}`] = (locale == 'ja' ? (ques.answer.length > 0 ? getAnswerData(ques.answer) : "") : (ques.answer_en.length > 0 ? getAnswerData(ques.answer_en) : ""));
                    })
                }
                previousItem = evacuees;
                evacueesList.push(evacuees);
                siNo = siNo + 1;
            });
            setEvacuationTableFields(evacuationColumns);
            setEvacueesDataList(evacueesList);
            setFamilyCount(response.data.total_family);
            setTableLoading(false);
            setTotalCount(response.data.count);
        }
        else {
            setEvacueesDataList([]);
            setEvacuationTableFields(evacuationColumns);
            setTableLoading(false);
            setTotalCount(0);
            setFamilyCount(0);
        }
    }

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetTemporaryRegistrantListOnMounting();
            setLoader(false);
        };
        fetchData();
    }, [locale, getListPayload]);

    

    return (
        <>
            <QrCodeModal
                open={staffFamilyDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'qr_Code_scan')}
                position={"center"}
                footerParentClassName={"text-left"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-5rem",
                            type: "submit",
                            severity: "primary",
                            icon: <MdFlipCameraIos size={"30px"} />,
                            onClick: () => onClickOkButton(),
                        },
                        parentClass: "inline"
                    }
                ]}
                close={() => {
                    setStaffFamilyDialogVisible(false);
                }}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                            <h5 className='page-header1'>{translate(localeJson, 'temporary_registrants')}</h5>
                            <span>{translate(localeJson, 'total_summary') + ": " + familyCount + translate(localeJson, 'people')}</span>
                        </div>
                        <hr />
                        <div>
                            <div>
                                <form>
                                    <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                        <InputFloatLabel
                                            inputFloatLabelProps={{
                                                inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                                text: translate(localeJson, "family_code"),
                                                value: familyCode,
                                                onChange: (e) => handleFamilyCode(e),
                                            }}
                                        />
                                        <InputFloatLabel
                                            inputFloatLabelProps={{
                                                inputClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
                                                text: translate(localeJson, 'name'),
                                                custom: "mobile-input custom_input",
                                                value: refugeeName,
                                                onChange: (e) => setRefugeeName(e.target.value)
                                            }}
                                        />
                                        <div className="flex">
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button mobile-input ",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                severity: "primary",
                                                type: "button",
                                                onClick: () => searchListWithCriteria()
                                            }} parentClass="inline pr-2" />
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button mobile-input ",
                                                text: translate(localeJson, 'qr_search'),
                                                severity: "primary",
                                                type: "button",
                                                onClick: () => setStaffFamilyDialogVisible(true),
                                            }} parentClass="inline" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'list_of_evacuees'),
                                    onClick: () => router.push('/staff/family'),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'back_to_top'),
                                    onClick: () => router.push('/staff/dashboard'),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary",
                                    onClick: () => downloadEvacueesListCSV(),
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div className="mt-3">
                                <NormalTable
                                    customActionsField="actions"
                                    lazy
                                    id="evacuation-list"
                                    className="evacuation-list"
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    size={"small"}
                                    stripedRows={true}
                                    paginator={"true"}
                                    showGridlines={"true"}
                                    value={evacueesDataList}
                                    columns={evacuationTableFields}
                                    emptyMessage={translate(localeJson, "data_not_found")}
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
        </>
    )
}

export default TemporaryRegistrants;