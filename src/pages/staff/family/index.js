import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getGeneralDateTimeSlashDisplayFormat, getJapaneseDateDisplayFormat, getYYYYMMDDHHSSSSDateTimeFormat, getValueByKeyRecursively as translate } from "@/helper";
import { Button, InputFloatLabel, NormalTable } from '@/components';
import { StaffEvacuationServices } from '@/services/staff_evacuation.services';
import { PersonCountModal } from '@/components/modal';
import Link from 'next/link';

function StaffFamily() {
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
    const { getList, exportEvacueesCSVList } = StaffEvacuationServices;

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

    const staffFamilyColumns = [
        { field: 'si_no', header: translate(localeJson, 'si_no'), sortable: false, textAlign: 'left', minWidth: "4rem" },
        { field: 'id', header: translate(localeJson, 'si_no'), headerClassName: "custom-header", display: "none" },
        { field: 'family_count', header: translate(localeJson, 'number_of_household'), headerClassName: "custom-header", minWidth: "6rem" },
        { field: 'family_code', header: translate(localeJson, 'family_code'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'is_owner', header: translate(localeJson, 'household_representative'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'refugee_name', header: translate(localeJson, 'name_phonetic'), headerClassName: "custom-header", minWidth: "9rem" },
        { field: 'name', header: translate(localeJson, 'name_kanji'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'gender', header: translate(localeJson, 'gender'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'dob', header: translate(localeJson, 'dob'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'age', header: translate(localeJson, 'age'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'age_month', header: translate(localeJson, 'age_m'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'special_care_name', header: translate(localeJson, 'special_Care_type'), headerClassName: "custom-header", minWidth: "8rem" },
        { field: 'connecting_code', header: translate(localeJson, 'connecting_code'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'remarks', header: translate(localeJson, 'remarks'), headerClassName: "custom-header", minWidth: "5rem" },
        { field: 'date_created', header: translate(localeJson, 'date_created'), headerClassName: "custom-header", minWidth: "7rem" },
        { field: 'out_date', header: translate(localeJson, 'evacuation_days'), headerClassName: "custom-header", minWidth: "6rem" },

    ];

    const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] = useState(false);

    /**
     * CommonDialog modal close
     */
    const onClickCancelButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    /**
     * CommonDialog modal open
     */
    const onClickOkButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesListOnMounting();
            setLoader(false);
        };
        fetchData();
    }, []);

    const downloadEvacueesListCSV = () => {
        exportEvacueesCSVList(getListPayload, exportEvacueesCSV);
    }

    const exportEvacueesCSV = (response) => {
        if (response.success) {
            const downloadLink = document.createElement("a");
            const fileName = "StaffFamily_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
            downloadLink.href = response.result.filePath;
            downloadLink.download = fileName;
            downloadLink.click();
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
            place_id: getListPayload.place_id,
            family_code: familyCode,
            refugee_name: refugeeName
        }
        getList(payload, onGetEvacueesList);
        setGetListPayload(payload);
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

    /**
     * Get Evacuees list on mounting
     */
    const onGetEvacueesListOnMounting = () => {
        getList(getListPayload, onGetEvacueesList);
    }

    const onGetEvacueesList = (response) => {
        let evacuationColumns = [...staffFamilyColumns];
        if (response.success && !_.isEmpty(response.data) && response.data.list.length > 0) {
            const data = response.data.list;
            const questionnaire = response.data.questionnaire;
            let evacueesList = [];
            let index;
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
                    "family_code": item.families.family_code,
                    "is_owner": item.is_owner == 0 ? translate(localeJson, 'representative') : "",
                    "refugee_name": <Link className="text-higlight" href={{
                        pathname: '/staff/family/family-detail',
                        query: { family_id: item.family_id }
                    }}>{item.refugee_name}</Link>,
                    "name": item.name,
                    "gender": getGenderValue(item.gender),
                    "dob": getJapaneseDateDisplayFormat(item.dob),
                    "age": item.age,
                    "age_month": item.month,
                    "special_care_name": item.special_cares ? getSpecialCareName(item.special_cares) : "-",
                    "remarks": item.note,
                    "place": response.locale == 'ja' ? (item.families.place ? item.families.place.name : (item.families.place ? item.families.place.name_en : "")) : "",
                    "connecting_code": item.connecting_code,
                    "out_date": item.families.out_date ? getGeneralDateTimeSlashDisplayFormat(item.families.out_date) : "",
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

    return (
        <>
            <PersonCountModal
                open={staffFamilyDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'evacuee_registration_for_household_family')}
                content={
                    <div>
                        <div className='pb-3'>
                            <h5 className='modal-page-header2'>{translate(localeJson, 'how_many_people_evacuated')}</h5>
                        </div>
                        <div className='pb-1'>
                            <p className='pb-0'>{translate(localeJson, 'please_tell_how_many_households')}
                            </p>
                            <p className='pb-1'>{translate(localeJson, 'do_not_register_each_member_family_individually')}
                            </p>
                        </div>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "text-600 w-8rem",
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => onClickCancelButton(),
                        },
                        parentClass: "inline"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-8rem",
                            type: "submit",
                            text: translate(localeJson, 'continue'),
                            severity: "primary",
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
                            <h5 className='page-header1'>{translate(localeJson, 'list_of_evacuees')}</h5>
                            <span>{translate(localeJson, 'total_summary') + ": " +  familyCount  + translate(localeJson, 'people')}</span>
                        </div>
                        <hr />
                        <div>
                            <div>
                                <form>
                                    <div className='mt-5 mb-3 flex flex-wrap align-items-center justify-content-end gap-2 mobile-input'>
                                        <InputFloatLabel
                                            inputFloatLabelProps={{
                                                id: "familyCode",
                                                inputId: "integeronly",
                                                name: "familyCode",
                                                text: translate(localeJson, "family_code"),
                                                value: familyCode,
                                                onChange: (e) => handleFamilyCode(e),
                                                inputNumberClass: "w-20rem lg:w-13rem md:w-14rem sm:w-10rem",
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
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
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
                                    onClick: () => downloadEvacueesListCSV(),
                                    severity: "primary",
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'signup'),
                                    onClick: () => setStaffFamilyDialogVisible(true),
                                    severity: "success",
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div className="mt-3">
                                <NormalTable
                                 lazy
                                 id={"evacuation-list"}
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
                                    // lazy
                                    // id={"evacuation-list"}
                                    // className="evacuation-list"
                                    // totalRecords={totalCount}
                                    // loading={tableLoading}
                                    // size={"small"}
                                    // stripedRows={true}
                                    // paginator={"true"}
                                    // showGridlines={"true"}
                                    // customActionsField="actions"
                                    // value={evacueesDataList}
                                    // columns={evacuationTableFields}
                                    // columnStyle={{ textAlign: "center" }}
                                    // emptyMessage={translate(localeJson, "data_not_found")}
                                    // first={getListPayload.filters.start}
                                    // rows={getListPayload.filters.limit}
                                    // paginatorLeft={true}
                                    // onPageHandler={(e) => onPaginationChange(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StaffFamily;