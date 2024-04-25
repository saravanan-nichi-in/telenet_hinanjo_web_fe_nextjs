import React, { useEffect, useContext, useState, useRef } from "react";
import _ from 'lodash';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";

import { convertToSingleByte, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from "@/layout/context/layoutcontext";
import { CheckInOutServices, CommonServices, UserDashboardServices } from "@/services";
import { useAppDispatch } from "@/redux/hooks";
import { setCheckOutData } from "@/redux/checkout";
import { Button, ButtonRounded, CustomHeader, Input, ValidationError, Password } from "@/components";

export default function Admission() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const [audioNameLoader, setAudioNameLoader] = useState(false);
    const [audioFamilyCodeLoader, setAudioFamilyCodeLoader] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(false);
    const [isSearch, setSearch] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isMRecording, setMIsRecording] = useState(false);
    const [inputType, setInputType] = useState("password");
    const formikRef = useRef();

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

    const { getEventList } = CheckInOutServices;

    /* Services */
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
            setSearchResult(data);
            setTableLoading(false);
            dispatch(setCheckOutData(data))
            setLoader(false);
            router.push("/user/event/checkout/details")
        } else {
            setSearchResult([]);
            setTableLoading(false);
            setLoader(false);
        }
    };

    const handleRecordingStateChange = (isRecord) => {
        setMIsRecording(isRecord);
        setIsRecording(isRecord);
    };

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
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
}