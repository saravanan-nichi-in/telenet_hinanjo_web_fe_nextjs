import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useAppDispatch } from '@/redux/hooks';
import toast from 'react-hot-toast';

import { LayoutContext } from '@/layout/context/layoutcontext';
import {
    Button,
    CommonDialog,
    CustomHeader,
    NormalTable,
    Input,
    BarcodeDialog,
    YappleModal
} from '@/components';
import {
    convertToSingleByte,
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getJapaneseDateTimeDisplayActualFormat,
    hideOverFlow,
    showOverFlow,
    getValueByKeyRecursively as translate,
    getSpecialCareName
} from "@/helper";
import { TemporaryStaffRegistrantServices } from '@/services/staff_temporary_registrants.services';
import { setStaffTempFamily } from '@/redux/family';
import { useAppSelector } from "@/redux/hooks";
import { TempRegisterServices } from '@/services';

function TemporaryRegistrants() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useAppSelector((state) => state.layoutReducer);

    const [openBarcodeDialog, setOpenBarcodeDialog] = useState(false);
    const [openBasicDataInfoDialog, setOpenBasicDataInfoDialog] = useState(false);
    const [basicDataInfo, setBasicDataInfo] = useState(null);

    const [familyCount, setFamilyCount] = useState(0);
    const [evacueesDataList, setEvacueesDataList] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [placeID, setPlaceID] = useState(!_.isNull(layoutReducer?.user?.place?.id) ? layoutReducer?.user?.place?.id : "")
    const [familyCode, setFamilyCode] = useState(null);
    const [refugeeName, setRefugeeName] = useState(null);
    const [evacuationTableFields, setEvacuationTableFields] = useState([]);
    const temporaryRegistrantsColumns = [
        { field: 'number', header: translate(localeJson, 'si_no'), sortable: false, textAlign: 'center', minWidth: "3rem", alignHeader: 'left', className: "sno_class" },
        { field: 'id', header: 'ID', sortable: false, textAlign: 'left', minWidth: "3rem", display: 'none' },
        {
            field: 'person_refugee_name', header: translate(localeJson, 'name_public_evacuee'), minWidth: "7rem",
            sortable: true, textAlign: 'left', alignHeader: "left",
            body: (rowData) => {
                return <div className="flex flex-column cursor-pointer">
                    <div className="custom-header text-highlighter-user-list">{rowData.name}</div>
                    <div className="table-body-sub">{rowData.person_refugee_name}</div>
                </div>
            },
        },
        // { field: 'place_name', header: translate(localeJson, 'place_name'), sortable: false, textAlign: "center", alignHeader: "center", minWidth: '7rem' },
        { field: 'family_code', header: translate(localeJson, 'family_code'), minWidth: "6rem", sortable: true, textAlign: "left", alignHeader: "left" },
        { field: "person_dob", header: translate(localeJson, 'dob'), minWidth: "11rem", maxWidth: "11rem", sortable: true, textAlign: 'left', alignHeader: 'left' },
        { field: "person_age", header: translate(localeJson, 'age'), sortable: true, textAlign: 'left', alignHeader: 'left', minWidth: "5rem" },
        { field: "person_gender", header: translate(localeJson, 'gender'), sortable: true, textAlign: 'left', alignHeader: 'left', minWidth: "8rem" },
        { field: "special_care_name", header: translate(localeJson, 'special_care_name'), minWidth: "8rem", textAlign: 'left' },
        
        { field: 'family_count', header: translate(localeJson, 'family_count'), sortable: true, textAlign: "center", alignHeader: "left", minWidth: "6rem", display: 'none' },
        
        { field: 'yapple_id', header: translate(localeJson, 'yapple_id'), sortable: true, textAlign: 'left', alignHeader: 'left', minWidth: '7rem' },
        // { field: 'person_is_owner', header: translate(localeJson, 'representative'), sortable: true, textAlign: 'left', alignHeader: 'left', minWidth: '7rem' },
        { field: "age_month", header: translate(localeJson, 'age_month'), sortable: true, textAlign: 'left', minWidth: "7rem", display: 'none' },
        { field: "connecting_code", header: translate(localeJson, 'connecting_code'), minWidth: "7rem", sortable: true, textAlign: 'left', display: 'none' },
        { field: "remarks", header: translate(localeJson, 'remarks'), sortable: true, textAlign: 'left', minWidth: "8rem", display: 'none' },
        { field: "place", header: translate(localeJson, 'shelter_place'), sortable: true, textAlign: 'left', minWidth: "12rem", display: 'none' },
        { field: "out_date", header: translate(localeJson, 'out_date'), sortable: true, textAlign: 'left', minWidth: "9rem", display: 'none' },
        {
            field: 'actions',
            header: '',
            textAlign: "left",
            alignHeader: 'left',
            minWidth: "10rem",
            body: (rowData) => (
                <div>
                    <Button buttonProps={{
                        text: translate(localeJson, 'check_in'),
                        buttonClass: "search-button",
                        onClick: () => updateCheckInStatus(rowData)
                    }} parentClass={"search-button"} />
                </div>
            ),
        },
    ];
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
            family_code: "",
            refugee_name: ""
        },
        place_id: placeID,
    });
    const [totalList, setTotalList] = useState([])
    const [fullListPayload, setFullListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "",
            order_by: "desc",
            family_code: "",
            refugee_name: ""
        },
        place_id: placeID,
    });
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [barcode, setBarcode] = useState(null);
    const [eventDefaultDetails, setEventDefaultDetails] = useState(null);
    const param = router?.query;
    const getCookieValueByKey = (key) => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if the cookie starts with the specified key
            if (cookie.startsWith(key + '=')) {
                return cookie.substring(key.length + 1);
            }
        }
        return '';
    };
    const myCookieValue = getCookieValueByKey('idToken');



    /* Services */
    const { getDefaultEventDetails, getList, updateCheckInDetail } = TemporaryStaffRegistrantServices;
    const { getBasicDetailsInfoStaffTemp, getBasicDetailsUsingUUID, getPPID } = TempRegisterServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getDefaultEventDetails({}, (response) => {
                if (response.success && !_.isEmpty(response.data)) {
                    setEventDefaultDetails(response?.data?.model)
                }
            });
            await getTemporaryRegistrantList();
            if (param?.UUID || param?.uuid) {
                validateAndMoveToForm(param.UUID || param.uuid)
            }
        };
        fetchData();
    }, [locale, getListPayload]);

    const validateAndMoveToForm = (id) => {
        let ppid;
        let payload = {
            "uuid": id
        }
        getPPID(payload, (res) => {
            if (res) {
                // Parse the inner JSON stored as a string in the "result" field
                const innerJson = JSON.parse(res.result);
                // Extract the value associated with the key "ppid"
                const ppidValue = innerJson.transfer_data.ppid;
                ppid = ppidValue;
                ppid && fetchBasicDetailsInfo(ppid);
            }
        })
    }

    const fetchBasicDetailsInfo = (id) => {
        let payload = {
            "ppid": id ? id : ""
        };

        getBasicDetailsUsingUUID(payload, (response) => {
            if (response.success) {
                const data = response.data;
                setBasicDataInfo(data);
                setOpenBarcodeDialog(false);
                setOpenBasicDataInfoDialog(true);
            }
        })
    }

    /**
     * Get temporary registrant list
     */
    const getTemporaryRegistrantList = () => {

        getList(getListPayload, onGetTemporaryRegistrantListSuccess);
    }

    /**
     * Get temporary registrant list / Success
     */
    const onGetTemporaryRegistrantListSuccess = async (response) => {
        var evacuationColumns = [...temporaryRegistrantsColumns];
        var evacueesList = [];
        var totalFamilyCount = 0;
        var listTotalCount = 0;
        let placeIdObj = {};

        if (response.success && !_.isEmpty(response.data) && response.data.list.length > 0) {
            response.places.forEach((place, index) => {
                placeIdObj[place.id] = locale == 'ja' ? place.name : (place.name_en ?? place.name)
            });
            const data = response.data.list;
            data.map((item, i) => {
                let evacuees = {
                    number: i + getListPayload.filters.start + 1,
                    id: item.f_id,
                    yapple_id: item.yapple_id,
                    place_name: placeIdObj[item.place_id],
                    family_count: response.data.total_family,
                    family_code: item.family_code,
                    person_is_owner: item.person_is_owner == 0 ? translate(localeJson, 'representative') : "",
                    person_refugee_name: item.person_refugee_name,
                    name: item.person_name,
                    person_gender: getGenderValue(item.person_gender),
                    person_age: item.person_age,
                    age_month: item.person_month,
                    special_care_name: item.person_special_cares
                        ? getSpecialCareName(item.person_special_cares, locale)
                        : "-", // Assuming you want to display a comma-separated list of special cares
                    connecting_code: item.person_connecting_code,
                    remarks: item.person_note,
                    place: item.place_id, // You might need to fetch the actual place name based on place_id from your response data
                    out_date: item.family_out_date,
                    person_dob:
                        locale == "ja"
                            ? getJapaneseDateDisplayYYYYMMDDFormat(item.person_dob)
                            : getEnglishDateDisplayFormat(item.person_dob)
                };
                evacueesList.push(evacuees);
            });
            totalFamilyCount = response.data.total_family;
            listTotalCount = response.data.total;
        }
        setTableLoading(false);
        setFullListPayload((prev) => ({
            ...prev,
            filters: {
                ...prev.filters,
                limit: listTotalCount > 0 ? listTotalCount : 10
            }
        }))
        TemporaryStaffRegistrantServices.getList(fullListPayload, (response) => {
            if (response && response?.success) {
                setTotalList(response.data.list)
            }
        })
        setEvacuationTableFields(evacuationColumns);
        setEvacueesDataList(evacueesList);
        setTotalCount(listTotalCount);
        setFamilyCount(totalFamilyCount);
    }

    const onImportModalClose = () => {
        setImportModalOpen(false);
        showOverFlow();
    };

    const handleFamilyCode = (e) => {
        const re = /^[0-9-]+$/;
        if(e.target.value.length<=0)
        {
          setFamilyCode("");
          return;
        }
        if(re.test(convertToSingleByte(e.target.value)))
        {
        if ((e.target.value).length == 4) {
          const newValue = e.target.value;
          if (newValue.indexOf("-") !== -1) {
            setFamilyCode(e.target.value);
          }
          else {
            setFamilyCode(newValue);
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
      else {
        setFamilyCode("")
      }
      }
      
    const updateCheckInStatus = (rowData) => {
        let param = {
            lgwan_family_id: rowData.id,
            place_id: getListPayload.place_id,
        }
        updateCheckInDetail(param, (response) => {
            if (response.success) {
                getList(getListPayload, onGetTemporaryRegistrantListSuccess);
            }
        });
    }

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else if (gender == 3) {
            return translate(localeJson, 'others_count');
        }
    }

    const searchListWithCriteria = () => {
        let payload = {
            filters: {
                start: 0,
                limit: getListPayload.filters.limit,
                sort_by: "",
                order_by: "desc",
                family_code: convertToSingleByte(familyCode),
                refugee_name: refugeeName
            },
            place_id: getListPayload.place_id,
        }
        getList(payload, onGetTemporaryRegistrantListSuccess);
        setGetListPayload(payload);
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

    const yappleModalSuccessCallBack = (res) => {
        // getList(getListPayload, onGetTemporaryRegistrantListSuccess);
        getList({
            filters: {
                start: 0,
                limit: 10,
                sort_by: "",
                order_by: "desc",
                family_code: "",
                refugee_name: ""
            },
            place_id: placeID,
          }, onGetTemporaryRegistrantListSuccess);
        
    }

    const doCheckIn = (place_id) => {
        if (basicDataInfo.is_registered == 0) {
            updateCheckInDetail({
                place_id: place_id,
                lgwan_family_id: basicDataInfo.lgwan_familiy_id
            }, (response) => {
                if (response.success) {
                    setOpenBasicDataInfoDialog(false);
                }
            });
        }
        else if (basicDataInfo.is_registered == 1) {
            toast.error(translate(localeJson, 'already_checked_in'), {
                position: "top-right",
            });
        }
        else {
            toast.error(translate(localeJson, 'not_pre_registered_yet'), {
                position: "top-right",
            });
        }
    }

    const confirmRegistrationBeforeCheckin = () => {
        if (layoutReducer?.user?.place?.id != basicDataInfo.place_id) {
            let result = window.confirm(translate(localeJson, 'different_evacuation_confirmation'));
            if (result) {
                doCheckIn(placeID)
            }
        }
        else {
            doCheckIn(basicDataInfo.place_id)
        }

    }

    const basicInfoContent = () => {
        return <div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "name_kanji")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.name}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "refugee_name")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.refugee_name}</div>
                </div>
            </div>

            <div className='mt-2'>
                <div className='flex'>
                    <div className='page-header3' style={{ whiteSpace: 'nowrap' }}>{translate(localeJson, "address")}:</div>
                    <div className='page-header3-sub ml-1' style={{ whiteSpace: 'normal' }}>{basicDataInfo?.address}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "tel")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.tel}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</div>
                    <div className='page-header3-sub ml-1'>{basicDataInfo?.join_date ? getJapaneseDateTimeDisplayActualFormat(basicDataInfo.join_date) : ""}</div>
                </div>
            </div>
            <div className='mt-2'>
                <div className='flex align-items-center'>
                    <div className='page-header3'>{translate(localeJson, "evacuation_place")}:</div>
                    <div className='page-header3-sub ml-1'>{layoutReducer?.user?.place.name}</div>
                </div>
            </div>
        </div>
    }

    return (
        <div className="grid">
            <CommonDialog
                open={openBasicDataInfoDialog}
                dialogBodyClassName="p-0"
                header={translate(localeJson, "pre_registration_info")}
                content={basicInfoContent()}
                position={"center"}
                footerParentClassName={"mt-5 w-12"}
                dialogClassName={"w-10 sm:w-8 md:w-4 lg:w-4"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-12",
                            text: translate(localeJson, "yapple_modal_success_div_green_btn"),
                            onClick: () => {
                                confirmRegistrationBeforeCheckin()
                            },
                        },
                        parentClass: "mb-2",
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-12 back-button",
                            text: translate(localeJson, "yapple_modal_success_div_white_btn"),
                            onClick: () => {
                                setOpenBasicDataInfoDialog(false);
                                setOpenBarcodeDialog(false)
                            },
                        },
                        parentClass: "back-button",
                    },
                ]}
                close={() => {
                    setOpenBasicDataInfoDialog(false);
                }}
            />
            <BarcodeDialog header={translate(localeJson, "barcode_dialog_heading")}
                visible={openBarcodeDialog} setVisible={setOpenBarcodeDialog}
                title={translate(localeJson, 'barcode_mynumber_dialog_main_title')}
                subTitle={translate(localeJson, 'barcode_mynumber_dialog_sub_title')}
                validateAndMoveToTempReg={(data) => validateAndMoveToForm(data)}
            ></BarcodeDialog>
            <YappleModal
                open={importModalOpen}
                close={onImportModalClose}
                barcode={barcode}
                setBarcode={setBarcode}
                isCheckIn={true}
                successCallBack={yappleModalSuccessCallBack}
                staffEventID={eventDefaultDetails?.id}
                successHeader={"pre_registration_info_staff"}
                isEvent={false}
                type={layoutReducer?.user?.place?.type}
                eventList={totalList}
                setRefugeeName={setRefugeeName}
                setGetListPayload={setGetListPayload}
                setFamilyCode={setFamilyCode}
            />
            <div className="col-12">
                <div className='card'>
                    <div style={{ display: "flex", alignItems: 'center' }}>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "temporary_registrants")} />
                        <span className='pl-2 text-lg pb-2'>{"(" + totalCount + translate(localeJson, 'people') + ")"}</span>
                    </div>
                    <div>
                        <div>
                            <div className="flex justify-between">
                                <Button buttonProps={{
                                    title: `https://login-portal-dev.biz.cityos-dev.hitachi.co.jp?screenID=HCS-202&idToken=${myCookieValue}`,
                                    buttonClass: "w-full p-4",
                                    text: translate(localeJson, "staff_temp_register_big_btn_one"),
                                    type: "button",
                                    onClick: () => {
                                        router.push(`https://login-portal-dev.biz.cityos-dev.hitachi.co.jp?screenID=HCS-202&idToken=${myCookieValue}`);
                                    },
                                    icon: <img src="/layout/images/Card.png" width={'30px'} height={'30px'} alt="scanner" />,
                                }} parentClass="flex-1 p-2" />
                                <Button buttonProps={{
                                    buttonClass: "w-full p-4",
                                    text: translate(localeJson, 'staff_temp_register_big_btn_two'),
                                    type: "button",
                                    icon: <img src="/layout/images/Scanner.png" width={'30px'} height={'30px'} alt="scanner" />,
                                    onClick: () => {
                                        setImportModalOpen(true)
                                        hideOverFlow();
                                    },
                                }} parentClass="flex-1 p-2" />
                            </div>
                            <form>
                                <div className='modal-field-top-space modal-field-bottom-space flex flex-wrap float-right justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 mobile-input'>
                                    <Input
                                        inputProps={{
                                            inputParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            labelProps: {
                                                text: translate(localeJson, 'family_code'),
                                                inputLabelClassName: "block",
                                            },
                                            inputClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            id: "familyCode",
                                            name: "familyCode",
                                            placeholder: translate(localeJson, 'family_code'),
                                            value: familyCode,
                                            onChange: (e) => handleFamilyCode(e),
                                        }}
                                    />
                                    <Input
                                        inputProps={{
                                            inputParentClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            labelProps: {
                                                text: translate(localeJson, 'name'),
                                                inputLabelClassName: "block",
                                            },
                                            placeholder: translate(localeJson, 'name'),
                                            inputClassName: "w-full lg:w-13rem md:w-14rem sm:w-10rem",
                                            value: refugeeName,
                                            onChange: (e) => setRefugeeName(e.target.value)

                                        }}
                                    />
                                    <div className="flex align-items-end">
                                        <Button buttonProps={{
                                            buttonClass: "w-12 search-button",
                                            text: translate(localeJson, "search_text"),
                                            icon: "pi pi-search",
                                            type: "button",
                                            onClick: () => searchListWithCriteria()
                                        }} parentClass="inline pr-2 search-button" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* 
                        // Development
                        <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button buttonProps={{
                                type: 'submit',
                                rounded: "true",
                                export: true,
                                buttonClass: "evacuation_button_height export-button",
                                text: translate(localeJson, 'export'),
                            }} parentClass={"mr-1 mt-1 export-button"} />
                        </div> */}
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
                                selectionMode="single"
                                onSort={(data) => {
                                    setGetListPayload({
                                        ...getListPayload,
                                        filters: {
                                            ...getListPayload.filters,
                                            sort_by: data.sortField,
                                            order_by: getListPayload.filters.order_by === 'desc' ? 'asc' : 'desc'
                                        }
                                    }
                                    )
                                }}
                                onSelectionChange={
                                    (e) => {
                                        dispatch(setStaffTempFamily({ lgwan_family_id: e.value.id }));
                                        router.push({
                                            pathname: '/staff/temporary/family-detail',
                                        });
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemporaryRegistrants;