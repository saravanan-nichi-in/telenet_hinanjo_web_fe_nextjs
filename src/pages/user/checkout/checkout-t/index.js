import React, { useEffect, useContext, useState, useRef } from "react";
import _ from 'lodash';
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik } from "formik";

import { getEnglishDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  ButtonRounded,
  InputFloatLabel,
  InputNumberFloatLabel,
  ValidationError,
  NormalTable, 
  RowExpansionTable, 
  AudioRecorder, 
  CustomHeader,
  QrScannerModal,
  BarcodeDialog
} from "@/components";
import { CommonServices, CheckInOutServices } from "@/services";
import { prefectures } from '@/utils/constant';

export default function Admission() {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const router = useRouter();

  const [audioPasswordLoader, setAudioPasswordLoader] = useState(false);
  const [audioNameLoader, setAudioNameLoader] = useState(false);
  const [audioFamilyCodeLoader, setAudioFamilyCodeLoader] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [familyCode, setFamilyCode] = useState(null);
  const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
  const [familyDetailData, setfamilyDetailData] = useState(null);
  const [neighbourData, setNeighbourData] = useState(null);
  const [townAssociationColumn, setTownAssociationColumn] = useState([]);
  const [evacueePersonInnerColumns, setEvacueePersonInnerColumns] = useState([]);
  const [openBarcodeDialog, setOpenBarcodeDialog] = useState(false);
  const [openBarcodeConfirmDialog, setOpenBarcodeConfirmDialog] = useState(false);
  const [openQrPopup, setOpenQrPopup] = useState(false);
  const formikRef = useRef();

  const schema = Yup.object().shape({
    name: Yup.string().max(100, translate(localeJson, "family_name_max")).test({
      test: function (value) {
        const { familyCode } = this.parent;
        return Boolean(familyCode) || Boolean(value);
      },
      message: translate(localeJson, "family_name_required"),
    }),
    password: Yup.number()
      .required(translate(localeJson, "family_password_required"))
      .test("is-four-digits", translate(localeJson, "family_password_min_max"), (value) => {
        return value >= 0 && value <= 9999 && String(value).length === 4;
      }),
    familyCode: Yup.string().test({
      test: function (value) {
        const { name } = this.parent;
        return Boolean(name) || Boolean(value);
      },
      message: translate(localeJson, "family_code_required"),
    }),
  });

  
  const evacueeFamilyDetailColumns = [
    { field: "id", header: translate(localeJson, 'c_s_no'), minWidth: "5rem", className: "sno_class" },
    { field: "is_owner", header: translate(localeJson, 'c_representative'), minWidth: "10rem" },
    { field: "refugee_name", header: translate(localeJson, 'c_refugee_name'), minWidth: "10rem" },
    { field: "name", header: translate(localeJson, 'name_kanji'), minWidth: "10rem" },
    { field: "dob", header: translate(localeJson, 'c_dob'), minWidth: "10rem" },
    { field: "age", header: translate(localeJson, 'c_age'), minWidth: "4rem" },
    { field: "age_month", header: translate(localeJson, 'c_age_month'), minWidth: "5rem" },
    { field: "gender", header: translate(localeJson, 'c_gender'), minWidth: "8rem" },
    { field: "created_date", header: translate(localeJson, 'c_created_date'), minWidth: "10rem" },
  ];

  const familyDetailColumns = [
    { field: 'evacuation_date_time', header: translate(localeJson, 'c_evacuation_date_time'), minWidth: "10rem", textAlign: 'left' },
    { field: 'address', header: translate(localeJson, 'c_address'), minWidth: "10rem", textAlign: 'left' },
    { field: 'representative_number', header: translate(localeJson, 'c_representative_number'), minWidth: "10rem", textAlign: 'left' },
    { field: 'registered_lang_environment', header: translate(localeJson, 'c_registered_lang_environment'), minWidth: "10rem", textAlign: 'left' },
  ];

  const evacueeFamilyDetailRowExpansionColumns = [
    { field: "address", header: translate(localeJson, 'c_address'), minWidth: "10rem" },
    { field: "special_care_name", header: translate(localeJson, 'c_special_care_name'), minWidth: "8rem" },
    { field: "connecting_code", header: translate(localeJson, 'c_connecting_code'), minWidth: "7rem" },
    { field: "remarks", header: translate(localeJson, 'c_remarks'), minWidth: "7rem" },
  ];

  const initialValues = { name: "", password: "", familyCode: "" };

  const { getText } = CommonServices;
  const { getList, checkOut } = CheckInOutServices;

  useEffect(() => {
    const fetchData = async () => {
      setLoader(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    scrollToCenter()
  }, [searchFlag])

  const getGenderValue = (gender) => {
    if (gender == 1) {
      return translate(localeJson, 'c_male');
    } else if (gender == 2) {
      return translate(localeJson, 'c_female');
    } else {
      return translate(localeJson, 'c_others_count');
    }
  }

  const getRegisteredLanguage = (language) => {
    if (language == "en") {
      return translate(localeJson, 'english');
    }
    else {
      return translate(localeJson, 'japanese');
    }
  }

  const getSpecialCareName = (nameList) => {
    let specialCareName = null;
    nameList.map((item) => {
      specialCareName = specialCareName ? (specialCareName + ", " + item) : item;
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

  const getPrefectureName = (id) => {
    if (id) {
      let p_name = prefectures.find((item) => item.value === id);
      return p_name.name;
    }
    return "";
  }


  const fetchText = (res) => {
    let newPassword = res?.data?.content;
    newPassword = parseInt(newPassword);
    if (newPassword) {
      formikRef.current.setFieldValue("password", newPassword);
    }
    setAudioPasswordLoader(false);
  };
  const fetchName = (res) => {
    let name = res?.data?.content;
    if (name) {
      formikRef.current.setFieldValue("name", name);
    }
    setAudioNameLoader(false);
  };
  const fetchFamilyCode = (res) => {
    let familyCode = res?.data?.content;
    const re = /^[0-9-]+$/;
    if (familyCode && re.test(familyCode)) {
      let val = familyCode.replace(/-/g, ""); // Remove any existing hyphens
      // Insert hyphen after the first three characters
      if (val.length > 3) {
        val = val.slice(0, 3) + "-" + val.slice(3);
      }
      formikRef.current.setFieldValue("familyCode", val);
    }
    setAudioFamilyCodeLoader(false);
  };
  const handleAudioRecorded = async (audioBlob) => {
    const fromData = new FormData();
    fromData.append("audio_sample", audioBlob);
    getText(fromData, fetchText);
  };

  const handleFamilyCodeRecordingStateChange = (isRecording) => {
    if (isRecording) {
      // Start loader
      setAudioFamilyCodeLoader(true);
    }
  };
  const handleFamilyCodeAudioRecorded = async (audioBlob) => {
    const fromData = new FormData();
    fromData.append("audio_sample", audioBlob);
    getText(fromData, fetchFamilyCode);
  };

  const handleRecordingStateChange = (isRecording) => {
    if (isRecording) {
      // Start loader
      setAudioPasswordLoader(true);
    }
  };
  const handleNameAudioRecorded = async (audioBlob) => {
    const fromData = new FormData();
    fromData.append("audio_sample", audioBlob);
    getText(fromData, fetchName);
  };

  const handleNameRecordingStateChange = (isRecording) => {
    if (isRecording) {
      // Start loader
      setAudioNameLoader(true);
    }
  };

  const scrollToCenter = () => {
    if (searchFlag) {
      const windowHeight = window.innerHeight;
      const scrollPosition = (windowHeight * 1.7) / 2;

      // Scroll to the center of the page
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth', // You can change this to 'auto' for instant scrolling
      });
    }
  };

  const getSearchResult = (res) => {
    if (res?.success && !_.isEmpty(res?.data)) {
      const data = res.data.model;
      let basicDetailList = [];
      let basicData = {
        evacuation_date_time: data.join_date,
        address: translate(localeJson, 'post_letter') + data.zip_code + " " + getPrefectureName(data.prefecture_id) + " " + data.address,
        representative_number: data.tel,
        registered_lang_environment: getRegisteredLanguage(data.language_register)
      };
      basicDetailList.push(basicData);
      setBasicFamilyDetail(basicDetailList);
      setFamilyCode(data.family_code);
      const personList = data.person;
      const familyDataList = [];
      let personInnerColumns = [...evacueeFamilyDetailRowExpansionColumns];
      let individualQuestion = personList[0].individualQuestions;
      if (individualQuestion.length > 0) {
        individualQuestion.map((ques, index) => {
          let column = {
            field: "question_" + index,
            header: (locale == "ja" ? ques.title : ques.title_en),
            minWidth: "10rem",
            required: ques.isRequired == 1 ? true : false
          };
          personInnerColumns.push(column);
        });
      }
      setEvacueePersonInnerColumns(personInnerColumns);

      personList.map((person, index) => {
        let familyData = {
          id: index + 1,
          is_owner: person.is_owner == 0 ? translate(localeJson, 'c_representative') : "",
          refugee_name: person.refugee_name,
          name: person.name,
          dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.dob) : getEnglishDateDisplayFormat(person.dob),
          age: person.age,
          age_month: person.month,
          gender: getGenderValue(person.gender),
          created_date: person.createdDate,
          updated_date: data.updated_at,
          orders: [{
            address: person.address ? person.address : "",
            special_care_name: person.specialCareName ? getSpecialCareName(person.specialCareName) : "",
            connecting_code: person.connecting_code,
            remarks: person.note,
          },
          ]
        };

        let question = person.individualQuestions;
        if (question.length > 0) {
          question.map((ques, index) => {
            familyData.orders[0][`question_${index}`] = ques.answer ? getAnswerData(ques.answer.answer) : "";
          })
        }
        familyDataList.push(familyData);
      })
      setfamilyDetailData(familyDataList);


      let neighbourDataList = [];

      const questionnaire = data.question;
      let townAssociateColumnSet = [];
      questionnaire.map((ques, index) => {
        let column = {
          field: "question_" + index,
          header: (locale == "ja" ? ques.title : ques.title_en),
          minWidth: "10rem",
          required: ques.isRequired == 1 ? true : false
        };
        townAssociateColumnSet.push(column);
      });
      setTownAssociationColumn(townAssociateColumnSet);

      let neighbourData = {};
      questionnaire.map((ques, index) => {
        neighbourData[`question_${index}`] = ques.answer ? getAnswerData(ques.answer.answer) : "";
      });
      neighbourDataList.push(neighbourData);
      setNeighbourData(neighbourDataList);
      setSearchFlag(true)
      setTableLoading(false)
      setLoader(false)
      scrollToCenter();
    }
    else {
      setSearchFlag(false)
      setTableLoading(false);
      setLoader(false)

    }
  };

  const isCheckedOut = (res) => {
    setLoader(false)
  }

  const closeQrPopup = () => {
      setOpenQrPopup(false);
  }
  const qrResult = (result) => {
      alert(result);
  }

  return (
    <>
      <Formik
        innerRef={formikRef}
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          let payload = {
            family_code: values.familyCode,
            refugee_name: values.name,
            password: values.password,
          };
          setLoader(true)
          getList(payload, getSearchResult);
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
            <QrScannerModal
        open={openQrPopup}
        close={closeQrPopup}
        callback={qrResult}>

        </QrScannerModal>
        <BarcodeDialog header={translate(localeJson, "barcode_dialog_heading")} visible={openBarcodeDialog} setVisible={setOpenBarcodeDialog}></BarcodeDialog>
            <div className="grid">
              <div className="col-12">
                <div className="card">
                  <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "c_checkout_title")} />
                  <hr />
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
                        />
                      </div>
                    </div>
                    <div className="grid">
                      <div className="md:flex col-12 h-full">
                      <div className=' mt-3 col-12 lg:col-5 md:col-5' >
                        <div className="flex flex-column align-items-center justify-content-center h-full light_gray_color border-round-lg m-2 ">
                          <ButtonRounded buttonProps={{
                            type: 'button',
                            rounded: "true",
                            buttonClass: " w-full h_custom_white_button lg:w-17rem md:w-17rem sm:w-17rem h-3rem",
                            text: translate(localeJson,"scan_my_card"),
                            bg: "bg-white",
                            onClick: () => {
                              setOpenQrPopup(true)
                            },
                          }} parentClass={"mt-5 h_custom_white_button"} />
                          <ButtonRounded buttonProps={{
                            type: 'button',
                            rounded: "true",
                            buttonClass: "w-full  h_custom_white_button lg:w-17rem md:w-17rem sm:w-17rem h-3rem",
                            text: translate(localeJson,"scan_my_yapple_card"),
                            bg: "bg-white",
                            onClick: () => {
                              setOpenBarcodeDialog(true);
                            },
                          }} parentClass={"mt-5 h_custom_white_button mb-5"} />
                          </div>
                        </div>
                        <div className=" mt-3   col-12 lg:col-2 md:col-2">
                          <div className="flex justify-content-center align-items-center text-gray h-full">
                                   {translate(localeJson,"or")}
                          </div>
                        </div>
                        <div className="mt-3 col-12 lg:col-5 md:col-5">
                          <form
                            onSubmit={handleSubmit}
                            className=" m-2"
                          >
                            {/* <div className="page-header2"> {translate(localeJson, "c_checkout_procedure")}</div> */}
                            <div className="mt-5">
                              <div className="mb-5  w-12">
                                <div className="flex align-items-center w-12">
                                  <div className="w-11">
                                    <InputFloatLabel
                                      inputFloatLabelProps={{
                                        id: "name",
                                        name: "name",
                                        spanText: "*",
                                        spanClass: "p-error",
                                        value: values.name,
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                        custom: "w-full custom_input",
                                        isLoading: audioNameLoader,
                                        disabled: audioNameLoader,
                                        hasIcon: true,
                                        text: translate(
                                          localeJson,
                                          "shelter_name"
                                        ),
                                        inputClass: "w-full",
                                      }}
                                      parentClass={`custom_input ${errors.name &&
                                        touched.name &&
                                        "p-invalid pb-1"
                                        }`}
                                    />
                                  </div>

                                  <div className="w-1 flex justify-content-center">
                                    <AudioRecorder
                                      onAudioRecorded={handleNameAudioRecorded}
                                      disabled={audioPasswordLoader || audioFamilyCodeLoader}
                                      onRecordingStateChange={
                                        handleNameRecordingStateChange
                                      }
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
                              <div className="mb-5 w-full">
                                <div className="flex align-items-center  w-12">
                                  <div className="w-11">
                                    <InputNumberFloatLabel
                                      inputNumberFloatProps={{
                                        id: "password",
                                        name: "password",
                                        spanText: "*",
                                        spanClass: "p-error",
                                        value: values.password,
                                        custom: "w-full custom_input",
                                        isLoading: audioPasswordLoader,
                                        disabled: audioPasswordLoader,
                                        hasIcon: true,
                                        onChange: (evt) => {
                                          setFieldValue("password", evt.value);
                                        },
                                        onValueChange: (evt) => {
                                          setFieldValue("password", evt.value);
                                        },
                                        onBlur: handleBlur,
                                        text: translate(
                                          localeJson,
                                          "shelter_password"
                                        ),
                                        inputNumberClass: "w-full",
                                      }}
                                      parentClass={`custom_input ${errors.password &&
                                        touched.password &&
                                        "p-invalid pb-1"
                                        }`}
                                    />
                                  </div>
                                  <div className="w-1 flex justify-content-center">
                                    <AudioRecorder
                                      onAudioRecorded={handleAudioRecorded}
                                      disabled={audioNameLoader || audioFamilyCodeLoader}
                                      onRecordingStateChange={
                                        handleRecordingStateChange
                                      }
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
                              <div className="mb-5  w-full">
                                <div className="flex align-items-center  w-12">
                                  <div className="w-11">
                                    <InputFloatLabel
                                      inputFloatLabelProps={{
                                        id: "familyCode",
                                        name: "familyCode",
                                        spanText: "*",
                                        spanClass: "p-error",
                                        value: values.familyCode,
                                        custom: "w-full custom_input",
                                        isLoading: audioFamilyCodeLoader,
                                        disabled: audioFamilyCodeLoader,
                                        hasIcon: true,
                                        onChange: (evt) => {
                                          const re = /^[0-9-]+$/;
                                          if (
                                            evt.target.value === "" ||
                                            re.test(evt.target.value)
                                          ) {
                                            let val = evt.target.value.replace(
                                              /-/g,
                                              ""
                                            ); // Remove any existing hyphens
                                            if (val.length > 3) {
                                              val =
                                                val.slice(0, 3) +
                                                "-" +
                                                val.slice(3);
                                            }
                                            setFieldValue("familyCode", val);
                                          }
                                        },
                                        onBlur: handleBlur,
                                        text: translate(
                                          localeJson,
                                          "shelter_code"
                                        ),
                                        inputClass: "w-full",
                                      }}
                                      parentClass={`custom_input ${errors.familyCode &&
                                        touched.familyCode &&
                                        "p-invalid pb-1"
                                        }`}
                                    />
                                  </div>
                                  <div className="w-1">
                                    <AudioRecorder
                                      onAudioRecorded={
                                        handleFamilyCodeAudioRecorded
                                      }
                                      disabled={audioNameLoader || audioPasswordLoader}
                                      onRecordingStateChange={
                                        handleFamilyCodeRecordingStateChange
                                      }
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
                            <div className="mt-3">
                              <div
                                className="flex"
                                style={{
                                  justifyContent: "flex-end",
                                  flexWrap: "wrap",
                                }}
                              >
                                <ButtonRounded
                                  buttonProps={{
                                    buttonClass:"w-full h-3rem",
                                    type: "submit",
                                    rounded: "true",
                                    bg:"bg-primary",
                                    text: translate(localeJson, "mem_search"),
                                  }}
                                  parentClass={"w-full"}
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                       
                      </div>
                      {searchFlag &&
                        <div className="mt-3 col-12">
                          <div className="custom-card shadow-4">
                            <div>
                              <div className='mb-2'>
                                <div className='flex page-header2'>
                                  {translate(localeJson, 'c_confirm_register')}
                                </div>
                                <hr />
                              </div>
                              <div className='mb-2'>
                                <div className='flex justify-content-end underline' style={{ fontWeight: "bold" }}>
                                  {translate(localeJson, 'household_number')} {familyCode}
                                </div>
                              </div>
                              <NormalTable
                                id="evacuee-family-detail"
                                size={"small"}
                                tableLoading={tableLoading}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                stripedRows={true}
                                paginator={false}
                                showGridlines={true}
                                value={basicFamilyDetail}
                                columns={familyDetailColumns}
                                parentClass="mb-2"
                              />
                              <div className='mb-2 '>
                                <h5 className='page-header2'>{translate(localeJson, 'household_list')}</h5>
                              </div>
                              <RowExpansionTable
                                id={"evacuation-detail-list"}
                                rows={10}
                                paginatorLeft={true}
                                tableLoading={tableLoading}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                paginator="true"
                                customRowExpansionActionsField="actions"
                                value={familyDetailData}
                                innerColumn={evacueePersonInnerColumns}
                                outerColumn={evacueeFamilyDetailColumns}
                                rowExpansionField="orders"
                              />
                              {townAssociationColumn.length > 0 &&
                                <div className='mt-2'>
                                  <NormalTable
                                    id="evacuee-family-detail"
                                    size={"small"}
                                    tableLoading={tableLoading}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    stripedRows={true}
                                    paginator={false}
                                    showGridlines={true}
                                    value={neighbourData}
                                    columns={townAssociationColumn}
                                  />
                                </div>
                              }
                            </div>
                            <div className="flex justify-content-end">
                              <Button
                                buttonProps={{
                                  buttonClass:"update-button",
                                  type: "button",
                                  rounded: "true",
                                  text: translate(localeJson, "checkout_shelter"),
                                  onClick: () => {
                                    let payload = {
                                      "family_id": familyCode
                                    }
                                    setLoader(true)
                                    checkOut(payload, isCheckedOut)
                                  }
                                }}
                                parentClass={"mt-3 update-button"}
                              />
                            </div>
                          </div>
                        </div>
                      }
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