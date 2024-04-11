import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { SelectButton } from 'primereact/selectbutton';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
    getValueByKeyRecursively as translate,
    getEnglishDateTimeSlashDisplayFormatWithSeconds,
    getEnglishDateSlashDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    convertToSingleByte,
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, ValidationError, NormalCheckBox, NormalLabel, QuestionList, MultiStepForm, CustomHeader, Input, InputDropdown } from '@/components';
import { prefectures } from '@/utils/constant';
import { TempRegisterServices } from '@/services';
import { useAppSelector } from "@/redux/hooks";

export default function TempRegister() {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const selfID = useAppSelector((state) => state.selfIDReducer.selfID);

    const [activeIndex, setActiveIndex] = useState(0);
    const [individualQuestionAnswer, setIndividualQuestionAnswer] = useState([]);
    const [masterQuestionAnswer, setMasterQuestionAnswer] = useState([]);
    const [basicDataInfo, setBasicDataInfo] = useState({})
    const [otherBasicDataInfo, setOtherBasicDataInfo] = useState({
        specialCareType: [],
        remarks: ""
    })

    const [pageFiveValues, setPageFiveValues] = useState({
        evacuationPlace: "",
        agreeCheckOne: false,
        agreeCheckTwo: false
    })

    const [hasErrors, setHasErrors] = useState(false)
    const [masterHasErrors, setMasterHasErrors] = useState(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [isMasterFormSubmitted, setIsMasterFormSubmitted] = useState(false)
    const [count, setCounter] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [specialCareTypes, setSpecialCareTypes] = useState([]);
    const [specialCare, setSpecialCare] = useState([]);
    const [activeEvacuationOptions, setActiveEvacutaionOptions] = useState([]);
    const [submitLoader, setSubmitLoader] = useState(false)

    const steps = [
        { label: 'Step 1' },
        { label: 'Step 2' }
    ];

    const { getBasicDetailsInfo, getActiveEvacuationPlaceList, getMasterQuestionnaireList, getIndividualQuestionnaireList, getSpecialCareDetails, registerTemporaryUser } = TempRegisterServices;

    useEffect(() => {
        const fetchData = async () => {
            setLoader(true)
            await getUserBasicInfo();
            await OnGetListMountingFetchSpecialCare();
            await getActiveEvacuationPlace();
            setTimeout(() => {
                setLoader(false)
            }, 1000);
        };
        fetchData();
    }, [])

    const getActiveEvacuationPlace = () => {
        getActiveEvacuationPlaceList((response) => {
            if (response) {
                const data = response.data.model;
                let placesList = [];
                data.map((item) => {
                    let place = {
                        name: item.name,
                        name_en: item.name_en ? item.name_en : item.name,
                        value: item.id
                    }
                    placesList.push(place);
                })
                setActiveEvacutaionOptions(placesList);
            }
        })
    }
    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'c_not_answer');
        }
    }
    const getUserBasicInfo = () => {
        let payload = {
            "ppid": "",
            "yapple_id": selfID.id ? selfID.id : ""
        };
        getBasicDetailsInfo(payload, (response) => {
            if (response) {
                const data = response.data;
                let baseData = {
                    name: data.name,
                    furigana: data.refugee_name,
                    postalCode: data.zip_code,
                    address: {
                        prefecture: getPrefectureID(data.address),
                        cityWard: data.address,
                        houseNameNumber: data.address
                    },
                    address_full: data.address,
                    dob: {
                        year: new Date(data.dob).getFullYear(),
                        month: String(new Date(data.dob).getMonth() + 1).padStart(2, '0'),
                        date: String(new Date(data.dob).getDate()).padStart(2, '0')
                    },
                    dob_full: data.dob,
                    gender: data.gender,
                    householdNumber: data.family_code,
                    yapple_id: data.yapple_id,
                    ppid: data.ppid,
                    connecting_code: data.connecting_code,
                    note: data.note,
                    join_date: data.join_date,
                    is_public: data.is_public,
                    public_info: data.public_info,
                    contactNumber: data.is_registered == 0 ? (data.tel ? data.tel : "") : "",
                    is_owner: "1",
                    evacuee_entry_status: 1,
                    register_from: data.register_from,
                    isRegistered: data.is_registered,
                    outDate: data.out_date,
                    lgwanFamilyID: data.lgwan_familiy_id,
                    lgwanPersonID: data.lgwan_person_id
                }
                setBasicDataInfo(baseData);

                let placeID = data.place_id;
                setPageFiveValues(prevState => ({
                    ...prevState,
                    agreeCheckTwo: false, //data.public_info == 0 ? true : false,
                    evacuationPlace: placeID ? placeID : ""
                }))

                let otherBaseInfo = {
                    specialCareType: data.is_registered == 0 ? (data.special_cares ? JSON.parse(data.special_cares) : []) : [],
                    remarks: data.is_registered == 0 ? data.note : ""
                }
                let individualBase = data.is_registered == 0 ? (data.person_answers ? JSON.parse(data.person_answers) : []) : [];
                let masterBase = data.is_registered == 0 ? (data.family_answers ? JSON.parse(data.family_answers) : []) : [];
                setOtherBasicDataInfo(otherBaseInfo);
                fetchIndividualQuestion(individualBase);
                fetchMasterQuestion(masterBase);
            }
        })
    }

    const getPrefectureID = (address) => {
        let subAddress = address.slice(0, 3);
        let prefectureData = prefectures.find((item) => item.name == subAddress);
        if (prefectureData) {
            return prefectureData.value;
        }
        return null;
    }

    const getQuestionData = (questionAnswer) => {
        let questionData = [];
        questionAnswer.map((item) => {
            let quesData = {
                "question_id": item.id,
                "question_type": item.type,
                "question_isRequired": item.isRequired,
                "answer": item?.answer ? item.answer : [],
                "answer_en": item?.answer_en ? item.answer_en : [],
            };
            questionData.push(quesData);
        })
        return questionData;
    }

    const getSpecialCareFilterTypes = (selectedData) => {
        return selectedData.filter(item =>
            specialCareTypes.some(obj => obj.value === item)
        );
    }
    const registerTemporaryUserData = () => {
        let payload = {
            "family_code": basicDataInfo.householdNumber,
            "place_id": pageFiveValues.evacuationPlace,
            "yapple_id": basicDataInfo.yapple_id,
            "ppid": selfID.ppid ? selfID.ppid : basicDataInfo.ppid,
            "join_date": getEnglishDateTimeSlashDisplayFormatWithSeconds(new Date()),
            "zip_code": basicDataInfo.postalCode ? (basicDataInfo.postalCode).replace(/-/g, "") : "",
            "prefecture_id": window.location.origin === "https://hitachi.nichi.in" || window.location.origin === "http://localhost:3000" || window.location.origin === "https://hitachi-dev-delta.vercel.app" ? "1" : getPrefectureID(basicDataInfo.address_full),
            "address": basicDataInfo.address_full,
            "address_default": "",
            "tel": convertToSingleByte(basicDataInfo.contactNumber.replaceAll("-", "")),
            "is_owner": 1,
            "is_public": 0,
            "public_info": pageFiveValues.agreeCheckTwo ? 0 : 1,
            "evacuee_entry_status": 0,
            "register_from": basicDataInfo.register_from,
            "person": [
                {
                    "id": 1,
                    "refugee_name": basicDataInfo.furigana,
                    "name": basicDataInfo.name,
                    "dob": getEnglishDateSlashDisplayFormat(basicDataInfo.dob_full),
                    "age": new Date().getFullYear() - new Date(basicDataInfo.dob_full).getFullYear(),
                    "month": new Date(basicDataInfo.dob_full).getMonth() + 1,
                    "gender": basicDataInfo.gender,
                    "special_cares": getSpecialCareFilterTypes(otherBasicDataInfo.specialCareType),
                    "note": otherBasicDataInfo.remarks,
                    "question": getQuestionData(individualQuestionAnswer)
                }
            ],
            "master_question": getQuestionData(masterQuestionAnswer)
        }
        if ((basicDataInfo.isRegistered == null)
            || (basicDataInfo.isRegistered == 0)) {
            payload['lgwan_family_id'] = basicDataInfo.lgwanFamilyID;
            payload['person'][0]['lgwan_person_id'] = basicDataInfo.lgwanPersonID
        }
        registerTemporaryUser(payload, (response) => {
            setSubmitLoader(false)
            if (response.code == 'ERR_NETWORK') {
                toast.error(translate(localeJson, 'register_error_message'), {
                    position: "top-right",
                });
            }
            else if (response.code == "ERR_BAD_REQUEST") {
                return "";
            }
            else {
                next()
            }

        })
    }

    const fetchIndividualQuestion = (baseAnswers) => {
        let payload = {
            "filters": {
                "start": 0,
                "limit": 15,
                "order_by": "desc",
                "sort_by": "updated_at"
            },
            "event_id": 1
        }
        getIndividualQuestionnaireList(payload, (res) => {
            if (res) {
                const data = res.data.list;
                let modifiedItem = [];
                data.map((item) => {
                    item['display'] = true;
                    let findData = baseAnswers.find((ques) => ques.question_id == item.id);
                    if (findData) {
                        item['answer'] = findData.answer
                        item['answer_en'] = findData.answer_en
                    }
                    modifiedItem.push(item)
                })
                const sortedUpdatedList = modifiedItem.sort((a, b) => {
                    return parseInt(a.display_order) - parseInt(b.display_order);
                });
                setIndividualQuestionAnswer(sortedUpdatedList);
            }
        })
    }

    const fetchMasterQuestion = (baseAnswers) => {
        let payload = {
            "filters": {
                "start": 0,
                "limit": 15,
                "order_by": "desc",
                "sort_by": "updated_at"
            },
            "event_id": 1
        }
        getMasterQuestionnaireList(payload, (res) => {
            if (res) {
                const data = res.data.list;
                let modifiedItem = [];
                data.map((item) => {
                    item['display'] = true;
                    let findData = baseAnswers.find((ques) => ques.question_id == item.id);
                    if (findData) {
                        item['answer'] = findData.answer
                        item['answer_en'] = findData.answer_en
                    }
                    modifiedItem.push(item)
                })
                const sortedUpdatedList = modifiedItem.sort((a, b) => {
                    return parseInt(a.display_order) - parseInt(b.display_order);
                });
                setMasterQuestionAnswer(sortedUpdatedList);
            }
        })
    }

    const OnGetListMountingFetchSpecialCare = () => {
        getSpecialCareDetails((res) => {
            if (res) {
                const data = res.data?.model?.list;
                setSpecialCare(data);
                const options = (data.map(item => ({
                    name: item.name,
                    name_en: item.name_en,
                    value: item.id,
                    sortOrder: item.sort_order.toString()
                })) || [])
                options.sort((a, b) => a.sortOrder - b.sortOrder);
                setSpecialCareTypes(options);
            }
        })
    }

    const step1Schema = Yup.object().shape({
        contactNumber: Yup.string()
            .required(translate(localeJson, 'phone_no_required'))
            .test('starts-with-zero', translate(localeJson, 'phone_num_start'), value => {
                if (value) {
                    value = convertToSingleByte(value);
                    return value.charAt(0) === '0';
                }
                return true; // Return true for empty values or use .required() in schema to enforce non-empty strings
            })
            .test("matches-pattern", translate(localeJson, "phone"), (value) => {
                if (value) {
                    const singleByteValue = convertToSingleByte(value);
                    return /^[0-9]{10,11}$/.test(singleByteValue);
                }
                else {
                    return true;
                }
            })
    });

    const step2Schema = Yup.object().shape({
        specialCareType: Yup.array()
            .min(0, translate(localeJson, 'special_care_list') + translate(localeJson, 'is_required'))
    });

    const next = () => {
        setActiveIndex((prevIndex) => prevIndex + 1);
        window.scrollTo({ top: 0 });
    };

    const setQuestions = (questions) => {
        if (activeIndex == 2) {
            setIndividualQuestionAnswer(questions)
        }
        if (activeIndex == 3) {
            setMasterQuestionAnswer(questions)
        }
    }

    const getSelectedSpecialCareType = (specialCareType) => {
        let specialCareName = null;
        specialCareType.map((item) => {
            let findCare = specialCareTypes.find((obj) => obj.value == item);
            if (findCare) {
                specialCareName = specialCareName ? (specialCareName + ", " + (locale == 'ja' ? findCare.name : findCare.name_en)) : (locale == 'ja' ? findCare.name : findCare.name_en);
            }
        });
        return specialCareName;
    }

    const getYearOptions = () => {
        let options = [];
        for (let year = 2023; year >= 1990; year--) {
            options.push({
                name: year,
                value: year
            });
        }
        return options;
    }

    const yearOptions = getYearOptions();

    const agreeTextWithHTML = (
        <div>
            {translate(localeJson, 'agree_note_oneA')}
            <span dangerouslySetInnerHTML={{ __html: `<a href="${window.location.origin}/privacy" target="_blank"><u>${translate(localeJson, 'c_individual_information')}</u></a>` }} />
            {translate(localeJson, 'agree_note_oneB')}
        </div>
    );

    const getEvacuationPlaceName = (placeID) => {
        let findData = activeEvacuationOptions.find((item) => item.value == placeID)
        if (findData) {
            return locale == 'ja' ? findData.name : findData.name_en;
        }
        return " - "
    }

    const goToPreviousStep = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
            window.scrollTo({ top: 0 });
        }
    }

    const getQuestionAnswer = (questionAnswer) => {
        let getAnswer = " - "
        if (questionAnswer.length > 0) {
            getAnswer = ""
            questionAnswer.map((item) => {
                getAnswer = (getAnswer.length > 0 ? (getAnswer + ", ") : getAnswer) + item;
            })
        }
        return getAnswer;
    }

    const tabContent = [
        <>
            <Formik
                key="step1"
                initialValues={basicDataInfo}
                enableReinitialize={true}
                validationSchema={step1Schema}
                onSubmit={(values, { setSubmitting }) => {
                    setBasicDataInfo(values)
                    setSubmitting(false);
                    next();
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='grid pr-0 col-12 justify-content-center'>
                            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                                <div className='grid pb-2'>
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'evacuee_information')} />
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <label htmlFor="name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_jp_name')}
                                        </label>
                                        <label htmlFor="name_value">
                                            {basicDataInfo.name}
                                        </label>
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_refugee_name')}
                                        </label>
                                        <label htmlFor="refugee_value">
                                            {basicDataInfo.furigana}
                                        </label>
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_address')}
                                        </label>
                                        <label htmlFor="address_value">
                                            <span className='block'>{basicDataInfo.address_full}</span>
                                        </label>
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_dob')}
                                        </label>
                                        <label htmlFor="refugee_value">
                                            {getJapaneseDateDisplayYYYYMMDDFormat(basicDataInfo.dob_full)}
                                        </label>
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <label htmlFor="gender" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_gender')}
                                        </label>
                                        <label htmlFor="gender_value">
                                            {getGenderValue(basicDataInfo.gender)}
                                        </label>
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <Input
                                            inputProps={{
                                                name: "contactNumber",
                                                placeholder: translate(localeJson, 'input_please'),
                                                inputParentClassName: `w-12 ${errors.contactNumber && touched.contactNumber && 'p-invalid'}`,
                                                labelProps: {
                                                    text: translate(localeJson, 'phone_number'),
                                                    inputLabelClassName: "font-bold",
                                                    spanText: "*",
                                                    inputLabelSpanClassName: "p-error",
                                                },
                                                inputClassName: "w-12",
                                                value: values.contactNumber,
                                                onChange: (evt) => {
                                                    const re = /^[0-9-]+$/;
                                                    let val;
                                                    if (
                                                        evt.target.value === "" ||
                                                        re.test(convertToSingleByte(evt.target.value))
                                                    ) {
                                                        val = evt.target.value.replace(/-/g, ""); // Remove any existing hyphens
                                                        setFieldValue("contactNumber", val);
                                                    }
                                                },
                                            }}
                                        />
                                        <ValidationError errorBlock={errors.contactNumber && touched.contactNumber && errors.contactNumber} />
                                    </div>
                                </div>
                                <div className='grid block mt-5'>
                                    <div className='col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => {
                                                router.replace('/user/pre-register-list')
                                            }
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

        </>,
        <>
            <Formik
                key="step2"
                initialValues={otherBasicDataInfo}
                validationSchema={step2Schema}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.specialCareType) {
                        const specialCareObjects = values.specialCareType.flatMap(id => {
                            const foundItems = specialCare.filter(item => {
                                return item.id == id;
                            })

                            return foundItems.length > 0 ? foundItems : [];
                        });
                        // Sort specialCareObjects based on sort_order
                        specialCareObjects.sort((a, b) => a.sort_order - b.sort_order);
                        // Step 3: Map the sorted specialCare objects back to IDs
                        const sortedSpecialCareIds = specialCareObjects.map(item => item.id);
                        values.specialCareType = sortedSpecialCareIds
                    }
                    setOtherBasicDataInfo(values)
                    setSubmitting(false);
                    next();
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='grid pr-0 col-12 justify-content-center'>
                            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                                <div className='grid'>
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'special_consider')} />
                                    </div>
                                    <div className='gender-view col-12 pb-3'>
                                        <div className='outer-label w-12 pb-1'>
                                            <label>{translate(localeJson, 'c_user_care')}
                                            </label>
                                        </div>
                                        <div className='-ml-2'>
                                            <SelectButton
                                                options={specialCareTypes}
                                                value={values.specialCareType}
                                                optionLabel={locale == 'ja' ? 'name' : 'name_en'}
                                                onChange={(e) => setFieldValue('specialCareType', e.value)}
                                                multiple
                                            />
                                        </div>
                                        <ValidationError errorBlock={errors.specialCareType && touched.specialCareType && errors.specialCareType} />
                                    </div>
                                    <div className='col-12'>
                                        <Input
                                            inputProps={{
                                                name: "remarks",
                                                placeholder: translate(localeJson, 'placeholder_remarks'),
                                                inputParentClassName: `w-12`,
                                                labelProps: {
                                                    text: translate(localeJson, 'c_remarks_label'),
                                                    inputLabelClassName: "font-bold",
                                                },
                                                inputClassName: "w-12",
                                                value: values.remarks,
                                                onChange: handleChange
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='grid block mt-5'>
                                    <div className='col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => goToPreviousStep()
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>,

        <>
            <Formik
                key="step3"
                initialValues={{}}
                enableReinitialize={true}
                onSubmit={(values) => {
                    if (!hasErrors) {
                        next();
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
                }) => (
                    <Form>
                        <div className='grid pr-0 col-12 justify-content-center'>
                            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                                <div className="grid pb-2">
                                    <div className='col-12 pb-3'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'individual_question_related')} />
                                    </div>
                                    <div className='col-12 w-12 question'>
                                        <QuestionList
                                            questions={individualQuestionAnswer}
                                            isModal={false}
                                            isRecording={isRecording}
                                            setIsRecording={setIsRecording}
                                            isFormSubmitted={isFormSubmitted}
                                            setIsFormSubmitted={setIsFormSubmitted}
                                            setHasErrors={setHasErrors}
                                            setQuestions={setQuestions}
                                            count={count}
                                            isEdit={true}
                                        />
                                    </div>
                                </div>
                                <div className='grid col-12 mt-5'>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => {
                                                setCounter(count + 1)
                                                setIsFormSubmitted(true)
                                                handleSubmit()
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => goToPreviousStep()
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>,
        <>
            <Formik
                key="step4"
                initialValues={{}}
                onSubmit={(values) => {
                    if (!masterHasErrors) {
                        next()
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
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='grid pr-0 col-12 justify-content-center'>
                            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                                <div className="grid pb-2">
                                    <div className='col-12 pb-3'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "master_question_related")} />
                                    </div>
                                    <div className='col-12 w-12 question'>
                                        <QuestionList
                                            questions={masterQuestionAnswer}
                                            isModal={false}
                                            isRecording={isRecording}
                                            setIsRecording={setIsRecording}
                                            isFormSubmitted={isMasterFormSubmitted}
                                            setIsFormSubmitted={setIsMasterFormSubmitted}
                                            setHasErrors={setMasterHasErrors}
                                            setQuestions={setQuestions}
                                            count={count}
                                            isEdit={true}
                                        />
                                    </div>
                                </div>
                                <div className='grid col-12 mt-5'>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => {
                                                setCounter(count + 1)
                                                setIsMasterFormSubmitted(true)
                                                handleSubmit()
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => goToPreviousStep()
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </>,
        <>
            <Formik
                key="step5"
                initialValues={pageFiveValues}
                onSubmit={(values) => {
                    setPageFiveValues(values)
                    next();
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='grid pr-0 col-12 justify-content-center'>
                            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                                <div className="grid">
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'c_evacuation_location')} />
                                    </div>
                                    <div className='col-12 pb-3'>
                                        <InputDropdown
                                            inputDropdownProps={{
                                                name: "evacuationPlace",
                                                placeholder: translate(localeJson, 'please_select'),
                                                inputDropdownParentClassName: `w-12 ${errors.evacuationPlace && touched.evacuationPlace && 'p-invalid'}`,
                                                labelProps: {
                                                    text: "",
                                                    inputDropdownLabelClassName: "font-bold",
                                                },
                                                options: activeEvacuationOptions,
                                                optionLabel: locale == 'ja' ? 'name' : 'name_en',
                                                disabled: activeEvacuationOptions.length == 0,
                                                inputDropdownClassName: "w-12",
                                                value: values.evacuationPlace,
                                                onChange: handleChange
                                            }}
                                        />
                                        <ValidationError errorBlock={errors.evacuationPlace && touched.evacuationPlace && errors.evacuationPlace} />
                                        <NormalLabel text={translate(localeJson, 'place_note_one')} labelClass="block text-red-600 pt-2 pb-1" />
                                        <NormalLabel text={translate(localeJson, 'place_note_two')} labelClass="block text-red-600" />
                                    </div>
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "individual_agree_note")} />
                                    </div>
                                    <div className='col-12'>
                                        <NormalCheckBox checkBoxProps={{
                                            checked: values.agreeCheckOne,
                                            linkLabel: agreeTextWithHTML,
                                            labelClass: `pl-2 ${locale == 'en' ? 'pt-1' : ''}`,
                                            onChange: (e) => setFieldValue('agreeCheckOne', e.checked)
                                        }} parentClass={"flex approve-check"} />
                                    </div>
                                    <div className='col-12'>
                                        <NormalCheckBox checkBoxProps={{
                                            checked: values.agreeCheckTwo,
                                            value: translate(localeJson, 'agree_note_two'),
                                            labelClass: `pl-2 ${locale == 'en' ? 'pt-1' : ''}`,
                                            onChange: (e) => setFieldValue('agreeCheckTwo', e.checked)
                                        }} parentClass={"flex approve-check"} />
                                    </div>
                                    <div className='col-12'>
                                        <label className='text-color-secondary'>{translate(localeJson, 'disclose_information')}</label>
                                    </div>
                                </div>
                                <div className='grid col-12 mt-5'>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'go_to_confirmation_screen'),
                                            disabled: !values.agreeCheckOne,
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='pt-3 col-12 text-center'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-8 lg:w-8",
                                            rounded: true,
                                            onClick: () => goToPreviousStep()
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>,
        <>
            <div className='grid pr-0 col-12 justify-content-center'>
                <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                    <div className='grid pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'evacuee_information')} />
                        </div>
                        <div className='col-12'>
                            <label htmlFor="name" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_jp_name')}
                            </label>
                            <label htmlFor="name_value">
                                {basicDataInfo.name}
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_refugee_name')}
                            </label>
                            <label htmlFor="refugee_value">
                                {basicDataInfo.furigana}
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="address" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_address')}
                            </label>
                            <label htmlFor="address_value">
                                <span className='block'>{basicDataInfo.address_full}</span>
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="gender" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_gender')}
                            </label>
                            <label htmlFor="gender_value" className='pt-5'>
                                {getGenderValue(basicDataInfo.gender)}
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_dob')}
                            </label>
                            <label htmlFor="refugee_value">
                                {getJapaneseDateDisplayYYYYMMDDFormat(basicDataInfo.dob_full)}
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="household" className='pb-1 font-bold block'>
                                {translate(localeJson, 'phone_number')}
                            </label>
                            <label htmlFor="household_value">
                                {convertToSingleByte(basicDataInfo.contactNumber)}
                            </label>
                        </div>
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'special_consider')} />
                        </div>

                        <div className='col-12'>
                            <label htmlFor="contact" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_user_care')}
                            </label>
                            <label htmlFor="contact_value" className='pt-5'>
                                {getSelectedSpecialCareType(otherBasicDataInfo.specialCareType)}
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="remarks" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_remarks_label')}
                            </label>
                            <label htmlFor="evacuation_value" className='pt-5'>
                                {otherBasicDataInfo.remarks ? otherBasicDataInfo.remarks : "-"}
                            </label>
                        </div>
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'individual_question_related')} />
                        </div>
                        {individualQuestionAnswer.map((question, index) => (
                            <div className='col-12' key={index}>
                                <label htmlFor={`individual_question_${index}`} className='pb-1 font-bold block'>
                                    {locale == 'ja' ? question.title : (question.title_en ? question.title_en : question.title)}
                                </label>
                                <label htmlFor={`individual_question_answer${index}`} className='pt-5'>
                                    {locale == 'ja' ? (question?.answer ? getQuestionAnswer(question.answer) : " - ") : (question?.answer_en ? getQuestionAnswer(question.answer_en) : " - ")}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'master_question_related')} />
                        </div>
                        {masterQuestionAnswer?.map((question, index) => (
                            <div className='col-12' key={index}>
                                <label htmlFor={`master_question_${index}`} className='pb-1 font-bold block'>
                                    {locale == 'ja' ? question.title : (question.title_en ? question.title_en : question.title)}
                                </label>
                                <label htmlFor={`master_question_answer${index}`} className='pt-5'>
                                    {locale == 'ja' ? (question?.answer ? getQuestionAnswer(question.answer) : " - ") : (question?.answer_en ? getQuestionAnswer(question.answer_en) : " - ")}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'evacuation_place')} />
                        </div>
                        <div className='col-12'>
                            <label htmlFor="evacuation_place" className='font-bold block pb-1'>
                                {pageFiveValues.evacuationPlace ? getEvacuationPlaceName(pageFiveValues.evacuationPlace) : " - "}
                            </label>
                            {pageFiveValues.evacuationPlace &&
                                <label htmlFor="evacuation_place_note" className='block'>
                                    {translate(localeJson, 'selected_place_note')}
                                </label>
                            }
                        </div>
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'individual_agree_note')} />
                        </div>
                        <div className='col-12'>
                            <label htmlFor="evacuation_place" className='pb-1 font-bold block'>
                                {translate(localeJson, 'agree_label')}
                            </label>
                            <label htmlFor="evacuation_place_value" className='pt-5'>
                                {pageFiveValues.agreeCheckOne ? translate(localeJson, 'agree') : translate(localeJson, 'disagree')}
                            </label>
                        </div>
                        <div className='col-12'>
                            <label htmlFor="to_publish" className='pb-1 font-bold block'>
                                {translate(localeJson, 'publish_label')}
                            </label>
                            <label htmlFor="to_publish_value" className='pt-5'>
                                {pageFiveValues.agreeCheckTwo ? translate(localeJson, 'to_publish') : translate(localeJson, 'not_to_publish')}
                            </label>
                        </div>
                    </div>
                    <div className='grid col-12 mt-5'>
                        <div className='pt-3 col-12 text-center'>
                            <Button buttonProps={{
                                type: "submit",
                                text: translate(localeJson, 'register'),
                                buttonClass: "multi-form-submit w-12 sm:w-12 md:w-8 lg:w-8",
                                rounded: true,
                                isLoading: submitLoader,
                                onClick: () => {
                                    setSubmitLoader(true)
                                    registerTemporaryUserData()
                                }
                            }} parentClass={"inline"} />
                        </div>
                        <div className='pt-3 col-12 text-center'>
                            <Button buttonProps={{
                                type: "submit",
                                text: translate(localeJson, 'back'),
                                buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-8 lg:w-8",
                                rounded: true,
                                onClick: () => goToPreviousStep()
                            }} parentClass={"inline"} />
                        </div>
                    </div>
                </div>
            </div>
        </>,
        <>
            <div className='grid pr-0'>
                <div className='col-12 pr-0 mt-8 pt-5'>
                    <div className='col-12 pt-8 flex justify-content-center'>
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.16675 40.0001C7.16675 21.8762 21.8762 7.16675 40.0001 7.16675C58.1239 7.16675 72.8334 21.8762 72.8334 40.0001C72.8334 58.1239 58.1239 72.8334 40.0001 72.8334C21.8762 72.8334 7.16675 58.1239 7.16675 40.0001ZM18.6465 42.687L30.6132 54.6536C32.1051 56.1455 34.5567 56.153 36.0225 54.6515C36.0233 54.6507 36.0241 54.6498 36.0249 54.649L61.3203 29.3536C62.8156 27.8584 62.8156 25.4418 61.3203 23.9465C59.825 22.4513 57.4085 22.4513 55.9132 23.9465L33.3328 46.5269L24.0536 37.2799C22.5584 35.7846 20.1418 35.7846 18.6465 37.2799C17.1513 38.7751 17.1513 41.1917 18.6465 42.687Z" fill="#106540" stroke="black" />
                        </svg>
                    </div>
                    <div className='col-12 flex justify-content-center pt-3'>
                        <label className='font-bold'>{translate(localeJson, "success_registration")}</label>
                    </div>
                    <div className='col-12 flex justify-content-center pt-5'>
                        <div className='p-5 fixed  w-8 sm:w-5 md:w-4 lg:w-3' style={{ bottom: "30px" }}>
                            <Button buttonProps={{
                                type: "button",
                                text: translate(localeJson, 'close_kana'),
                                buttonClass: "multi-form-submit return w-12",
                                rounded: true,
                                onClick: () => returnToEventScreen()
                            }} parentClass={"w-12"} />
                        </div>

                    </div>
                </div>

            </div>
        </>
    ];

    const returnToEventScreen = () => {
        router.push({
            pathname: `${process.env.NEXT_PUBLIC_PRODUCTION_HOST}`,
        })
    }

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className='card p-0 multi-form-card'>
                        <div className='p-0'>
                            <MultiStepForm
                                items={steps}
                                content={tabContent}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}