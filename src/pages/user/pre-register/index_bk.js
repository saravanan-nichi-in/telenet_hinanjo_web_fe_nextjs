import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { SelectButton } from 'primereact/selectbutton';

import {
    getValueByKeyRecursively as translate,
    getEnglishDateTimeSlashDisplayFormatWithSeconds,
    getEnglishDateSlashDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { MultiStepForm } from '@/components/multiForm';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, ValidationError, NormalCheckBox, NormalLabel } from '@/components';
import QuestionList from '@/components/masterQuestion';
import CustomHeader from '@/components/customHeader';
import { prefectures, prefectures_en } from '@/utils/constant';
import { TempRegisterServices } from '@/services';
import { Input, InputDropdown } from '@/components/input';
import { useAppSelector } from "@/redux/hooks";
import toast from 'react-hot-toast';

export default function TempRegister() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const selfID = useAppSelector((state) => state.selfIDReducer.selfID);
    console.log(selfID)
    let masterQuestion = {
        success: true,
        code: 200,
        locale: "en",
        message: "Record listed successfully.",
        data: {
            list: [
                {
                    id: 3,
                    type: 3,
                    q_id: 3,
                    title: "どのようなサポートが必要ですか？",
                    title_en: "どのようなサポートが必要ですか？",
                    options: [],
                    options_en: [],
                    display_order: 4,
                    isRequired: 0,
                    hasIcon: true,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-09T18:25:33.000000Z",
                    updated_at: "2023-10-09T18:25:33.000000Z",
                    deleted_at: null,
                    options_combine: [],
                },
                {
                    id: 4,
                    type: 3,
                    q_id: 4,
                    title: "アレルギーがあれば教えてください",
                    title_en: "アレルギーがあれば教えてください",
                    options: [],
                    options_en: [],
                    display_order: 3,
                    isRequired: 0,
                    hasIcon: true,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-09T18:19:09.000000Z",
                    updated_at: "2023-10-09T18:19:09.000000Z",
                    deleted_at: null,
                    options_combine: []
                },
                {
                    id: 5,
                    type: 3,
                    q_id: 5,
                    title: "その他特記事項があれば記入してください",
                    title_en: "その他特記事項があれば記入してください",
                    options: [],
                    options_en: [],
                    display_order: 1,
                    isRequired: 1,
                    hasIcon: true,
                    isVoiceRequired: 1,
                    isVisible: 1,
                    created_at: "2023-09-20T12:13:55.000000Z",
                    updated_at: "2023-09-20T12:13:55.000000Z",
                    deleted_at: null,
                    options_combine: [],
                },
                {
                    id: 7,
                    type: 3,
                    q_id: 7,
                    title: "具体的な場所",
                    title_en: "具体的な場所",
                    options: [],
                    options_en: [],
                    display_order: 1,
                    isRequired: 0,
                    hasIcon: true,
                    isVoiceRequired: 1,
                    isVisible: 1,
                    created_at: "2023-09-20T12:13:55.000000Z",
                    updated_at: "2023-09-20T12:13:55.000000Z",
                    deleted_at: null,
                    options_combine: [],
                },
                {
                    id: 8,
                    type: 5,
                    q_id: 8,
                    title: "地域名",
                    title_en: "地域名",
                    options: ["はい", "いいえ", "不要"],
                    options_en: ["Yes", "No", "Unnecessary"],
                    display_order: 5,
                    isRequired: 1,
                    hasIcon: true,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-16T13:13:44.000000Z",
                    updated_at: "2023-10-20T10:58:46.000000Z",
                    deleted_at: null,
                    options_combine: {
                        option1: "Option1",
                    },
                },
                {
                    id: 11,
                    type: 3,
                    q_id: 11,
                    title: "緊急連絡先",
                    title_en: "緊急連絡先",
                    options: [],
                    options_en: [],
                    display_order: 1,
                    isRequired: 0,
                    hasIcon: true,
                    isVoiceRequired: 1,
                    isVisible: 1,
                    created_at: "2023-09-20T12:13:55.000000Z",
                    updated_at: "2023-09-20T12:13:55.000000Z",
                    deleted_at: null,
                    options_combine: [],
                },
                {
                    id: 12,
                    type: 3,
                    q_id: 12,
                    title: "特記事項１（障がいや持病の状態、解除必要性など）",
                    title_en: "特記事項１（障がいや持病の状態、解除必要性など）",
                    options: [],
                    options_en: [],
                    display_order: 1,
                    isRequired: 0,
                    hasIcon: true,
                    isVoiceRequired: 1,
                    isVisible: 1,
                    created_at: "2023-09-20T12:13:55.000000Z",
                    updated_at: "2023-09-20T12:13:55.000000Z",
                    deleted_at: null,
                    options_combine: [],
                },
                {
                    id: 13,
                    type: 3,
                    q_id: 13,
                    title: "特記事項２（資格、協力できることなど）",
                    title_en: "特記事項２（資格、協力できることなど）",
                    options: [],
                    options_en: [],
                    display_order: 1,
                    isRequired: 0,
                    hasIcon: true,
                    isVoiceRequired: 1,
                    isVisible: 1,
                    created_at: "2023-09-20T12:13:55.000000Z",
                    updated_at: "2023-09-20T12:13:55.000000Z",
                    deleted_at: null,
                    options_combine: [],
                },
            ],
            total: 8,
        },
    }
    let individualQuestion = {
        success: true,
        code: 200,
        locale: "en",
        message: "Record listed successfully.",
        data: {
            list: [
                {
                    id: 1,
                    type: 1,
                    q_id: 1,
                    title: "現在妊娠していますか？",
                    title_en: "現在妊娠していますか？",
                    options: ["はい", "いいえ", "不要"],
                    options_en: ["Yes", "No", "Unnecessary"],
                    display_order: 5,
                    isRequired: 0,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-16T13:13:44.000000Z",
                    updated_at: "2023-10-20T10:58:46.000000Z",
                    deleted_at: null,
                    options_combine: {
                        option1: "Option1",
                    },
                },
                {
                    id: 2,
                    type: 1,
                    q_id: 2,
                    title: "特別なサポートが必要ですか？",
                    title_en: "特別なサポートが必要ですか？",
                    options: ["はい", "いいえ", "不要"],
                    options_en: ["Yes", "No", "Unnecessary"],
                    display_order: 5,
                    isRequired: 0,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-16T13:13:44.000000Z",
                    updated_at: "2023-10-20T10:58:46.000000Z",
                    deleted_at: null,
                    options_combine: {
                        option1: "Option1",
                    },
                },
                {
                    id: 6,
                    type: 1,
                    q_id: 6,
                    title: "避難所以外に避難していますか？",
                    title_en: "避難所以外に避難していますか？",
                    options: ["市内", "市外", "不要", "県外"],
                    options_en: ["Within City", "Outside City", "Unnecessary", "Outside Prefecture"],
                    display_order: 5,
                    isRequired: 1,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-16T13:13:44.000000Z",
                    updated_at: "2023-10-20T10:58:46.000000Z",
                    deleted_at: null,
                    options_combine: {
                        option1: "Option1",
                    },
                },
                {
                    id: 9,
                    type: 1,
                    q_id: 9,
                    title: "住宅被害状況",
                    title_en: "住宅被害状況",
                    options: ["被害なし", "補修必要", "不要", "倒壊", "流出", "ライフライン"],
                    options_en: ["No damage", "Repair required", "Unnecessary", "Collapsed", "Leaked", "Lifeline"],
                    display_order: 5,
                    isRequired: 1,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-16T13:13:44.000000Z",
                    updated_at: "2023-10-20T10:58:46.000000Z",
                    deleted_at: null,
                    options_combine: {
                        option1: "Option1",
                    },
                },
                {
                    id: 10,
                    type: 1,
                    q_id: 10,
                    title: "応急仮説住宅",
                    title_en: "応急仮説住宅",
                    options: ["希望する", "希望しない", "不要"],
                    options_en: ["Agree", "DisAgree", "Unnecessary"],
                    display_order: 5,
                    isRequired: 1,
                    isVoiceRequired: 0,
                    isVisible: 0,
                    created_at: "2023-10-16T13:13:44.000000Z",
                    updated_at: "2023-10-20T10:58:46.000000Z",
                    deleted_at: null,
                    options_combine: {
                        option1: "Option1",
                    },
                },
            ],
            total: 5,
        },
    };

    const [individualQuestionAnswer, setIndividualQuestionAnswer] = useState([]);
    const [masterQuestionAnswer, setMasterQuestionAnswer] = useState([]);
    const [basicDataInfo, setBasicDataInfo] = useState({})
    const [otherBasicDataInfo, setOtherBasicDataInfo] = useState({
        specialCareType: [],
        remarks: ""
    })

    const [pageFiveValues, setPageFiveValues] = useState({
        evacuationPlace: "",
        agreeCheckOne: true,
        agreeCheckTwo: true
    })

    const [hasErrors, setHasErrors] = useState(false)
    const [masterHasErrors, setMasterHasErrors] = useState(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)
    const [isMasterFormSubmitted, setIsMasterFormSubmitted] = useState(false)
    const [count, setCounter] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [specialCareTypes, setSpecialCareTypes] = useState([]);
    const [activeEvacuationOptions, setActiveEvacutaionOptions] = useState([]);
    const genderOptions = [
        { name: translate(localeJson, 'c_male'), value: 1 },
        { name: translate(localeJson, 'c_female'), value: 2 },
        { name: translate(localeJson, 'c_not_answer'), value: 3 },
    ]
    const specialCareTypeOptions = [
        { name: "妊産婦", value: "妊産婦" },
        { name: "乳幼児", value: "乳幼児" },
        { name: "障がい者", value: "障がい者" },
        { name: "要介護者", value: "要介護者" },
        { name: "アレルギー", value: "アレルギー" },
        { name: "外国籍", value: "外国籍" },
        { name: "新生児", value: "新生児" },
        { name: "医療機器利用者", value: "医療機器利用者" },
        { name: "その他", value: "その他" },
    ]

    const evacuationOptions = [
        { name: "--", value: "" },
        { name: "千葉", value: "千葉" },
        { name: "東京", value: "東京" },
        { name: "横浜", value: "横浜" },
        { name: "大阪", value: "大阪" },
        { name: "名古屋", value: "名古屋" },
        { name: "北海道", value: "北海道" }
    ]

    const steps = [
        { label: 'Step 1' },
        { label: 'Step 2' }
    ];

    const { getBasicDetailsInfo, getActiveEvacuationPlaceList, getMasterQuestionnaireList, getIndividualQuestionnaireList, getSpecialCareDetails, registerTemporaryUser } = TempRegisterServices;


    useEffect(() => {
        const fetchData = async () => {
            await getUserBasicInfo();
            await OnGetListMountingFetchSpecialCare();
            await getActiveEvacuationPlace();
            setLoader(false)
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
            return translate(localeJson, 'c_not_answer');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'male');
        }
    }
    const getUserBasicInfo = () => {
        let payload = {
            "yapple_id": "",
            "ppid": "00000011"
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

    const getPrefectureName = (id) => {
        let prefectureName = prefectures.find((item) => item.value == id);
        if (prefectureName) {
            return prefectureName.name;
        }
        return "";
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
                "answer_en": item?.answer ? item.answer : [],
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
        console.log(basicDataInfo);
        console.log(otherBasicDataInfo);
        console.log(individualQuestionAnswer);
        console.log(masterQuestionAnswer);
        console.log(pageFiveValues);
        let payload = {
            "family_code": basicDataInfo.householdNumber,
            "place_id": pageFiveValues.evacuationPlace,
            "yapple_id": basicDataInfo.yapple_id,
            "ppid": basicDataInfo.ppid,
            "join_date": getEnglishDateTimeSlashDisplayFormatWithSeconds(new Date()),
            "zip_code": basicDataInfo.postalCode,
            "prefecture_id": getPrefectureID(basicDataInfo.address_full),
            "address": basicDataInfo.address_full,
            "address_default": "",
            "tel": basicDataInfo.contactNumber.replaceAll("-", ""),
            "is_owner": 1,
            "is_public": 0,
            "public_info": pageFiveValues.agreeCheckTwo ? 1 : 0,
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
            if (response.code == 'ERR_NETWORK') {
                toast.error(translate(localeJson, 'register_error_message'), {
                    position: "top-right",
                });
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
                // setIndividualQuestionAnswer(individualQuestion.data.list)
                const data = res.data.list;
                let modifiedItem = [];
                data.map((item) => {
                    item['display'] = true;
                    let findData = baseAnswers.find((ques) => ques.question_id == item.id);
                    if (findData) {
                        item['answer'] = findData.answer
                    }
                    modifiedItem.push(item)
                })
                setIndividualQuestionAnswer(modifiedItem);
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
                // setMasterQuestionAnswer(masterQuestion.data.list)
                const data = res.data.list;
                let modifiedItem = [];
                data.map((item) => {
                    item['display'] = true;
                    let findData = baseAnswers.find((ques) => ques.question_id == item.id);
                    if (findData) {
                        item['answer'] = findData.answer
                    }
                    modifiedItem.push(item)
                })
                setMasterQuestionAnswer(modifiedItem);
            }
        })
    }

    const OnGetListMountingFetchSpecialCare = () => {
        getSpecialCareDetails((res) => {
            if (res) {
                const data = res.data.model.list;
                const options = data.map(item => ({
                    name: item.name,
                    name_en: item.name_en,
                    value: item.id
                }))
                setSpecialCareTypes(options);
            }
        })
    }

    const step1Schema = Yup.object().shape({
        contactNumber: Yup.string()
            .required(translate(localeJson, 'phone_no_required'))
            .test('starts-with-zero', translate(localeJson, 'phone_num_start'), value => {
                if (value) {
                    return value.charAt(0) === '0';
                }
                return true; // Return true for empty values or use .required() in schema to enforce non-empty strings
            })
            .matches(/^[0-9]{10,11}$/, translate(localeJson, "phone")),
    });
    const step2Schema = Yup.object().shape({
        specialCareType: Yup.array()
            .min(1, translate(localeJson, 'special_care_list') + translate(localeJson, 'is_required'))
    });

    const next = () => {
        setActiveIndex((prevIndex) => prevIndex + 1);
        window.scrollTo({ top: 0 });
    };

    const previous = () => {
        setActiveIndex((prevIndex) => prevIndex - 1);
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
                specialCareName = specialCareName ? (specialCareName + ", " + findCare.name) : findCare.name;
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

    const getBasicAddress = () => {
        return ((basicDataInfo.address?.prefecture ? basicDataInfo.address.prefecture : "") + " " + basicDataInfo.address?.cityWard
            + basicDataInfo.address?.houseNameNumber);
    }

    const agreeTextWithHTML = (
        <div>
            {translate(localeJson, 'agree_note_oneA')}
            <span dangerouslySetInnerHTML={{ __html: "<a href='https://www.city.yabu.hyogo.jp/site/privacy.html' target='_blank'><u>" + translate(localeJson, 'c_individual_information') + "</u></a>" }} />
            {translate(localeJson, 'agree_note_oneB')}
        </div>
    );

    const getEvacuationPlaceName = (placeID) => {
        let findData = activeEvacuationOptions.find((item) => item.value == placeID)
        if (findData) {
            return findData.name;
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
                getAnswer = getAnswer + " " + item;
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
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='grid pr-0 col-12 sm:col-12 md:col-10 lg:col-8 lg:col-offset-2 md:col-offset-1'>
                            <div className='col-12 pr-0'>
                                <div className='grid pb-2'>
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'evacuee_information')} />
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
                                        <label htmlFor="name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_jp_name')}
                                        </label>
                                        <label htmlFor="name_value">
                                            {basicDataInfo.name}
                                        </label>
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
                                        <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_refugee_name')}
                                        </label>
                                        <label htmlFor="refugee_value">
                                            {basicDataInfo.furigana}
                                        </label>
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
                                        <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_address')}
                                        </label>
                                        <label htmlFor="address_value">
                                            <span className='block'>{basicDataInfo.address_full}</span>
                                        </label>
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
                                        <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_dob')}
                                        </label>
                                        <label htmlFor="refugee_value">
                                            {getJapaneseDateDisplayYYYYMMDDFormat(basicDataInfo.dob_full)}
                                        </label>
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
                                        <label htmlFor="gender" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'c_gender')}
                                        </label>
                                        <label htmlFor="gender_value">
                                            {getGenderValue(basicDataInfo.gender)}
                                        </label>
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
                                        <label htmlFor="household" className='pb-1 font-bold block'>
                                            {translate(localeJson, 'household_number')}
                                        </label>
                                        <label htmlFor="household_value">
                                            {basicDataInfo.householdNumber}
                                        </label>
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 pb-3'>
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
                                                        re.test(evt.target.value)
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
                                <div className='grid block sm:hidden md:hidden lg:hidden col-10 col-offset-1 sm:col-12 md:col-12 lg:col-12 sm:col-offset-0 md:col-offset-0 lg:col-offset-0 mt-8'>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6 sm:text-right md:text-right lg:text-right'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-10 lg:w-10",
                                            rounded: true,
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-10 lg:w-10",
                                            rounded: true,
                                            onClick: () => { router.push('/user/pre-register-list') }
                                        }} parentClass={"inline"} />
                                    </div>
                                </div>
                                <div className="col-12 hidden sm:block md:block lg:block">
                                    <div className='p-5 fixed bottom-0 w-12 sm:w-12 md:w-10 lg:w-8'>
                                        <div className='sm:flex md:flex lg:flex justify-space-between'>
                                            <Button buttonProps={{
                                                type: "submit",
                                                text: translate(localeJson, 'next'),
                                                buttonClass: "multi-form-submit w-10",
                                                rounded: true,
                                            }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6 sm:text-right md:text-right lg:text-right"} />
                                            <Button buttonProps={{
                                                type: "button",
                                                text: translate(localeJson, 'back'),
                                                buttonClass: "multi-form-submit return w-10",
                                                rounded: true,
                                                onClick: () => { router.push('/user/pre-register-list') }
                                            }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"} />
                                        </div>
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
                        <div className='grid pr-0 col-12 sm:col-12 md:col-10 lg:col-8 lg:col-offset-2 md:col-offset-1'>
                            <div className='col-12 pr-0'>
                                <div className='grid'>
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'special_consider')} />
                                    </div>
                                    <div className='gender-view col-12 sm:col-10 md:col-8 lg:col-8 pb-3'>
                                        <div className='outer-label w-12'>
                                            <label>{translate(localeJson, 'c_user_care')}
                                                <span className='p-error'>{"*"}</span>
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
                                    <div className='col-12 sm:col-10 md:col-8 lg:col-8'>
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
                                    <div className='grid block sm:hidden md:hidden lg:hidden col-10 col-offset-1 sm:col-12 md:col-12 lg:col-12 sm:col-offset-0 md:col-offset-0 lg:col-offset-0 mt-8'>
                                        <div className='col-12 sm:col-6 md:col-6 lg:col-6 sm:text-right md:text-right lg:text-right'>
                                            <Button buttonProps={{
                                                type: "submit",
                                                text: translate(localeJson, 'next'),
                                                buttonClass: "multi-form-submit w-12 sm:w-12 md:w-10 lg:w-10",
                                                rounded: true,
                                            }} parentClass={"inline"} />
                                        </div>
                                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                                            <Button buttonProps={{
                                                type: "button",
                                                text: translate(localeJson, 'back'),
                                                buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-10 lg:w-10",
                                                rounded: true,
                                                onClick: () => goToPreviousStep()
                                            }} parentClass={"inline"} />
                                        </div>
                                    </div>
                                    <div className="col-12 hidden sm:block md:block lg:block">
                                        <div className='p-5 fixed bottom-0 w-12 sm:w-12 md:w-10 lg:w-8'>
                                            <div className='sm:flex md:flex lg:flex justify-space-between'>
                                                <Button buttonProps={{
                                                    type: "submit",
                                                    text: translate(localeJson, 'next'),
                                                    buttonClass: "multi-form-submit w-10",
                                                    rounded: true,
                                                }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6 sm:text-right md:text-right lg:text-right"} />
                                                <Button buttonProps={{
                                                    type: "button",
                                                    text: translate(localeJson, 'back'),
                                                    buttonClass: "multi-form-submit return w-10",
                                                    rounded: true,
                                                    onClick: () => goToPreviousStep()
                                                }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"} />
                                            </div>
                                        </div>
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
                        <div className='grid pr-0 col-12 sm:col-12 md:col-10 lg:col-8 md:col-offset-1 lg:col-offset-2'>
                            <div className='col-12 pr-0'>
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
                                <div className='grid col-10 col-offset-1 sm:col-12 md:col-12 lg:col-12 sm:col-offset-0 md:col-offset-0 lg:col-offset-0 mt-8'>
                                    <div className='pt-3 col-12 sm:col-6 md:col-6 lg:col-6 sm:text-right md:text-right lg:text-right'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-10 lg:w-10",
                                            rounded: true,
                                            onClick: () => {
                                                setCounter(count + 1)
                                                setIsFormSubmitted(true)
                                                handleSubmit()
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='pt-3 col-12 sm:col-6 md:col-6 lg:col-6'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-10 lg:w-10",
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
                        <div className='grid pr-0 col-12 sm:col-12 md:col-10 lg:col-8 lg:col-offset-2 md:col-offset-1'>
                            <div className='col-12 pr-0'>
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
                                <div className='grid col-10 col-offset-1 sm:col-12 md:col-12 lg:col-12 sm:col-offset-0 md:col-offset-0 lg:col-offset-0  mt-8'>
                                    <div className='pt-3 col-12 sm:col-6 md:col-6 lg:col-6 sm:text-right md:text-right lg:text-right'>
                                        <Button buttonProps={{
                                            type: "submit",
                                            text: translate(localeJson, 'next'),
                                            buttonClass: "multi-form-submit w-12 sm:w-12 md:w-10 lg:w-10",
                                            rounded: true,
                                            onClick: () => {
                                                setCounter(count + 1)
                                                setIsMasterFormSubmitted(true)
                                                handleSubmit()
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                    <div className='pt-3 col-12 sm:col-6 md:col-6 lg:col-6'>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-10 lg:w-10",
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
                        <div className='grid pr-0 col-12 sm:col-12 md:col-10 lg:col-8 md:col-offset-1 lg:col-offset-2'>
                            <div className='col-12 pr-0'>
                                <div className="grid">
                                    <div className='col-12'>
                                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'c_evacuation_location')} />
                                    </div>
                                    <div className='col-12 sm:col-8 md:col-8 lg:col-8 pb-3'>
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
                                    <div className="col-12">
                                        <div className='p-5 fixed bottom-0 w-12 sm:w-12 md:w-10 lg:w-8'>
                                            <div className='sm:flex md:flex lg:flex justify-space-between'>
                                                <Button buttonProps={{
                                                    type: "submit",
                                                    text: translate(localeJson, 'go_to_confirmation_screen'),
                                                    buttonClass: "multi-form-submit w-10",
                                                    rounded: true,
                                                    disabled: !values.agreeCheckOne
                                                }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6 sm:text-right md:text-right lg:text-right"} />
                                                <Button buttonProps={{
                                                    type: "button",
                                                    text: translate(localeJson, 'back'),
                                                    buttonClass: "multi-form-submit return w-10",
                                                    rounded: true,
                                                    onClick: () => goToPreviousStep()
                                                }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>,
        <>
            <div className='grid pr-0 col-12 sm:col-12 md:col-10 lg:col-8 md:col-offset-1 lg:col-offset-2'>
                <div className='col-12 pr-0'>
                    <div className='grid pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'evacuee_information')} />
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="name" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_jp_name')}
                            </label>
                            <label htmlFor="name_value">
                                {basicDataInfo.name}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_refugee_name')}
                            </label>
                            <label htmlFor="refugee_value">
                                {basicDataInfo.furigana}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="address" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_address')}
                            </label>
                            <label htmlFor="address_value">
                                <span className='block'>{basicDataInfo.address_full}</span>
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="gender" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_gender')}
                            </label>
                            <label htmlFor="gender_value" className='pt-5'>
                                {getGenderValue(basicDataInfo.gender)}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="refugee_name" className='pb-1 font-bold block'>
                                {translate(localeJson, 'c_dob')}
                            </label>
                            <label htmlFor="refugee_value">
                                {getJapaneseDateDisplayYYYYMMDDFormat(basicDataInfo.dob_full)}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="household" className='pb-1 font-bold block'>
                                {translate(localeJson, 'household_number')}
                            </label>
                            <label htmlFor="household_value">
                                {basicDataInfo.householdNumber}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="household" className='pb-1 font-bold block'>
                                {translate(localeJson, 'phone_number')}
                            </label>
                            <label htmlFor="household_value">
                                {basicDataInfo.contactNumber}
                            </label>
                        </div>
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'special_consider')} />
                        </div>

                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="contact" className='font-bold block'>
                                {translate(localeJson, 'c_user_care')}
                            </label>
                            <label htmlFor="contact_value" className='pt-5'>
                                {getSelectedSpecialCareType(otherBasicDataInfo.specialCareType)}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="remarks" className='font-bold block'>
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
                            <div className='col-12 sm:col-6 md:col-6 lg:col-6' key={index}>
                                <label htmlFor={`individual_question_${index}`} className='font-bold block'>
                                    {locale == 'ja' ? question.title : (question.title_en ? question.title_en : question.title)}
                                </label>
                                <label htmlFor={`individual_question_answer${index}`} className='pt-5'>
                                    {question?.answer ? getQuestionAnswer(question.answer) : " - "}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'master_question_related')} />
                        </div>
                        {masterQuestionAnswer?.map((question, index) => (
                            <div className='col-12 sm:col-6 md:col-6 lg:col-6' key={index}>
                                <label htmlFor={`master_question_${index}`} className='font-bold block'>
                                    {locale == 'ja' ? question.title : (question.title_en ? question.title_en : question.title)}
                                </label>
                                <label htmlFor={`master_question_answer${index}`} className='pt-5'>
                                    {question?.answer ? getQuestionAnswer(question.answer) : " - "}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className='grid pt-3 pb-2'>
                        <div className='col-12 pb-3'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, 'evacuation_place')} />
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="evacuation_place" className='font-bold block pb-2'>
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
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="evacuation_place" className='font-bold block'>
                                {translate(localeJson, 'agree_label')}
                            </label>
                            <label htmlFor="evacuation_place_value" className='pt-5'>
                                {pageFiveValues.agreeCheckOne ? translate(localeJson, 'agree') : translate(localeJson, 'disagree')}
                            </label>
                        </div>
                        <div className='col-12 sm:col-6 md:col-6 lg:col-6'>
                            <label htmlFor="to_publish" className='font-bold block'>
                                {translate(localeJson, 'publish_label')}
                            </label>
                            <label htmlFor="to_publish_value" className='pt-5'>
                                {pageFiveValues.agreeCheckTwo ? translate(localeJson, 'to_publish') : translate(localeJson, 'not_to_publish')}
                            </label>
                        </div>
                    </div>
                    <div className='grid col-10 col-offset-1 sm:col-12 md:col-12 lg:col-12 sm:col-offset-0 md:col-offset-0 lg:col-offset-0  mt-8'>
                        <div className='pt-3 col-12 sm:col-6 md:col-6 lg:col-6 sm:text-right md:text-right lg:text-right'>
                            <Button buttonProps={{
                                type: "submit",
                                text: translate(localeJson, 'register'),
                                buttonClass: "multi-form-submit w-12 sm:w-12 md:w-10 lg:w-10",
                                rounded: true,
                                onClick: () => {
                                    registerTemporaryUserData()
                                }
                            }} parentClass={"inline"} />
                        </div>
                        <div className='pt-3 col-12 sm:col-6 md:col-6 lg:col-6'>
                            <Button buttonProps={{
                                type: "submit",
                                text: translate(localeJson, 'back'),
                                buttonClass: "multi-form-submit return w-12 sm:w-12 md:w-10 lg:w-10",
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
                        <div className='p-5 fixed bottom-0 w-8 sm:w-5 md:w-4 lg:w-3'>
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
        router.push('/user/pre-register-list');
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