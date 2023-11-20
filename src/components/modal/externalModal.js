import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { gender_en, gender_jp } from "@/utils/constant";
import Button from "../button/button";
import {
  getValueByKeyRecursively as translate,
  getEnglishDateDisplayFormat,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel, InputIcon, InputNumberFloatLabel } from "../input";
import { SelectFloatLabel } from "../dropdown";
import { DateCalendarFloatLabel } from "@/components/date&time";

export default function External(props) {
  const router = useRouter();
  const { localeJson,locale } = useContext(LayoutContext);
  // eslint-disable-next-line no-irregular-whitespace
  const katakanaRegex = /^[\u30A1-\u30F6ー　]*$/;
  const currentDate = new Date();
  const minDOBDate = new Date();
  minDOBDate.setFullYear(minDOBDate.getFullYear() - 120); // Set the maximum allowed birth date to 120 years ago
  const schema = Yup.object().shape({
    name: Yup.string()
      .required(translate(localeJson, "name_required"))
      .max(200, translate(localeJson, "name_max"))
      .matches(katakanaRegex, translate(localeJson, "name_katakana")),
    dob: Yup.date().nullable().required(translate(localeJson, "dob_required"))
      .min(minDOBDate, translate(localeJson, "min_dob"))
      .max(currentDate, translate(localeJson, "max_dob")),
    // Add other fields and validations as needed
    age: Yup.number().required(translate(localeJson, "age_required")).max(
      120,
      translate(localeJson, "age_max")
    ),
    gender: Yup.string().required(translate(localeJson, "gender_required"))
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
  } = props && props;

  const initialValues =
    registerModalAction == "edit"
      ? editObj
      : {
        id: evacuee && evacuee.length > 0 ? evacuee.length + 1 : 1,
        name: "",
        dob: "",
        age: "",
        gender: null,
      };
  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          values.dob = getEnglishDateDisplayFormat(values.dob);
          setEvacueeValues(values);
          close();
          actions.resetForm({ values: initialValues });
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
          <div>
            <form onSubmit={handleSubmit}>
              <Dialog
                className="custom-modal"
                header={header}
                visible={open}
                draggable={false}
                blockScroll={true}
                onHide={() => {
                  close();
                  resetForm();
                }}
                footer={
                  <div className="text-center">
                    <Button
                      buttonProps={{
                        buttonClass: "text-600 w-8rem",
                        bg: "bg-white",
                        hoverBg: "hover:surface-500 hover:text-white",
                        text: translate(localeJson, "cancel"),
                        type: "reset",
                        onClick: () => {
                          close();
                          resetForm();
                        },
                      }}
                      parentClass={"inline"}
                    />
                    <Button
                      buttonProps={{
                        buttonClass: "w-8rem",
                        type: "submit",
                        text: buttonText,
                        severity: "primary",
                        onClick: () => {
                          handleSubmit();
                        },
                      }}
                      parentClass={"inline"}
                    />
                  </div>
                }
              >
                <div className={`modal-content`}>
                  <div className="mt-5 mb-5">
                    <div className="mb-5">
                      <InputFloatLabel
                        inputFloatLabelProps={{
                          name: "name",
                          spanText: "*",
                          spanClass: "p-error",
                          value: values.name,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          text: translate(localeJson, "c_name_furigana"),
                          inputClass:
                            "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                        }}
                        parentClass={`custom_input ${errors.name && touched.name && "p-invalid pb-1"
                          }`}
                      />
                      <ValidationError
                        errorBlock={errors.name && touched.name && errors.name}
                      />
                    </div>
                    <div className="mt-5 ">
                      <DateCalendarFloatLabel
                        date={values.dob}
                        dateFloatLabelProps={{
                          name: "dob",
                          dateClass: "w-full",
                          spanText: "*",
                          spanClass: "p-error",
                          date: values.dob,
                          onBlur: handleBlur,
                          onChange: (evt) => {
                            if (evt.target.value) {
                              const birthDate = new Date(evt.target.value);
                              const currentDate = new Date();
                              const age =
                                currentDate.getFullYear() -
                                birthDate.getFullYear();
                              setFieldValue("age", age);
                              setFieldValue("dob", evt.target.value || "");
                            }
                          },
                          placeholder: "yyyy-mm-dd",
                          text: translate(localeJson, "dob"), // Add a label text specific to date
                        }}
                        parentClass={`custom_input ${errors.dob && touched.dob && "p-invalid pb-1"
                          }`}
                      />
                      {errors.dob && (
                        <ValidationError
                          errorBlock={errors.dob && touched.dob && errors.dob}
                        />
                      )}

                    </div>
                    <div className="mt-5 ">
                      <InputNumberFloatLabel
                        inputNumberFloatProps={{
                          id: "age",
                          name: "age",
                          value: values.age,
                          spanText: "*",
                          spanClass: "p-error",
                          disabled: true,
                          onChange: (evt) => {
                            setFieldValue("age", evt.value);
                          },
                          onValueChange: (evt) => {
                            setFieldValue("age", evt.value);
                          },
                          onBlur: handleBlur,
                          text: translate(localeJson, "c_age"),
                          inputNumberClass:
                            "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                        }}
                        parentClass={`custom_input ${errors.age && touched.age && "p-invalid pb-1"
                          }`}
                      />
                      <ValidationError
                        errorBlock={errors.age && touched.age && errors.age}
                      />
                    </div>
                    <div className="mt-5 ">
                      <SelectFloatLabel
                        selectFloatLabelProps={{
                          name: "gender",
                          value: values.gender,
                          spanText: "*",
                          spanClass: "p-error",
                          options: locale == "ja" ? gender_jp : gender_en,
                          optionLabel: "name",
                          selectClass:
                            "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                          onChange: handleChange,
                          onBlur: handleBlur,
                          text: translate(localeJson, "c_gender"),
                        }}
                        parentClass={`custom_input ${errors.gender && touched.gender && "p-invalid pb-1"
                          }`}
                      />
                      <ValidationError
                        errorBlock={
                          errors.gender && touched.gender && errors.gender
                        }
                      />
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
