import React, { useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel } from "../input";

export default function AdminManagementCreateModal(props) {
    const { localeJson } = useContext(LayoutContext);
    // Destructing
    const { open, close, callBackFunction } = props && props;
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .test('trim-and-validate', translate(localeJson, 'email_valid'), (value) => {
                // Trim the email and check its validity
                const trimmedEmail = value.trim();
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(trimmedEmail);
            }),
        password: Yup.string()
            .required(translate(localeJson, 'new_password_required'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/,
                translate(localeJson, 'new_password_not_matched')
            ),
        fullName: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
            .max(200, translate(localeJson, 'admin_name_max_200_characters')),
    });
    const [initialValues, setInitialValues] = useState({
        email: "",
        password: "",
        fullName: ""
    })

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => {
                    callBackFunction(values);
                    // Reset the form after submission
                    resetForm({ values: initialValues });
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
                    <div>
                        <Dialog
                            className="custom-modal"
                            header={
                                <div className="custom-modal">
                                    {translate(localeJson, 'add_admin_management')}
                                </div>
                            }
                            visible={open}
                            draggable={false}
                            onHide={() => close()}
                            footer={
                                <div className="text-center">
                                    <Button buttonProps={{
                                        type: "button",
                                        buttonClass: "text-600 w-8rem",
                                        bg: "bg-white",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => close(),
                                    }} parentClass={"inline"} />
                                    <Button buttonProps={{
                                        type: "submit",
                                        buttonClass: "w-8rem",
                                        text: translate(localeJson, 'submit'),
                                        severity: "primary",
                                        onClick: () => {
                                            handleSubmit();
                                        },
                                    }} parentClass={"inline"} />
                                </div>
                            }
                        >
                            <div className={`modal-content`}>
                                <div className="mt-4 mb-3">
                                    <div className="mb-5">
                                        <InputFloatLabel inputFloatLabelProps={{
                                            name: "fullName",
                                            spanText: "*",
                                            spanClass: "p-error",
                                            value: values.fullName,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            text: translate(localeJson, 'name'),
                                            inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                        }} parentClass={`${errors.fullName && touched.fullName && 'p-invalid pb-1'}`} />
                                        <ValidationError errorBlock={errors.fullName && touched.fullName && errors.fullName} />
                                    </div>
                                    <div className="mt-5 ">
                                        < InputFloatLabel inputFloatLabelProps={{
                                            spanText: "*",
                                            name: 'email',
                                            spanClass: "p-error",
                                            value: values.email,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            text: translate(localeJson, 'address_email'),
                                            inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                        }} parentClass={`${errors.email && touched.email && 'p-invalid pb-1'}`} />
                                        <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                    </div>
                                    <div className="mt-5">
                                        <InputFloatLabel inputFloatLabelProps={{
                                            spanText: "*",
                                            name: 'password',
                                            type: 'password',
                                            spanClass: "p-error",
                                            value: values.password,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            text: translate(localeJson, 'password'),
                                            inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                        }} parentClass={`${errors.password && touched.password && 'p-invalid pb-1'}`} />
                                        <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                )}
            </Formik>
        </>
    );
}