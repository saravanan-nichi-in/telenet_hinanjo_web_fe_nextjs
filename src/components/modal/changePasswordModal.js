import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { LockFilled } from '@ant-design/icons';

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { InputLeftRightGroupFloat } from "../input";
import { ValidationError } from "../error";
import { AuthenticationAuthorizationService } from "@/services";

export default function ChangePasswordModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, onChangePasswordSuccess } = props && props;
    const { changePassword } = AuthenticationAuthorizationService;

    const initialValues = { password: "", password_new: '', password_confirm: '' };

    const schema = Yup.object().shape({
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
        password_new: Yup.string()
            .required(translate(localeJson, 'new_password_required'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/,
                translate(localeJson, 'new_password_not_matched')
            ),
        password_confirm: Yup.string()
            .required(translate(localeJson, 'confirm_password_required'))
            .oneOf([Yup.ref("password_new"), null], translate(localeJson, 'confirm_password_notMatch'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => {
                    console.log(values);
                    changePassword('admin', values, onChangePasswordSuccess);
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
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className="custom-modal"
                                header={
                                    <div className="custom-modal">
                                        {translate(localeJson, 'change_password')}
                                    </div>
                                }
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => close()}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "text-600 w-8rem",
                                            bg: "bg-white",
                                            hoverBg: "hover:surface-500 hover:text-white",
                                            text: translate(localeJson, 'cancel'),
                                            onClick: () => close(),
                                        }} parentClass={"inline"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem",
                                            type: "submit",
                                            text: translate(localeJson, 'update'),
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="mt-5 mb-3">
                                        <div className="mb-5">
                                            <InputLeftRightGroupFloat inputLrGroupFloatProps={{
                                                name: 'password',
                                                type: "password",
                                                value: values.password,
                                                id: "password",
                                                text: translate(localeJson, 'current_password'),
                                                spanClass: "p-error",
                                                spanText: "*",
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                required: true,
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                                                antdRightIcon: <LockFilled />,
                                            }} parentClass={`w-full ${errors.password && touched.password && 'p-invalid'}`} />
                                            <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                        </div>
                                        <div className="mt-5 ">
                                            <InputLeftRightGroupFloat inputLrGroupFloatProps={{
                                                name: 'password_new',
                                                type: "password",
                                                value: values.password_new,
                                                id: "new_password",
                                                text: translate(localeJson, 'new_password'),
                                                spanClass: "p-error",
                                                spanText: "*",
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                required: true,
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                                                antdRightIcon: <LockFilled />,
                                            }} parentClass={`w-full ${errors.password_new && touched.password_new && 'p-invalid'}`} />
                                            <ValidationError errorBlock={errors.password_new && touched.password_new && errors.password_new} />
                                        </div>
                                        <div className="mt-5 ">
                                            <InputLeftRightGroupFloat inputLrGroupFloatProps={{
                                                name: 'password_confirm',
                                                type: "password",
                                                value: values.password_confirm,
                                                id: "newConfirmation",
                                                text: translate(localeJson, 'new_password_confirmation'),
                                                spanClass: "p-error",
                                                spanText: "*",
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                required: true,
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                                                antdRightIcon: <LockFilled />,
                                            }} parentClass={`w-full ${errors.password_confirm && touched.password_confirm && 'p-invalid'}`} />
                                            <ValidationError errorBlock={errors.password_confirm && touched.password_confirm && errors.password_confirm} />
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