import React, { useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik ,useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'
import { LockFilled } from '@ant-design/icons';

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { InputLeftRightGroup, InputLeftRightGroupFloat } from "../input";
import { ValidationError } from "../error";
import { AuthenticationAuthorizationService } from "@/services";

export default function ChangePasswordModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const { open, close, register,onResetSuccess } = props && props;
    const { change } = AuthenticationAuthorizationService;

    // const [password, setPassword] = useState("");
    // const [password_new, setpassword_new] = useState("");
    // const [newConfirmation, setpassword_confirm] = useState("");
    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'change_password')}
        </div>
    );
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

    // const handleSubmit = (values) => {
    //     if(password  && password_new && newConfirmation !=""){
    //     // You can access the form values in the "values" parameter here.
    //     console.log("Form Submitted with values:", values);
    //     register({
    //         password: password,
    //         password_new:password_new,
    //         newConfirmation:newConfirmation
    //     });
    //     setPassword("");
    //     setpassword_new("");
    //     setpassword_confirm("");
    //     // Perform any other actions you need here.
    //     // Close the modal, send an API request, etc.
    //     close();
    //     }else{
    //         console.log("please submit the form:", values);
    //     }
    // };


    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ password: "", password_new: '', password_confirm: '' }}
                onSubmit={(values) => {
                    let preparedPayload = values;
                    preparedPayload['query'] = router.query;
                    console.log(router.query);
                    change('admin', preparedPayload, onResetSuccess);
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
                                header={header}
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
                                                register({
                                                    password: values.password,
                                                    password_new: values.password_new,
                                                    password_confirm: values.password_confirm
                                                });
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