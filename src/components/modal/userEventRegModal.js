import React, { useContext, useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { SelectButton } from "primereact/selectbutton";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  getValueByKeyRecursively as translate,
  getEnglishDateDisplayFormat,
  convertToSingleByte,
  splitJapaneseAddress,
} from "@/helper";
import {
  Button,
  ButtonRounded,
  ValidationError,
  PerspectiveCropping,
  NormalCheckBox,
} from "@/components";
import {
  prefectures,
  prefectures_en,
  gender_jp,
  gender_en,
} from "@/utils/constant";
import {
  CommonServices,
  TempRegisterServices,
} from "@/services";
import QuestionList from "@/components/masterQuestion";
import { Input, InputDropdown, InputNumber } from "../input";
import QrScannerModal from "@/components/modal/qrScannerModal";
import CustomHeader from "../customHeader";

export default function UserEventRegModal(props) {
  const { localeJson, locale, setLoader } = useContext(LayoutContext);
  // eslint-disable-next-line no-irregular-whitespace
  const katakanaRegex = /^[\u30A1-\u30F6ー　\u0020]*$/;
  const currentDate = new Date();
  const minDOBDate = new Date();
  const genderOptions = [
    { name: translate(localeJson, "c_male"), value: 1 },
    { name: translate(localeJson, "c_female"), value: 2 },
    { name: translate(localeJson, "c_not_answer"), value: 3 },
  ];
  const minYear = parseInt(minDOBDate.getFullYear() - 120);
  const validationSchema = () =>
    Yup.object().shape({
      checked:Yup.boolean().nullable(),
      name_furigana: Yup.string()
        .required(translate(localeJson, "c_name_phonetic_is_required"))
        .max(200, translate(localeJson, "name_max"))
        .matches(katakanaRegex, translate(localeJson, "name_katakana")),
      dob: Yup.object().shape({
        year: Yup.string()
          .required(
            translate(localeJson, "c_year") +
              translate(localeJson, "is_required")
          ).min(4,translate(localeJson, "c_year") +
          translate(localeJson, "is_required")),
        month: Yup.string().required(
          translate(localeJson, "c_month") +
            translate(localeJson, "is_required")
        ),
        date: Yup.string().required(
          translate(localeJson, "c_date") + translate(localeJson, "is_required")
        ),
      }),
      tel: Yup.string()
      .required(translate(localeJson, "phone_no_required"))
        .test(
          "starts-with-zero",
          translate(localeJson, "phone_num_start"),
          (value) => {
            if (value) {
              value = convertToSingleByte(value);
              return value.charAt(0) === "0";
            }
            return true; // Return true for empty values or use .required() in schema to enforce non-empty strings
          }
        )
        .test(
          "is-not-empty",
          translate(localeJson, "phone_no_required"),
          (value) => {
            return value.trim() !== ""; // Check if the string is not empty after trimming whitespace
          }
        )
        .test("matches-pattern", translate(localeJson, "phone"), (value) => {
          if(value)
          {
          const singleByteValue = convertToSingleByte(value);
          return /^[0-9]{10,11}$/.test(singleByteValue);
          }
          else {
            return true;
          }
        }).
        test(
          "at-least-one-checked",
          translate(localeJson, "phone_no_required"),
          (value, parent) => {
            if (parent.parent.checked === true){
              return value?true:false;
            } else {
              return true;
            }
          }
        ),
      // Add other fields and validations as needed
      age: Yup.number()
        .required(translate(localeJson, "age_required")),
      age_m: Yup.number().required(translate(localeJson, "age_required")),
      gender: Yup.string().required(translate(localeJson, "gender_required")),
      postalCode: Yup.string().nullable()
      .test("is-correct",
        translate(localeJson,"zip_code_mis_match"),
        (value)=>{
          if(value != undefined)
          return convertToSingleByte(value)==convertToSingleByte(fetchZipCode);
          else
          return true
        })
        .min(7, translate(localeJson, "postal_code_length"))
        .max(7, translate(localeJson, "postal_code_length")),
      address: Yup.string()
        .required(translate(localeJson, "c_address_is_required"))
        .max(190, translate(localeJson, "address_max_length")),
        address2: Yup.string()
        .nullable()
        .max(190, translate(localeJson, "address_max_length")),
      prefecture_id: Yup.string()
        .nullable()
        .required(translate(localeJson, "c_perfacture_is_required")),
    });
  const {
    open,
    close,
    onSpecialCareEditSuccess,
    header,
    buttonText,
    setEvacueeValues,
    editObj,
    registerModalAction,
    evacuee,
    setModalCountFlag,
    isFrom = "user",
  } = props && props;

  const { getText,getZipCode,getAddress } = CommonServices;
  const {
    getIndividualQuestionnaireList,
    getSpecialCareDetails,
    qrScanRegistration,
    ocrScanRegistration,
  } = TempRegisterServices;
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [count, setCounter] = useState(1);
  const [hasErrors, setHasErrors] = useState(false);
  const [isMRecording, setMIsRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [perspectiveCroppingVisible, setPerspectiveCroppingVisible] =
    useState(false);
  const [repAddress, setRepAddress] = useState({});
  const [haveRepAddress, setHaveRepAddress] = useState(false);
  const [haveRepTel, setHavetel] = useState(false);
  const [isRep, setIsRep] = useState(false);
  const [dobCounter, setDobCounter] = useState(0);
  const [addressCount,setAddressCount] = useState(0);
  const [fetchZipCode,setFetchedZipCode] = useState("");

  useEffect(() => {
    setMIsRecording(isRecording);
  }, [isRecording]);

  const handleRecordingStateChange = (isRecord) => {
    setMIsRecording(isRecord);
    setIsRecording(isRecord);
  };

  const [initialQuestion, setInitialQues] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [specialCare, setSpecialCare] = useState([]);
  useEffect(() => {
    fetchMasterQuestion();
    fetchSpecialCare();
  }, [locale]);

  const fetchSpecialCare = () => {
    getSpecialCareDetails((res) => {
      if (res) {
        setSpecialCare(res.data.model.list);
      }
    });
  };
  const fetchMasterQuestion = () => {
    let payload = {
      filters: {
        start: 0,
        order_by: "asc",
        sort_by: "display_order",
      },
      event_id: 1,
    };
    getIndividualQuestionnaireList(payload, (res) => {
      if (res) {
        let data = res.data.list;
        let sortedData = data
          ? data.sort((a, b) => {
              return parseInt(a.display_order) - parseInt(b.display_order);
            })
          : [];
        setQuestions(sortedData);
        setInitialQues(sortedData);
      }
    });
  };

  const special_care_options = specialCare?.map((item) => ({
    name: locale == "ja" ? item.name : item.name_en,
    value: item.id.toString(), // Convert the ID to string if needed
  }));
  const formikRef = useRef();
  const initialValues =
    registerModalAction == "edit"
      ? editObj
      : {
          id: evacuee && evacuee.length > 0 ? evacuee.length + 1 : 1,
          checked: evacuee && evacuee.length > 0 ? false : true,
          name: "",
          name_furigana: "",
          dob: {
            year: "",
            month: "",
            date: "",
          },
          age: "",
          age_m: "",
          gender: null,
          postalCode: "",
          prefecture_id: null,
          address: "",
          address2: "",
          email: "",
          tel: "",
          specialCareType: null,
          connecting_code: "",
          remarks: "",
          individualQuestions: null,
          telAsRep:false,
          addressAsRep:false,
        };

  useEffect(() => {
    if (registerModalAction === "edit" && editObj.individualQuestions) {
      setQuestions(editObj.individualQuestions);
    }
  }, [editObj]);

  useEffect(() => {
    if (editObj) {
      setTimeout(() => {
        editObj.checked == true ? setIsRep(true) : setIsRep(false);
        const topLevelKeysExist = Object.keys(editObj).length > 0;
        const nestedKeysExist = Object.values(editObj).some(
          (value) => typeof value === "object" && Object.keys(value)?.length > 0
        );

        if (topLevelKeysExist || nestedKeysExist) {
          formikRef.current.validateForm().then(() => {
            const touchedKeys = Object.keys(formikRef.current.initialValues);
            const newTouched = touchedKeys.reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            );
            formikRef.current.setTouched(newTouched);
          });
          setIsFormSubmitted(true);
          setCounter(count + 1);
        }
      }, 1000);
      setFetchedZipCode(editObj.postalCode)
    }
  }, [editObj]);

//   useEffect(() => {
//     const filteredData = evacuee
//       .filter((item) => item.checked === true)
//       .map((item) => {
//         return {
//           address: item.address,
//           address2: item.address2,
//           prefecture_id: item.prefecture_id,
//           postalCode: item.postalCode,
//           tel:item.tel,
//         };
//       });
//     setRepAddress(filteredData);
//   }, [evacuee]);

  useEffect(() => {
    // Scroll to the first error on form submission
    if (
      (Object.keys(formikRef.current.errors).length > 0 && open) ||
      hasErrors
    ) {
      const modalContainer = document.querySelector(".p-dialog");
      const firstErrorElement = modalContainer?.querySelector(".scroll-check");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [count]);

  const handleRepAddress = (evacuees, setFieldValue) => {
    if (evacuees) {
      evacuees?.prefecture_id &&
        setFieldValue("prefecture_id", evacuees?.prefecture_id);
      const re = /^[0-9-]+$/;
      let val;
      if (evacuees.postalCode === "" || re.test(evacuees.postalCode)) {
        val = evacuees.postalCode.replace(/-/g, ""); // Remove any existing hyphens
        if (val.length > 3) {
          val = val.slice(0, 3) + val.slice(3);
        }
        setFieldValue("postalCode", val);
        setFetchedZipCode(val.replace(/-/g, ""));
      }
      if (val?.length >= 7) {
        getAddress(val, (response) => {
          if (response) {
            let address = response;
            const selectedPrefecture = prefectures.find(
              (prefecture) => prefecture.value == address.prefcode
            );
            setFieldValue("prefecture_id", selectedPrefecture?.value);
            setFieldValue("address", address.address2 + address.address3 || "");
          } else {
            setFieldValue("prefecture_id", "");
            setFieldValue("address", "");
          }
        });
      }
      setFieldValue("address", evacuees.address);
      setFieldValue("address2", evacuees.address2);
    }
  };

  const [openQrPopup, setOpenQrPopup] = useState(false);
  const closeQrPopup = () => {
    setOpenQrPopup(false);
  };
  const qrResult = (result) => {
    setLoader(true);
    let formData = new FormData();
    formData.append("content", result);
    setOpenQrPopup(false);
    qrScanRegistration(formData, (res) => {
      if (res) {
        setOpenQrPopup(false);
        const evacueeArray = res.data;
        createEvacuee(evacueeArray, formikRef.current.setFieldValue);
        setLoader(false);
      } else {
        setLoader(false);
      }
    });
  };

  const ocrResult = (result) => {
    setLoader(true);
    let formData = new FormData();
    formData.append("content", result);
    setPerspectiveCroppingVisible(false);
    ocrScanRegistration(formData, (res) => {
      if (res) {
        setPerspectiveCroppingVisible(false);
        const evacueeArray = res.data;
        createEvacuee(evacueeArray, formikRef.current.setFieldValue);
        setLoader(false);
      } else {
        setLoader(false);
      }
    });
  };

  function createEvacuee(evacuees, setFieldValue) {
    setFieldValue("name", evacuees.name || "");
    setFieldValue("name_furigana", evacuees.refugeeName || "");
    setFieldValue("age", evacuees.age || "");
    setFieldValue("age_m", evacuees.month || "");
    setFieldValue("gender", evacuees.gender ? parseInt(evacuees.gender) : "");
    setFieldValue("tel", evacuees.tel || "");
    evacuees?.prefecture_id &&
      setFieldValue("prefecture_id", evacuees?.prefecture_id);
    const re = /^[0-9-]+$/;
    let val;
    if (evacuees.postal_code === "" || re.test(evacuees.postal_code)) {
      val = evacuees.postal_code.replace(/-/g, ""); // Remove any existing hyphens
      if (val.length > 3) {
        val = val.slice(0, 3) + val.slice(3);
      }
      setFieldValue("postalCode", val);
      setFetchedZipCode(val.replace(/-/g, ""))
    }
    if (val.length >= 7) {
      let payload = val.slice(0, 3) +"-"+val.slice(3);
      getAddress(val, (response) => {
        if (response) {
          let address = response;
          const selectedPrefecture = prefectures.find(
            (prefecture) => prefecture.value == address.prefcode
          );
          setFieldValue("prefecture_id", selectedPrefecture?.value);
          setFieldValue("address", address.address2 + address.address3 || "");
        } else {
          setFieldValue("prefecture_id", "");
          setFieldValue("address", "");
        }
      });
    }
    if (evacuees.dob) {
      const birthDate = new Date(evacuees.dob);
      const convertedObject = {
        year: parseInt(birthDate.getFullYear()),
        month: parseInt((birthDate.getMonth() + 1).toString().padStart(2, "0")), // Adding 1 because months are zero-based
        date: parseInt(birthDate.getDate().toString().padStart(2, "0")),
      };
      let age = calculateAge(birthDate);
      setFieldValue("age", parseInt(age.years));
      setFieldValue("age_m", parseInt(age.months));
      setFieldValue("dob", convertedObject || "");
    }
    setFieldValue("address", evacuees.address);
    setFieldValue("address2", evacuees.address2);
    setFieldValue("connecting_code", evacuees.connecting_code);
  }
  function calculateAge(birthdate) {
    const birthdateObj = new Date(birthdate);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - birthdateObj.getFullYear();
    let months = currentDate.getMonth() - birthdateObj.getMonth();

    if (currentDate.getDate() < birthdateObj.getDate()) {
      // Adjust for cases where the birthdate has not occurred yet in the current month
      months--;
    }

    if (months < 0) {
      // Adjust for cases where the birthdate month is ahead of the current month
      years--;
      months += 12;
    }

    return { years, months };
  }

  const Qr = {
    url: "/layout/images/evacuee-qr.png",
  };
  const Card = {
    url: "/layout/images/evacuee-card.png",
  };

  const handleConfirmation = () => {
    const message = translate(localeJson, "person_count_error");
    // Use the browser's built-in confirmation dialog
    const isConfirmed = window.confirm(message);
    if (isConfirmed) {
      close();
      setQuestions(initialQuestion);
      setIsFormSubmitted(false);
      setModalCountFlag(false);
      setHaveRepAddress(false);
      setHavetel(false);
      setFetchedZipCode("")
      formikRef.current.resetForm();
    }
  };

  useEffect(() => {
    let dob = formikRef?.current?.values?.dob;
    if (dob.year && dob.month && dob.date) {
      const convertedDate = new Date(convertToSingleByte(dob.year), convertToSingleByte(dob.month) - 1, convertToSingleByte(dob.date));
      let age = calculateAge(convertedDate);
      let currentYear = new Date().getFullYear();
      let minYear = 1900;
      if (minYear <= parseInt(convertToSingleByte(dob.year))) {
        formikRef.current.setFieldValue("age", age.years);
        formikRef.current.setFieldValue("age_m", age.months);
      }
    }
  }, [dobCounter]);

  useEffect( ()=> {
    let address = formikRef.current.values.address;
    let stateId = formikRef.current.values.prefecture_id;
    let {city,street} = splitJapaneseAddress(address);
    let state = prefectures.find(x => x.value == stateId)?.name;
    if(state && (city && street))
    {
    getZipCode(state,city,street,(res)=>{
      if(res)
      {
        let zipCode = res.result.zipcode;
        setFetchedZipCode(zipCode.replace(/-/g, ""))
        zipCode && formikRef.current.setFieldValue("postalCode",zipCode.replace(/-/g, ""));  
        formikRef.current.validateField("postalCode") 
      }
      else {
        setFetchedZipCode("")
        formikRef.current.validateField("postalCode") 
        
      }
    })
  }
  },[addressCount])

  useEffect(()=> {
    formikRef.current.validateField("postalCode") 
  },[fetchZipCode])

  return (
    <>
      <PerspectiveCropping
        visible={perspectiveCroppingVisible}
        hide={() => setPerspectiveCroppingVisible(false)}
        callback={ocrResult}
      />
      <QrScannerModal
        open={openQrPopup}
        close={closeQrPopup}
        callback={qrResult}
      ></QrScannerModal>
      <Formik
        innerRef={formikRef}
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          if (!hasErrors) {
            setIsFormSubmitted(false);
            setIsRecording(false);
            values.individualQuestions = questions;
            values.tel = convertToSingleByte(values.tel);
            values.postalCode = convertToSingleByte(values.postalCode);
            setEvacueeValues(values);
            setQuestions(initialQuestion);
            setCounter(count + 1);
            close();
            actions.resetForm({ values: initialValues });
            setHaveRepAddress(false);
            setHavetel(false);
            setIsRep(false);
            setFetchedZipCode("")
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
          resetForm,
          setFieldValue,
        }) => (
          <div id="permanentRegister">
            <form onSubmit={handleSubmit}>
              <Dialog
                className="custom-modal h-6 w-full lg:w-30rem md:w-7 sm:w-9"
                header={
                  <div>
                    <CustomHeader
                      headerClass={"page-header1"}
                      customParentClassName={"mb-0"}
                      header={header}
                    />
                  </div>
                }
                visible={open}
                draggable={false}
                op
                blockScroll={true}
                onHide={() => {
                    resetForm();
                    close();
                }}
                footer={
                  <div className="text-center flex flex-column pl-5 pr-5 evacueeFooterButtonText">
                    <Button
                      buttonProps={{
                        buttonClass:
                          "w-full primary-button h-3rem border-radius-5rem mb-3",
                        type: "submit",
                        text: buttonText,
                        onClick: () => {
                          setCounter(count + 1);
                          setIsFormSubmitted(true);
                          setFieldValue("dob.year",convertToSingleByte(values.dob.year))
                          setFieldValue("dob.month",convertToSingleByte(values.dob.month))
                          setFieldValue("dob.date",convertToSingleByte(values.dob.date))
                          handleSubmit();
                        },
                      }}
                      parentClass={"inline primary-button"}
                    />
                    <Button
                      buttonProps={{
                        buttonClass:
                          "w-full back-button h-3rem border-radius-5rem",
                        text: translate(localeJson, "cancel"),
                        type: "reset",
                        onClick: () => {
                            close();
                            resetForm();
                          }
                      }}
                      parentClass={"inline back-button"}
                    />
                  </div>
                }
              >
                <div className={`modal-content`}>
                  <div className="">
                    <div className="pl-5 pr-5">
                      <div className="mb-2 col-12">
                        <Input
                          inputProps={{
                            inputParentClassName: `w-full custom_input ${
                              errors.name && touched.name && "p-invalid"
                            }`,
                            labelProps: {
                              text: translate(localeJson, "c_name_kanji"),
                              inputLabelClassName: "block font-bold",
                              labelMainClassName: "pb-1",
                            },
                            inputClassName: "w-full",
                            id: "name",
                            name: "name",
                            value: values.name,
                            placeholder: translate(
                              localeJson,
                              "placeholder_name"
                            ),
                            onChange: handleChange,
                            onBlur: handleBlur,
                            disabled:
                              values?.family_register_from == "0" ||
                              isMRecording
                                ? true
                                : false,
                            inputRightIconProps: {
                              display: true,
                              audio: {
                                display: true,
                              },
                              icon: "",
                              isRecording: isMRecording,
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
                        <ValidationError
                          errorBlock={
                            errors.name && touched.name && errors.name
                          }
                        />
                      </div>
                      <div className="mb-2 col-12">
                        <div className="w-12">
                          <Input
                            inputProps={{
                              inputParentClassName: `w-full custom_input ${
                                errors.name_furigana &&
                                touched.name_furigana &&
                                "p-invalid"
                              }`,
                              labelProps: {
                                text: translate(localeJson, "c_refugee_name"),
                                spanText: "*",
                                inputLabelClassName: "block font-bold",
                                inputLabelSpanClassName: "p-error",
                                labelMainClassName: "pb-1",
                              },
                              inputClassName: "w-full",
                              id: "name_furigana",
                              name: "name_furigana",
                              value: values.name_furigana,
                              disabled:
                                values?.family_register_from == "0" ||
                                isMRecording
                                  ? true
                                  : false,
                              placeholder: translate(
                                localeJson,
                                "placeholder_furigana"
                              ),
                              onChange: handleChange,
                              onBlur: handleBlur,
                              inputRightIconProps: {
                                display: true,
                                audio: {
                                  display: true,
                                },
                                icon: "",
                                isRecording: isMRecording,
                                onRecordValueChange: (rec) => {
                                  const fromData = new FormData();
                                  fromData.append("audio_sample", rec);
                                  getText(fromData, (res) => {
                                    if (res?.data?.content) {
                                      setFieldValue(
                                        "name_furigana",
                                        res?.data?.content
                                      );
                                    }
                                  });
                                },
                                onRecordingStateChange:
                                  handleRecordingStateChange,
                              },
                            }}
                          />
                          <ValidationError
                            errorBlock={
                              errors.name_furigana &&
                              touched.name_furigana &&
                              errors.name_furigana
                            }
                          />
                        </div>
                      </div>
                      <div className="mb-2  col-12 ">
                        <div className="w-12">
                        {evacuee?.length > 0 && !values.checked && (
                          <div className="w-full mb-1 mt-2">
                            <NormalCheckBox
                              checkBoxProps={{
                                checked: values.telAsRep,
                                value: translate(localeJson, "rep_address"),
                                labelClass: `pl-2 ${
                                  locale == "en" ? "pt-1" : ""
                                }`,
                                onChange: (e) => {
                                  setFieldValue("telAsRep",e.checked)
                                  setHavetel(e.checked);
                                  if (e.checked == true) {
                                    setFieldValue("tel",repAddress[0].tel)
                                  }
                                  else {
                                    setFieldValue("tel",'');
                                  }
                                },
                              }}
                              parentClass={
                                "flex approve-check align-items-center"
                              }
                            />
                          </div>
                        )}
                          <Input
                            inputProps={{
                              inputParentClassName: `w-full custom_input ${
                                errors.tel && touched.tel && "p-invalid"
                              }`,
                              labelProps: {
                                text: translate(localeJson, "phone_number"),
                                spanText: "*",
                                inputLabelClassName: "block font-bold",
                                inputLabelSpanClassName: "p-error",
                                labelMainClassName: "pb-1",
                              },
                              inputClassName: "w-full",
                              id: "tel",
                              name: "tel",
                              value: values.tel,
                              inputMode: "numeric",
                              disabled:
                                values?.family_register_from == "0" ||
                                isMRecording || values.telAsRep
                                  ? true
                                  : false,
                              placeholder: translate(
                                localeJson,
                                "without_hypen"
                              ),
                              onChange: (evt) => {
                                const re = /^[0-9-]+$/;
                                let val;
                                if (
                                  evt.target.value === "" ||
                                  re.test(convertToSingleByte(evt.target.value))
                                ) {
                                  val = evt.target.value.replace(/-/g, "");
                                  setFieldValue("tel", val);
                                }
                              },
                              onBlur: handleBlur,
                              inputRightIconProps: {
                                display: true,
                                audio: {
                                  display: true,
                                },
                                icon: "",
                                isRecording: isMRecording,
                                onRecordValueChange: (rec) => {
                                  const fromData = new FormData();
                                  fromData.append("audio_sample", rec);
                                  getText(fromData, (res) => {
                                    const re = /^[0-9-]+$/;
                                    if (res?.data?.content) {
                                      if(re.test(res?.data?.content))
                                      {
                                      setFieldValue("tel", res?.data?.content);
                                      }
                                    }
                                  });
                                },
                                onRecordingStateChange:
                                  handleRecordingStateChange,
                              },
                            }}
                          />
                          <ValidationError
                            errorBlock={errors.tel && touched.tel && errors.tel}
                          />
                        </div>
                      </div>

                      <div className="mb-2  col-12 ">
                      {evacuee?.length > 0 && !values.checked && (
                          <div className="w-full mb-1 mt-2">
                            <NormalCheckBox
                              checkBoxProps={{
                                checked: values.addressAsRep,
                                value: translate(localeJson, "rep_address"),
                                labelClass: `pl-2 ${
                                  locale == "en" ? "pt-1" : ""
                                }`,
                                onChange: (e) => {
                                  setFieldValue("addressAsRep",e.checked)
                                  setHaveRepAddress(e.checked);
                                  if (e.checked == true) {
                                    handleRepAddress(
                                      repAddress[0],
                                      setFieldValue
                                    );
                                  }
                                  else {
                                    setFieldValue("postalCode",'');
                                    setFieldValue("address",'');
                                    setFieldValue("address2",'');
                                    setFieldValue("prefecture_id",'');
                                  }
                                },
                              }}
                              parentClass={
                                "flex approve-check align-items-center"
                              }
                            />
                          </div>
                        )}
                        <div className="outer-label pb-1 w-12">
                          <label>{translate(localeJson, "c_address")}</label>
                          <span className="p-error">*</span>
                        </div>
                        <Input
                          inputProps={{
                            inputParentClassName: `w-full custom_input ${
                              errors.postalCode &&
                              touched.postalCode &&
                              "p-invalid"
                            }`,
                            labelProps: {
                              text: "",
                              spanText: "*",
                              inputLabelClassName: "block font-bold",
                              inputLabelSpanClassName: "p-error",
                              labelMainClassName: "pb-1",
                            },
                            inputClassName: "w-full",
                            id: "postalCode",
                            name: "postalCode",
                            inputMode: "numeric",
                            type: "text",
                            value: values.postalCode,
                            disabled:
                              values?.family_register_from == "0" ||
                              isMRecording || values.addressAsRep
                                ? true
                                : false,
                            placeholder: translate(localeJson, "post_letter"),
                            onChange: (evt) => {
                              const re = /^[0-9-]+$/;
                              let val = evt.target.value.replace(/-/g, "");
                              if (evt.target.value === "") {
                                setFieldValue("postalCode", evt.target.value);
                                setFetchedZipCode("")
                                return;
                              }
                              if (re.test(convertToSingleByte(val))) {
                                if (val?.length <= 7) {
                                  val = evt.target.value.replace(/-/g, ""); // Remove any existing hyphens
                                  setFieldValue("postalCode", val);
                                  setFetchedZipCode(val.replace(/-/g, ""))
                                } else {
                                  setFieldValue("postalCode", val.slice(0,7));
                                  setFetchedZipCode(val.slice(0,7))
                                  return;
                                }
                              }
                              if (val?.length == 7) {
                                let payload = convertToSingleByte(val);
                                getAddress(payload, (response) => {
                                  if (response) {
                                    let address = response;
                                    const selectedPrefecture =
                                      prefectures.find(
                                        (prefecture) =>
                                          prefecture.value == address.prefcode
                                      );
                                    setFieldValue(
                                      "prefecture_id",
                                      selectedPrefecture?.value
                                    );
                                    setFieldValue(
                                      "address",
                                      address.address2 + address.address3 ||
                                        ""
                                    );
                                  } else {
                                    setFieldValue("prefecture_id", "");
                                    setFieldValue("address", "");
                                  }
                                })
                              }
                            },
                            onBlur: handleBlur,
                            inputRightIconProps: {
                              display: true,
                              audio: {
                                display: true,
                              },
                              icon: "",
                              isRecording: isMRecording,
                              onRecordValueChange: (rec) => {
                                const fromData = new FormData();
                                fromData.append("audio_sample", rec);
                                getText(fromData, (res) => {
                                  if (res?.data?.content) {
                                    const re = /^[0-9-]+$/;
                                    if(re.test(res?.data?.content))
                                    {
                                    setFieldValue(
                                      "postalCode",
                                      res?.data?.content
                                    );
                                    }
                                  }
                                });
                              },
                              onRecordingStateChange:
                                handleRecordingStateChange,
                            },
                          }}
                        />
                        <ValidationError
                          errorBlock={
                            errors.postalCode &&
                            touched.postalCode &&
                            errors.postalCode
                          }
                        />
                        <InputDropdown
                          inputDropdownProps={{
                            inputDropdownParentClassName: `custom_input mt-2 ${
                              errors.prefecture_id &&
                              touched.prefecture_id &&
                              "p-invalid"
                            }`,
                            labelProps: {
                              inputDropdownLabelClassName: "block font-bold",
                              spanText: "*",
                              inputDropdownLabelSpanClassName: "p-error",
                              labelMainClassName: "pb-2",
                            },
                            inputDropdownClassName: "w-full w-full",
                            name: "prefecture_id",
                            value: values.prefecture_id,
                            disabled:
                              values?.family_register_from == "0" || values.addressAsRep
                                ? true
                                : false,
                            placeholder: translate(
                              localeJson,
                              "prefecture_places"
                            ),
                            options:
                              locale == "ja" ? prefectures : prefectures_en,
                            optionLabel: "name",
                            onChange: (evt)=>{
                              setFieldValue("prefecture_id",evt.target.value);
                              if(values.address)
                              {
                                setAddressCount(addressCount+1)
                              }
                            },
                            onBlur: handleBlur,
                            emptyMessage: translate(
                              localeJson,
                              "data_not_found"
                            ),
                          }}
                        />
                        <ValidationError
                          errorBlock={
                            errors.prefecture_id &&
                            touched.prefecture_id &&
                            errors.prefecture_id
                          }
                        />
                        <Input
                          inputProps={{
                            inputParentClassName: `w-full custom_input mt-2 mb-2 ${
                              errors.address && touched.address && "p-invalid"
                            }`,
                            labelProps: {
                              spanText: "*",
                              inputLabelClassName: "block font-bold",
                              inputLabelSpanClassName: "p-error",
                              labelMainClassName: "pb-2",
                            },
                            inputClassName: "w-full",
                            id: "address",
                            name: "address",
                            value: values.address,
                            disabled:
                              values?.family_register_from == "0" ||
                              isMRecording || values.addressAsRep
                                ? true
                                : false,
                            placeholder: translate(localeJson, "city_ward"),
                            onChange: (evt)=>{
                              setFieldValue("address",evt.target.value)
                            },
                            onMouseLeave:(evt)=> {
                              setAddressCount(addressCount+1)                              
                            },
                            onTouchEnd:(evt)=> {
                              setAddressCount(addressCount+1)                              
                            },
                            onBlur: handleBlur,
                            inputRightIconProps: {
                              display: true,
                              audio: {
                                display: true,
                              },
                              icon: "",
                              isRecording: isMRecording,
                              onRecordValueChange: (rec) => {
                                const fromData = new FormData();
                                fromData.append("audio_sample", rec);
                                getText(fromData, (res) => {
                                  if (res?.data?.content) {
                                    setFieldValue(
                                      "address",
                                      res?.data?.content
                                    );
                                  }
                                });
                              },
                              onRecordingStateChange:
                                handleRecordingStateChange,
                            },
                          }}
                        />
                        <ValidationError
                          errorBlock={
                            errors.address && touched.address && errors.address
                          }
                        />
                        <Input
                          inputProps={{
                            inputParentClassName: `w-full custom_input ${
                              errors.address2 && touched.address2 && "p-invalid"
                            }`,
                            labelProps: {
                              spanText: "*",
                              inputLabelClassName: "block font-bold",
                              inputLabelSpanClassName: "p-error",
                              labelMainClassName: "pb-2",
                            },
                            inputClassName: "w-full",
                            id: "address2",
                            name: "address2",
                            value: values.address2,
                            disabled:
                              values?.family_register_from == "0" ||
                              isMRecording || values.addressAsRep
                                ? true
                                : false,
                            placeholder: translate(
                              localeJson,
                              "house_name_number"
                            ),
                            onChange: (evt)=>{
                              setFieldValue("address2",evt.target.value)
                              setAddressCount(addressCount+1)
                            },
                            onBlur: handleBlur,
                            inputRightIconProps: {
                              display: true,
                              audio: {
                                display: true,
                              },
                              icon: "",
                              isRecording: isMRecording,
                              onRecordValueChange: (rec) => {
                                const fromData = new FormData();
                                fromData.append("audio_sample", rec);
                                getText(fromData, (res) => {
                                  if (res?.data?.content) {
                                    setFieldValue(
                                      "address2",
                                      res?.data?.content
                                    );
                                  }
                                });
                              },
                              onRecordingStateChange:
                                handleRecordingStateChange,
                            },
                          }}
                        />
                        <ValidationError
                          errorBlock={
                            errors.address2 &&
                            touched.address2 &&
                            errors.address2
                          }
                        />
                      </div>
                      <div className="mb-2 col-12">
                        <div className="outer-label pb-1 w-12">
                          <label>{translate(localeJson, "c_dob")}</label>
                          <span className="p-error">*</span>
                        </div>
                        <div className="grid">
                          <div className="flex col-12 pb-0 pt-0">
                            <div className="pl-0 col-6 sm:col-6 md:col-6 lg:col-6 xl:col-6  pb-0 pr-0 pl-1">
                              <div className="flex align-items-baseline">
                                <Input
                                  inputProps={{
                                    inputParentClassName: `w-12 pr-2`,
                                    labelProps: {
                                      text: "",
                                      inputLabelClassName: "block font-bold",
                                      spanText: "*",
                                      inputLabelSpanClassName: "p-error",
                                      labelMainClassName: "pb-1 pt-1",
                                      parentStyle: { lineHeight: "18px" },
                                    },
                                    inputClassName: "w-full",
                                    id: "dob.year",
                                    name: "dob.year",
                                    inputMode: "numeric",
                                    value: values.dob.year,
                                    type:"text",
                                    disabled:
                                      values?.family_register_from == "0"
                                        ? true
                                        : false,
                                    onChange: (evt) => {
                                      setDobCounter(dobCounter + 1);
                                      const re = /^[0-9-]+$/;
                                      if (evt.target.value == "") {
                                        setFieldValue("dob.year", evt.target.value);
                                        setFieldValue("dob.month", "");
                                        setFieldValue("dob.date", "");
                                        setFieldValue("age", "");
                                        setFieldValue("age_m", "");
                                        return;
                                      }
                                      const enteredYear = parseInt(convertToSingleByte(evt.target.value));
                                      const currentYear =
                                        new Date().getFullYear();
                                      if (evt.target.value.length <= 3 && re.test(convertToSingleByte(evt.target.value))) {
                                        setFieldValue(
                                          "dob.year",evt.target.value
                                        );
                                      }
                                      let minYear = 1899;
                                      if (evt.target.value?.length <= 4 && re.test(convertToSingleByte(evt.target.value))) {
                                        if (
                                          evt.target.value.length == 4 &&
                                          enteredYear > minYear&&
                                          enteredYear <= currentYear
                                        ) {
                                          setFieldValue("dob.year",evt.target.value);
                                        }
                                      }
                                    },

                                    onBlur: handleBlur,
                                  }}
                                />
                                <div className="outer-label">
                                  <label className="">
                                    {translate(localeJson, "c_year")}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="pl-0 col-3 sm:col-3 md:col-3 lg:col-3 xl:col-3 pb-0 pr-0 pl-1">
                              <div className="flex align-items-baseline">
                                <Input
                                  inputProps={{
                                    inputParentClassName: `w-12 pr-1`,
                                    labelProps: {
                                      text: "",
                                      inputLabelClassName: "block font-bold",
                                      spanText: "*",
                                      inputLabelSpanClassName: "p-error",
                                      labelMainClassName: "pb-1 pt-1",
                                      parentStyle: { lineHeight: "18px" },
                                    },
                                    inputClassName: "w-full",
                                    id: "dob.month",
                                    name: "dob.month",
                                    inputMode: "numeric",
                                    value: values.dob.month,
                                    disabled:
                                      values?.family_register_from == "0"
                                        ? true
                                        : false,
                                    onChange: (evt) => {
                                      const re = /^[0-9-]+$/;
                                      setDobCounter(dobCounter + 1);
                                      if (evt.target.value == "") {
                                        setFieldValue(
                                          "dob.month",
                                          evt.target.value
                                        );
                                        setFieldValue("dob.date", "");
                                        setFieldValue("age", "");
                                        setFieldValue("age_m", "");
                                        return;
                                      }
                                      let Month = (
                                       convertToSingleByte(evt.target.value)
                                      );
                                      const enteredMonth = parseInt(Month)
                                      const currentMonth =
                                        new Date().getMonth() + 1; // Month is zero-based, so add 1
                                      const currentYear =
                                        new Date().getFullYear();
                                      if (
                                        re.test(Month) &&
                                        evt.target.value?.length <= 2 &&
                                        enteredMonth > 0 &&
                                        enteredMonth <= 12 &&
                                        convertToSingleByte(values.dob.year)
                                      ) {
                                        if (
                                          enteredMonth > currentMonth &&
                                          convertToSingleByte(values.dob.year) == currentYear
                                        ) {
                                          return;
                                        }
                                        setFieldValue(
                                          "dob.month",
                                          evt.target.value
                                        );
                                      }
                                    },
                                    onBlur: handleBlur,
                                  }}
                                />
                                <div className="outer-label">
                                  <label className="font-bold">
                                    {translate(localeJson, "c_month")}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="pl-0 col-3 sm:col-3 md:col-3 lg:col-3 xl:col-3 pb-0 pr-0 pl-1">
                              <div className="flex align-items-baseline">
                                <Input
                                  inputProps={{
                                    inputParentClassName: `w-12 pr-2`,
                                    labelProps: {
                                      text: "",
                                      inputLabelClassName: "block font-bold",
                                      spanText: "*",
                                      inputLabelSpanClassName: "p-error",
                                      labelMainClassName: "pb-1 pt-1",
                                      parentStyle: { lineHeight: "18px" },
                                    },
                                    inputClassName: "w-full",
                                    id: "dob.date",
                                    name: "dob.date",
                                    inputMode: "numeric",
                                    value: values.dob.date,
                                    disabled:
                                      values?.family_register_from == "0"
                                        ? true
                                        : false,
                                    onChange: (evt) => {
                                      setDobCounter(dobCounter + 1);
                                      const { value, name } = evt.target;
                                      const month = convertToSingleByte(values.dob.month);
                                      const year = convertToSingleByte(values.dob.year);
                                      const re = /^[0-9-]+$/;
                                      let maxDays = 31; // Default to 31 days
                                      if (value == "") {
                                        setFieldValue("dob.date", "");
                                        return
                                      }
                                      const currentYear =
                                        new Date().getFullYear();
                                      const currentMonth =
                                        new Date().getMonth() + 1;
                                      const currentDay = new Date().getDate();
                                      const enteredDay = parseInt(
                                        convertToSingleByte(evt.target.value)
                                      );
                                      if (
                                        name === "dob.date" &&
                                        value?.length <= 2 &&
                                        parseInt(convertToSingleByte(value)) > 0 &&
                                        year &&
                                        month &&
                                        re.test(convertToSingleByte(evt.target.value))
                                      ) {
                                        if (
                                          year == currentYear &&
                                          month == currentMonth &&
                                          enteredDay > currentDay
                                        ) {
                                          return;
                                        }
                                        if (month == 2) {
                                          // February
                                          maxDays =
                                            year % 4 === 0 &&
                                            (year % 100 !== 0 ||
                                              year % 400 === 0)
                                              ? 29
                                              : 28;
                                        } else if (
                                          [4, 6, 9, 11].includes(month)
                                        ) {
                                          // Months with 30 days
                                          maxDays = 30;
                                        }
                                        // Update the state only if the entered day is valid
                                        if (parseInt(convertToSingleByte(value)) <= maxDays) {
                                          setFieldValue(
                                            "dob.date",
                                            evt.target.value
                                          );
                                        }
                                      }
                                    },

                                    onBlur: handleBlur,
                                  }}
                                />
                                <div className="outer-label">
                                  <label className="font-bold pb-2 ">
                                    {translate(localeJson, "c_date")}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 p-0  flex">
                          <ValidationError
                            errorBlock={
                              errors.dob?.year &&
                              touched.dob?.year &&
                              errors.dob?.year
                            }
                            parentClass="pr-1"
                          />
                          <ValidationError
                            errorBlock={
                              errors.dob?.month &&
                              touched.dob?.month &&
                              errors.dob?.month
                            }
                            parentClass="pr-1"
                          />
                          <ValidationError
                            errorBlock={
                              errors.dob?.date &&
                              touched.dob?.date &&
                              errors.dob?.date
                            }
                            parentClass="pr-1"
                          />
                        </div>
                      </div>
                      <div className="mb-2 col-12 ">
                        <InputNumber
                          inputNumberProps={{
                            inputNumberParentClassName: `${
                              errors.age && touched.age && "p-invalid pb-0"
                            }`,
                            labelProps: {
                              text: translate(localeJson, "c_age_y"),
                              inputNumberLabelClassName: "block font-bold",
                              spanText: "*",
                              inputNumberLabelSpanClassName: "p-error",
                              labelMainClassName: "pb-1",
                            },
                            inputNumberClassName: "w-full w-full",
                            id: "age",
                            name: "age",
                            value: values.age,
                            disabled: true,
                            onChange: (evt) => {
                              setFieldValue("age", evt.value);
                            },
                            onValueChange: (evt) => {
                              setFieldValue("age", evt.value);
                            },
                            onBlur: handleBlur,
                          }}
                        />
                        <ValidationError
                          errorBlock={errors.age && touched.age && errors.age}
                        />
                      </div>
                      <div className="mb-2 col-12 ">
                        <InputNumber
                          inputNumberProps={{
                            inputNumberParentClassName: `${
                              errors.age && touched.age && "p-invalid pb-0"
                            }`,
                            labelProps: {
                              text: translate(localeJson, "c_age_m"),
                              inputNumberLabelClassName: "block font-bold",
                              spanText: "*",
                              inputNumberLabelSpanClassName: "p-error",
                              labelMainClassName: "pb-1",
                            },
                            inputNumberClassName: "w-full w-full",
                            id: "age_m",
                            name: "age_m",
                            value: values.age_m,
                            disabled: true,
                            onChange: (evt) => {
                              setFieldValue("age_m", evt.value);
                            },
                            onValueChange: (evt) => {
                              setFieldValue("age_m", evt.value);
                            },
                            onBlur: handleBlur,
                          }}
                        />
                        <ValidationError
                          errorBlock={
                            errors.age_m && touched.age_m && errors.age_m
                          }
                        />
                      </div>
                      <div className="mb-2 col-12">
                        <div className="outer-label w-12 pb-1">
                          <label>{translate(localeJson, "c_gender")}</label>
                          <span className="p-error">*</span>
                        </div>
                        <div className="gender-view mt-0">
                          <SelectButton
                            options={genderOptions}
                            value={values?.gender}
                            optionLabel="name"
                            disabled={
                              values?.family_register_from == "0" ? true : false
                            }
                            onChange={(e) => setFieldValue("gender", e.value)}
                          />
                        </div>
                        <ValidationError
                          errorBlock={
                            errors.gender && touched.gender && errors.gender
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog>
            </form>
          </div>
        )}
      </Formik>
    </>
  );
}