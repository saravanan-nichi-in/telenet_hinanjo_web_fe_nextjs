import React, { useEffect, useContext, useState, useRef } from "react";
import _ from 'lodash';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";

import {
    convertToSingleByte,
    getValueByKeyRecursively as translate,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateDisplayFormat,
    toastDisplay
} from '@/helper'
import { LayoutContext } from "@/layout/context/layoutcontext";
import { CheckInOutServices, CommonServices, UserDashboardServices } from "@/services";
import { useAppDispatch } from "@/redux/hooks";
import { setCheckOutData } from "@/redux/checkout";
import { Button, ButtonRounded, CustomHeader, Input, ValidationError, NormalTable } from "@/components";
import { prefecturesCombined } from '@/utils/constant';

export default function Admission() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const formikRef = useRef();
    const [audioNameLoader, setAudioNameLoader] = useState(false);
    const [audioFamilyCodeLoader, setAudioFamilyCodeLoader] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(false);
    const [isSearch, setSearch] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isMRecording, setMIsRecording] = useState(false);
    const [inputType, setInputType] = useState("password");
    const familyDetailsColumns = [
        { field: "event_name", header: translate(localeJson, 'staff_attendees_table_event_name'), sortable: false, textAlign: 'left', minWidth: "8rem" },
        {
            field: 'person_refugee_name', header: translate(localeJson, 'name_public_evacuee'), sortable: false, alignHeader: "left", minWidth: "8rem", maxWidth: "8rem",
            body: (rowData) => {
                return <div className="flex flex-column">
                    <div className={"text-highlighter-user-list clickable-row"}>
                        {rowData.person_name}
                    </div>
                    <div className={"clickable-row"}>
                        {rowData.person_refugee_name}
                    </div>
                </div>
            },
        },
        { field: "family_code", header: translate(localeJson, 'staff_attendees_table_family_code'), sortable: false, textAlign: 'left', minWidth: "8rem", maxWidth: "8rem", },
        { field: "full_address", header: translate(localeJson, 'staff_attendees_table_adress'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: "8rem", maxWidth: "14rem" },
        { field: "person_dob", header: translate(localeJson, 'staff_attendees_table_dob'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: "8rem", maxWidth: "8rem" },
        { field: "person_gender", header: translate(localeJson, 'staff_attendees_table_gender'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: "5rem", maxWidth: "5rem" },
        { field: "person_tel", header: translate(localeJson, 'phone_number'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: "5rem", maxWidth: "5rem" },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => (
                <div>
                    <ButtonRounded
                        buttonProps={{
                            buttonClass: "w-full h-3rem primary-button ",
                            type: "submit",
                            rounded: "true",
                            text: translate(localeJson, "de_register_event"),
                            onClick: () => {
                                doCheckout(rowData);
                            }
                        }}
                        parentClass={"w-full primary-button"}
                    />
                </div>
            )
        }
    ];

    const schema = Yup.object().shape({
        name: Yup.string().max(100, translate(localeJson, "family_name_max")).test({
            test: function (value) {
                const { familyCode } = this.parent;
                return Boolean(familyCode) || Boolean(value);
            },
            message: translate(localeJson, "family_name_required"),
        }),
        password: Yup.string()
            .required(translate(localeJson, "family_password_required"))
            .test("is-four-digits", translate(localeJson, "family_password_min_max"), (value) => {
                return String(value).length === 4;
            }),
        familyCode: Yup.string().test({
            test: function (value) {
                const { name } = this.parent;
                return Boolean(name) || Boolean(value);
            },
            message: translate(localeJson, "family_code_required"),
        }),
    });

    const initialValues = { name: "", password: "", familyCode: "" };

    /* Services */
    const { getEventList, eventCheckOutAddOns } = CheckInOutServices;
    const { getEventListByID } = UserDashboardServices;
    const { getText } = CommonServices;

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, [locale]);

    useEffect(() => {
        setMIsRecording(isRecording);
    }, [isRecording]);

    const getSearchResult = (res) => {
        if (res?.success && !_.isEmpty(res?.data)) {
            const data = res.data.model;
            var listOfFamilies = [];
            data.forEach((element, index) => {
                let preparedObj = {
                    ...element,
                    full_address: (element.family_zip_code ?? "") + " " + prefecturesCombined[element.family_prefecture_id ?? 0][locale] + " " + (element.family_address ?? ""),
                    event_name: locale === "en" && !_.isNull(layoutReducer?.user?.place?.name_en) ? layoutReducer?.user?.place?.name_en : layoutReducer?.user?.place?.name,
                    person_dob: element.person_dob ? (locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(element.person_dob) : getEnglishDateDisplayFormat(element.person_dob)) : "",
                    person_gender: getGenderValueFromInt(element.person_gender),
                }
                listOfFamilies.push(preparedObj);
            });
            setSearchResult(listOfFamilies);
            dispatch(setCheckOutData(data))
            // router.push("/user/event/checkout/details")
        }
        setTableLoading(false);
        setLoader(false);
    };

    const getGenderValueFromInt = (gender) => {
        if (parseInt(gender) == 1) {
            return translate(localeJson, 'male');
        } else if (parseInt(gender) == 2) {
            return translate(localeJson, 'female');
        } else if (parseInt(gender) == 3) {
            return translate(localeJson, 'others_count');
        }
    }

    const handleRecordingStateChange = (isRecord) => {
        setMIsRecording(isRecord);
        setIsRecording(isRecord);
    };

    const isCheckedOut = (res) => {
        setLoader(false)
        if (res.success) {
            router.push('/user/event/dashboard');
        }
    }

    const doCheckout = (val) => {
        let payload = {
            "family_id": [val?.family_id],
            "event_id": val?.event_id
        }
        if (val) {
            setLoader(true)
            eventCheckOutAddOns(payload, isCheckedOut);
        }
        else {
            toastDisplay(translate(localeJson, 'already_checked_out'), '', '', "error");
        }
    }

    return (
        <>
            <Formik
                innerRef={formikRef}
                validationSchema={schema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values) => {
                    let fam_val = values.familyCode ? convertToSingleByte(values.familyCode) : "";
                    let fam_pass = values.password ? convertToSingleByte(values.password) : "";
                    let payload = {
                        family_code: values.familyCode ? fam_val : "",
                        refugee_name: values.name,
                        password: fam_pass,
                        place_id: layoutReducer?.user?.place?.id,
                        ...(layoutReducer?.user?.place?.type === "place"
                            ? { place_id: layoutReducer?.user?.place?.id }
                            : layoutReducer?.user?.place?.type === "event"
                                ? { event_id: layoutReducer?.user?.place?.id }
                                : {}),
                    };
                    if (isSearch) {
                        setLoader(true);
                        getEventList(payload, getSearchResult);
                    }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                }) => (
                    <div>
                        <div className="grid">
                            <div className="col-12">
                                <div className="card">
                                    <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "c_checkout_title_event")} />
                                    <div>
                                        <div className="mt-3">
                                            <div
                                                className="flex"
                                                style={{ justifyContent: "flex-end", flexWrap: "wrap" }}
                                            >
                                                <Button
                                                    buttonProps={{
                                                        type: "button",
                                                        rounded: "true",
                                                        buttonClass: "back-button",
                                                        text: translate(localeJson, "check_out_shelter"),
                                                        onClick: () => {
                                                            router.push({
                                                                pathname: 'register/member',
                                                            })
                                                        },
                                                    }}
                                                    parentClass={"ml-3 mr-3 mt-1 back-button"}
                                                    parentStyle={{ display: "none" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:gap-6 lg:gap-8">
                                            <div className="mt-3 col-12 md:col-6 lg:col-6">
                                                <div
                                                    className=" lg:ml-3 md:ml-3"
                                                >
                                                    <div className="w-full">
                                                        <div className="mb-3  w-12">
                                                            <div className="flex w-12">
                                                                <div className="w-12">
                                                                    <Input
                                                                        inputProps={{
                                                                            inputParentClassName: `w-full custom_input ${errors.name &&
                                                                                touched.name &&
                                                                                "p-invalid"
                                                                                }`,
                                                                            labelProps: {
                                                                                text: translate(localeJson, 'shelter_name'),
                                                                                inputLabelClassName: "block",
                                                                                spanText: "*",
                                                                                inputLabelSpanClassName: "p-error",
                                                                                labelMainClassName: "pb-1"
                                                                            },
                                                                            inputClassName: "w-full",
                                                                            id: "name",
                                                                            name: "name",
                                                                            placeholder: translate(
                                                                                localeJson,
                                                                                "placeholder_please_enter_name"
                                                                            ),
                                                                            value: values.name,
                                                                            onChange: handleChange,
                                                                            onBlur: handleBlur,
                                                                            isLoading: audioNameLoader,
                                                                            disabled: audioNameLoader,
                                                                            hasIcon: true,
                                                                            inputRightIconProps: {
                                                                                display: true,
                                                                                audio: {
                                                                                    display: true,
                                                                                },
                                                                                icon: "",
                                                                                isRecording,
                                                                                onRecordValueChange: (rec) => {
                                                                                    const fromData = new FormData();
                                                                                    fromData.append("audio_sample", rec);
                                                                                    getText(fromData, (res) => {
                                                                                        if (res?.data?.content) {
                                                                                            setFieldValue("name", res?.data?.content);
                                                                                        }
                                                                                    });
                                                                                },
                                                                                onRecordingStateChange:
                                                                                    handleRecordingStateChange,
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="w-11">
                                                                <ValidationError
                                                                    errorBlock={
                                                                        errors.name && touched.name && errors.name
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3 w-full">
                                                            <div className="flex w-12">
                                                                <div className="w-12">
                                                                    <Input
                                                                        inputProps={{
                                                                            inputParentClassName: `w-full custom_input ${errors.password &&
                                                                                touched.password &&
                                                                                "p-invalid"
                                                                                }`,
                                                                            labelProps: {
                                                                                text: translate(localeJson, "shelter_password"),
                                                                                inputLabelClassName: "block font-bold",
                                                                                spanText: "*",
                                                                                inputLabelSpanClassName: "p-error",
                                                                                labelMainClassName: "pb-1 pt-1",
                                                                            },
                                                                            inputClassName: "w-full",
                                                                            id: "password",
                                                                            name: "password",
                                                                            value: values.password,
                                                                            autoFocus: false,
                                                                            autoComplete: "new-password",
                                                                            inputMode: "numeric",
                                                                            disabled: isRecording ? true : false,
                                                                            type: inputType,
                                                                            placeholder: translate(
                                                                                localeJson,
                                                                                "placeholder_please_enter_password"
                                                                            ),
                                                                            onChange: (evt) => {
                                                                                const re = /^[0-9-]+$/;
                                                                                if (evt.target.value == "") {
                                                                                    setFieldValue("password", evt.target.value);
                                                                                }
                                                                                if (re.test(convertToSingleByte(evt.target.value))) {
                                                                                    setFieldValue("password", evt.target.value);
                                                                                }
                                                                            },
                                                                            onBlur: handleBlur,
                                                                            inputRightIconProps: {
                                                                                display: true,
                                                                                audio: {
                                                                                    display: true,
                                                                                },
                                                                                password: {
                                                                                    display: true,
                                                                                    className: inputType == "text" ? "pi pi-eye-slash" : "pi pi-eye",
                                                                                    onClick: () => {
                                                                                        setInputType(inputType == "text" ? "password" : "text");
                                                                                    }
                                                                                },
                                                                                icon: "",
                                                                                isRecording: isRecording,
                                                                                onRecordValueChange: (rec) => {
                                                                                    const fromData = new FormData();
                                                                                    fromData.append("audio_sample", rec);
                                                                                    getText(fromData, (res) => {
                                                                                        const re = /^[0-9-]+$/;
                                                                                        let newPassword = res?.data?.content;
                                                                                        if (re.test(newPassword)) {
                                                                                            setFieldValue(
                                                                                                "password",
                                                                                                newPassword
                                                                                            );
                                                                                        }
                                                                                    });
                                                                                },
                                                                                onRecordingStateChange:
                                                                                    handleRecordingStateChange,
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="w-11">
                                                                <ValidationError
                                                                    errorBlock={
                                                                        errors.password &&
                                                                        touched.password &&
                                                                        errors.password
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3 w-full">
                                                            <div className="flex w-12">
                                                                <div className="w-12">
                                                                    <Input
                                                                        inputProps={{
                                                                            inputParentClassName: `w-full custom_input ${errors.familyCode &&
                                                                                touched.familyCode &&
                                                                                "p-invalid"
                                                                                }`,
                                                                            labelProps: {
                                                                                text: translate(localeJson, 'shelter_code'),
                                                                                inputLabelClassName: "block",
                                                                                spanText: "*",
                                                                                inputLabelSpanClassName: "p-error",
                                                                                labelMainClassName: "pb-1"
                                                                            },
                                                                            inputClassName: "w-full",
                                                                            id: "familyCode",
                                                                            name: "familyCode",
                                                                            inputMode: "numeric",
                                                                            placeholder: translate(
                                                                                localeJson,
                                                                                "placeholder_hyphen_not_required"
                                                                            ),
                                                                            value: values.familyCode,
                                                                            isLoading: audioFamilyCodeLoader,
                                                                            disabled: audioFamilyCodeLoader,
                                                                            hasIcon: true,
                                                                            onChange: (evt) => {
                                                                                const re = /^[0-9-]+$/;
                                                                                if (
                                                                                    evt.target.value === "" ||
                                                                                    re.test(convertToSingleByte(evt.target.value))
                                                                                ) {
                                                                                    let val = evt.target.value.replace(
                                                                                        /-/g,
                                                                                        ""
                                                                                    ); // Remove any existing hyphens
                                                                                    if (val.length > 3) {
                                                                                        val =
                                                                                            val.slice(0, 3) +
                                                                                            val.slice(3);
                                                                                    }
                                                                                    setFieldValue("familyCode", val);
                                                                                }
                                                                            },
                                                                            onBlur: handleBlur,
                                                                            inputRightIconProps: {
                                                                                display: true,
                                                                                audio: {
                                                                                    display: true,
                                                                                },
                                                                                icon: "",
                                                                                isRecording,
                                                                                onRecordValueChange: (rec) => {
                                                                                    const fromData = new FormData();
                                                                                    fromData.append("audio_sample", rec);
                                                                                    getText(fromData, (res) => {
                                                                                        if (res?.data?.content) {
                                                                                            setFieldValue("familyCode", res?.data?.content);
                                                                                        }
                                                                                    });
                                                                                },
                                                                                onRecordingStateChange:
                                                                                    handleRecordingStateChange,
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="w-11">
                                                                <ValidationError
                                                                    errorBlock={
                                                                        errors.familyCode &&
                                                                        touched.familyCode &&
                                                                        errors.familyCode
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 col-12  md:col-5 lg:col-5" >
                                                <div className="flex flex-column justify-content-start align-items-end h-full">
                                                    <div className="flex col-12 lg:col-6 w-full mt-0 lg:mt-2 md:mt-2">
                                                        <></>
                                                    </div>
                                                    <div className="flex col-12 lg:col-3  mt-0 mb-0 lg:mt-2 lg:mb-2 md:mb-2 md:mt-2 w-full ">
                                                        <ButtonRounded
                                                            buttonProps={{
                                                                rounded: "true",
                                                                text: translate(localeJson, "mem_search"),
                                                                onClick: () => {
                                                                    let evt_payload = { event_id: layoutReducer?.user?.place?.id }
                                                                    layoutReducer?.user?.place?.type === "event" && getEventListByID(evt_payload, (response) => {
                                                                        if (response && response.data) {
                                                                            let obj = response.data.model;
                                                                            if (obj.is_q_active == "1") {
                                                                                setSearch(true);
                                                                                setTimeout(() => {
                                                                                    handleSubmit()
                                                                                }, 1000)
                                                                            }
                                                                            else {
                                                                                setSearch(false)
                                                                                router.push({ pathname: '/user/event-list' })
                                                                            }
                                                                        }
                                                                    })
                                                                },
                                                                custom: "userDashboard",
                                                                buttonClass:
                                                                    "flex align-items-center justify-content-center  primary-button h-3rem md:h-8rem lg:h-8rem ",
                                                            }} parentClass={"w-full primary-button"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {searchResult && (
                                        <div className='mt-2 flex overflow-x-auto'>
                                            <NormalTable
                                                loading={tableLoading}
                                                emptyMessage={translate(localeJson, "data_not_found")}
                                                stripedRows={true}
                                                paginator={false}
                                                showGridlines={true}
                                                value={searchResult}
                                                columns={familyDetailsColumns}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
}