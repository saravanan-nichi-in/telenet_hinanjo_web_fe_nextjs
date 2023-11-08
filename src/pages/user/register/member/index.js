import React, { useEffect, useContext, useState, useRef } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import {
  Button,
  InputSwitch,
  InputFloatLabel,
  InputNumberFloatLabel,
  ValidationError,
} from "@/components";
import Link from "next/link";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { BsFillMicFill } from "react-icons/bs";
import AudioRecorder from "@/components/audio";
import { CommonServices,CheckInOutServices } from "@/services";

export default function Admission() {
  const { localeJson, setLoader } = useContext(LayoutContext);
  const [audioPasswordLoader, setAudioPasswordLoader] = useState(false);
  const [audioNameLoader, setAudioNameLoader] = useState(false);
  const [audioFamilyCodeLoader, setAudioFamilyCodeLoader] = useState(false);
  const formikRef = useRef();
  const [data, setData] = useState("");
  const schema = Yup.object().shape({
    name: Yup.string().test({
      test: function (value) {
        const { familyCode } = this.parent;
        return Boolean(familyCode) || Boolean(value);
      },
      message: "name is required",
    }),
    password: Yup.number()
      .required("Password is required")
      .min(0, "Password is too short")
      .max(9999, "Password is too long")
      .test("is-four-digits", "Password must be four digits", (value) => {
        return value >= 0 && value <= 9999 && String(value).length === 4;
      })
      .integer("Password must be an integer"),
    familyCode: Yup.string().test({
      test: function (value) {
        const { name } = this.parent;
        return Boolean(name) || Boolean(value);
      },
      message: 'familyCode" is required',
    }),
  });

  const { getText } = CommonServices;
  const {getList} = CheckInOutServices
  const initialValues = { name: "", password: "", familyCode: "" };

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
      let val = familyCode.replace(/-/g,""); // Remove any existing hyphens
      console.log(val)
      // Insert hyphen after the first three characters
      if (val.length > 3) {
        val =
          val.slice(0, 3) +
          "-" +
          val.slice(3);
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

  const getSearchResult = (res) => {
    console.log(res)
  }

  return (
    <>
      <Formik
        innerRef={formikRef}
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          console.log(values);
          let payload = {
            "family_code" : "001-001",
            "refugee_name" : "",
            "password" : "1234"
        }
          getList(payload,getSearchResult)
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
                  <h5 className="page-header1">
                    {translate(localeJson, "new_to_admission_procedures")}
                  </h5>
                  <hr />
                  <div>
                    <div className="mt-3">
                      <div
                        className="flex"
                        style={{ justifyContent: "flex-end", flexWrap: "wrap" }}
                      >
                        <Button
                          buttonProps={{
                            type: "submit",
                            rounded: "true",
                            buttonClass: "text-600 ",
                            text: translate(localeJson, "exit_procedure"),
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                          }}
                          parentClass={"ml-3 mr-3 mt-1"}
                        />
                      </div>
                    </div>
                    <div className="grid">
                      <div className="mt-3 col-12 lg:col-6">
                      
                        <form
                          onSubmit={handleSubmit}
                          className="custom-card m-2 shadow-4"
                        >
                            <div> {translate(localeJson, "shelter_search")}</div>
                          <div className="mt-5">
                            <div className="mb-5  w-12">
                              <div className="flex align-items-center w-12">
                                <div className="w-11">
                                <InputFloatLabel
                                  inputFloatLabelProps={{
                                    id: "name",
                                    name: "name",
                                    spanText: "",
                                    spanClass: "",
                                    value: values.name,
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    custom: "w-full custom_input",
                                    isLoading: audioNameLoader,
                                    disabled:audioNameLoader,
                                    hasIcon:true,
                                    text: translate(
                                      localeJson,
                                      "shelter_name"
                                    ),
                                    inputClass: "w-full",
                                  }}
                                  parentClass={`custom_input ${
                                    errors.name &&
                                    touched.name &&
                                    "p-invalid pb-1"
                                  }`}
                                />
                                </div>
                                
                              <div className="w-1 flex justify-content-center">
                                <AudioRecorder
                                  onAudioRecorded={handleNameAudioRecorded}
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
                                    disabled:audioPasswordLoader,
                                    hasIcon:true,
                                    onChange: (evt) => {
                                      setFieldValue("password", evt.value);
                                    },
                                    onValueChange: (evt) => {
                                      setFieldValue("password", evt.value);
                                    },
                                    onBlur: handleBlur,
                                    text: translate(localeJson, "shelter_password"),
                                    inputNumberClass: "w-full",
                                  }}
                                  parentClass={`custom_input ${
                                    errors.password &&
                                    touched.password &&
                                    "p-invalid pb-1"
                                  }`}
                                />
                                </div>
                                <div className="w-1 flex justify-content-center">
                                 <AudioRecorder
                                  onAudioRecorded={handleAudioRecorded}
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
                                    disabled:audioFamilyCodeLoader,
                                    hasIcon:true,
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
                                    text: translate(localeJson, "shelter_code"),
                                    inputClass: "w-full",
                                  }}
                                  parentClass={`custom_input ${
                                    errors.familyCode &&
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
                        style={{ justifyContent: "flex-end", flexWrap: "wrap" }}
                      >
                        <Button
                          buttonProps={{
                            type: "submit",
                            rounded: "true",
                            buttonClass: "text-600 ",
                            text: translate(localeJson, "mem_search"),
                            bg: "bg-white",
                            hoverBg: "hover:surface-500 hover:text-white",
                          }}
                          parentClass={"ml-3 mr-3 mt-1"}
                        />
                      </div>
                    </div>
                        </form>
                      </div>
                      <div className="mt-3 col-12 lg:col-6">
                        <div className="custom-card m-2 shadow-4">
                          <div
                            className="col-12 lg:col-6 flex align-items-center justify-content-start"
                            style={{
                              justifyContent: "flex-end",
                              flexWrap: "wrap",
                            }}
                          >
                            {translate(localeJson, "check_in_first")}
                          </div>
                          <div
                            className="flex col-12 lg:col-6"
                            style={{
                              justifyContent: "flex-end",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              buttonProps={{
                                type: "submit",
                                rounded: "true",
                                buttonClass: "text-600 ",
                                text: translate(localeJson, "signup"),
                                bg: "bg-white",
                                hoverBg: "hover:surface-500 hover:text-white",
                              }}
                              parentClass={"ml-3 mr-3 mt-1"}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 col-12">
                        <div className="custom-card">
                        <ul className="custom-list">
                  
                    <li>
                      <div className="label">TEST</div>
                      <div className="value">111111111</div>
                    </li>
                </ul>
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
