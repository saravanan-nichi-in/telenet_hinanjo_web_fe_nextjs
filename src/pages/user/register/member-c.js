import React, { useEffect, useContext, useState, useRef } from "react";
import _ from 'lodash';
import { getEnglishDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, getJapaneseDateTimeDisplayFormat, getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  InputSwitch,
  InputFloatLabel,
  InputNumberFloatLabel,
  ValidationError,
  NormalTable, RowExpansionTable
} from "@/components";
import Link from "next/link";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { BsFillMicFill } from "react-icons/bs";
import AudioRecorder from "@/components/audio";
import { CommonServices, CheckInOutServices } from "@/services";
import { prefectures } from '@/utils/constant';
import { useRouter } from "next/router";
import CustomHeader from "@/components/customHeader";
export default function Admission() {
  const router = useRouter();
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const [audioPasswordLoader, setAudioPasswordLoader] = useState(false);
  const [audioNameLoader, setAudioNameLoader] = useState(false);
  const [audioFamilyCodeLoader, setAudioFamilyCodeLoader] = useState(false);
  const formikRef = useRef();
  const [tableLoading, setTableLoading] = useState(false);
  const [searchFlag, setSearchFlag] = useState(false);
  const [familyCode, setFamilyCode] = useState(null);
  const [basicFamilyDetail, setBasicFamilyDetail] = useState([]);
  const [familyDetailData, setfamilyDetailData] = useState(null);
  const [neighbourData, setNeighbourData] = useState(null);
  const [townAssociationColumn, setTownAssociationColumn] = useState([]);
  const [evacueePersonInnerColumns, setEvacueePersonInnerColumns] = useState([]);
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

  const { getText } = CommonServices;
  const { getList, checkIn } = CheckInOutServices;
  const initialValues = { name: "", password: "", familyCode: "" };

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

  useEffect(() => {
    const fetchData = async () => {
      setLoader(false);
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    scrollToCenter()
  }, [searchFlag])

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
      scrollToCenter()
    }
    else {
      setSearchFlag(false)
      setTableLoading(false);
      setLoader(false)

    }
  };

  const isCheckedIn = (res) => {
    setLoader(false)
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
            <div className="grid">
              <div className="col-12">
                <div className="card">
                  <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "new_to_admission_procedures")} />
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
                            text: translate(localeJson, "exit_procedure"),
                            onClick: () => {
                              router.push({
                                pathname: '/user/checkout',
                              })
                            },
                          }}
                          parentClass={"ml-3 mr-3 mt-1 back-button"}
                        />
                      </div>
                    </div>
                    <div className="grid">
                      <div className="mt-3 col-12 lg:col-6">
                        <form
                          onSubmit={handleSubmit}
                          className="custom-card m-2 shadow-4"
                        >
                          <div className="page-header2"> {translate(localeJson, "shelter_search")}</div>
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
                              <Button
                                buttonProps={{
                                  buttonClass:"search-button",
                                  type: "submit",
                                  rounded: "true",
                                  text: translate(localeJson, "mem_search"),
                                }}
                                parentClass={"ml-3 mr-3 mt-1 search-button"}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="mt-3 col-12 lg:col-6">
                        <div className="custom-card m-2 shadow-4">
                          <div className="page-header2"> {translate(localeJson, "check_in_first")}</div>
                          <div
                            className="flex col-12 lg:col-6 mt-3"
                            style={{
                              justifyContent: "flex-end",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              buttonProps={{
                                buttonClass:"create-button",
                                type: "submit",
                                rounded: "true",
                                text: translate(localeJson, "signup"),
                              }}
                              parentClass={"ml-3 mr-3 mt-1 create-button"}
                            />
                          </div>
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
                                  type: "button",
                                  rounded: "true",
                                  buttonClass:"update-button",
                                  text: translate(localeJson, "reg_shelter"),
                                  onClick: () => {
                                    let payload = {
                                      "family_id": familyCode,
                                      "place_id": layoutReducer?.user?.place?.id
                                    }
                                    setLoader(true)
                                    checkIn(payload, isCheckedIn)
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
