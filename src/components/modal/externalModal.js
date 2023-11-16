import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel, InputIcon } from "../input";

export default function External(props) {
  const router = useRouter();
  const { localeJson } = useContext(LayoutContext);
  const schema = Yup.object().shape({
    name: Yup.string()
      .required(translate(localeJson, "questionnaire_name_is_required"))
      .max(200, translate(localeJson, "questionnaire_name_max")),
    dob: Yup.string().max(
      255,
      translate(localeJson, "questionnaire_remarks_is_max_required")
    ),
    age: Yup.string().max(
      200,
      translate(localeJson, "questionnaire_name_en_max")
    ),
    gender: Yup.string().max(
      255,
      translate(localeJson, "questionnaire_remarks_is_max_required")
    ),
  });
  const { open, close, onSpecialCareEditSuccess, header, buttonText,setEvacueeValues } =
    props && props;
  const [initialValues] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
  });
  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
            console.log(values)
        setEvacueeValues(values)
          close();
        //   actions.resetForm({ values: initialValues });
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
                        parentClass={`${
                          errors.name && touched.name && "p-invalid pb-1"
                        }`}
                      />
                      <ValidationError
                        errorBlock={errors.name && touched.name && errors.name}
                      />
                    </div>
                    <div className="mt-5 ">
                      <InputFloatLabel
                        inputFloatLabelProps={{
                          id: "dob",
                          name: "dob",
                          value: values.dob,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          text: translate(localeJson, "c_dob"),
                          inputClass:
                            "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                        }}
                        parentClass={`${
                          errors.dob && touched.dob && "p-invalid pb-1"
                        }`}
                      />
                      <ValidationError
                        errorBlock={errors.dob && touched.dob && errors.dob}
                      />
                    </div>
                    <div className="mt-5 ">
                      <InputFloatLabel
                        inputFloatLabelProps={{
                          id: "age",
                          name: "age",
                          value: values.age,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          text: translate(localeJson, "c_age"),
                          inputClass:
                            "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                        }}
                        parentClass={`${
                          errors.age && touched.age && "p-invalid pb-1"
                        }`}
                      />
                      <ValidationError
                        errorBlock={errors.age && touched.age && errors.age}
                      />
                    </div>
                    <div className="mt-5 ">
                      <InputFloatLabel
                        inputFloatLabelProps={{
                          id: "gender",
                          name: "gender",
                          value: values.gender,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          text: translate(localeJson, "c_gender"),
                          inputClass:
                            "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                        }}
                        parentClass={`${
                          errors.gender && touched.gender && "p-invalid pb-1"
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
