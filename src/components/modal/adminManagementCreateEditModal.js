import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button } from "../button";
import { convertToSingleByte, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { AdminManagementServices } from "@/services";
import Password, { Input, InputDropdown } from "../input";
import { gender_en, gender_jp } from "@/utils/constant";

export default function AdminManagementCreateEditModal(props) {
    const { localeJson, locale } = useContext(LayoutContext);
    
    const schema1 = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'user_id_required'))
            .max(200, translate(localeJson, 'user_id_max'))
            .test('trim-and-validate', translate(localeJson, 'user_id_email'), (value) => {
                // Trim the email and check its validity
                const trimmedEmail = value.trim();
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(trimmedEmail);
            }),
        name: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
            .max(200, translate(localeJson, 'staff_name_max_required')),
        tel: Yup.string()
            .nullable()
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
            .test("matches-pattern", translate(localeJson, "phone"), (value) => {
                if (value) {
                    const singleByteValue = convertToSingleByte(value);
                    return /^[0-9]{10,11}$/.test(singleByteValue);
                }
                else {
                    return true;
                }
            }),
    });

    const schema2 = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'user_id_required'))
            .max(200, translate(localeJson, 'user_id_max'))
            .test('trim-and-validate', translate(localeJson, 'user_id_email'), (value) => {
                // Trim the email and check its validity
                const trimmedEmail = value.trim();
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(trimmedEmail);
            }),
        name: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
            .max(200, translate(localeJson, 'staff_name_max_required')),
        tel: Yup.string()
            .nullable()
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
            .test("matches-pattern", translate(localeJson, "phone"), (value) => {
                if (value) {
                    const singleByteValue = convertToSingleByte(value);
                    return /^[0-9]{10,11}$/.test(singleByteValue);
                }
                else {
                    return true;
                }
            }),
        password: Yup.string()
            .required(translate(localeJson, "new_password_required"))
            .min(8, translate(localeJson, "new_password_min_length"))
            .max(15, translate(localeJson, "new_password_max_length"))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$/,
                translate(localeJson, "new_password_format")
            ),
    });

    const { open, close } = props && props;

    const resetAndCloseForm = (callback) => {
        callback();
        props.refreshList();
    }


    return (
        <>
            <Formik
                initialValues={props.currentObj}
                validationSchema={props.registerModalAction == "create" ? schema2 : schema1}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                    if (props.registerModalAction == "create") {
                        AdminManagementServices.create(values, (result) => {
                            resetAndCloseForm(resetForm)
                        })
                    } else if (props.registerModalAction == "edit") {
                        AdminManagementServices.update(props.currentObj.id, { id: props.currentObj.id, ...values },
                            () => {
                                resetAndCloseForm(resetForm)
                            });
                    }
                    close();
                    return false;
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className={`new-custom-modal`}
                                header={props.registerModalAction == 'create' ? translate(localeJson, 'add_admin_management') : translate(localeJson, 'edit_admin_management')}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    resetForm();
                                    close();
                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem back-button",
                                            text: translate(localeJson, 'cancel'),
                                            onClick: () => {
                                                resetForm();
                                                close()
                                            },
                                        }} parentClass={"inline back-button"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem update-button",
                                            type: "submit",
                                            text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline update-button"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content staff_modal`}>
                                    <div className="">
                                        <div className="modal-header">
                                            {props.registerModalAction == 'create' ? translate(localeJson, 'add_admin_management') : translate(localeJson, 'edit_admin_management')}
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.name && touched.name && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'name'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    name: "name",
                                                    value: values && values.name,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.email && touched.email && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'external_evecuee_list_table_email_address'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    name: "email",
                                                    value: values && values.email,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                        </div>
                                        {props.registerModalAction == "create" && (
                                            <div className="modal-field-bottom-space w-full">
                                                <Password
                                                    passwordProps={{
                                                        passwordParentClassName: `w-full password-form-field ${errors.password && touched.password && 'p-invalid pb-1'}`,
                                                        labelProps: {
                                                            text: translate(localeJson, 'password'),
                                                            spanText: "*",
                                                            passwordLabelSpanClassName: "p-error",
                                                            passwordLabelClassName: "block",
                                                            labelMainClassName: "modal-label-field-space"
                                                        },
                                                        name: 'password',
                                                        value: values.password,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        passwordClass: "w-full"
                                                    }}

                                                />
                                                <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                            </div>
                                        )}
                                        {/* {props.registerModalAction == "create" && props.registerModalAction == "edit" && (
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.tel && touched.tel && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'tel'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    name: 'tel',
                                                    value: values && values.tel,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.tel && touched.tel && errors.tel} />
                                        </div>
                                          )} */}
                                        <div className="text-center">
                                            <div className="modal-button-footer-space">
                                                <Button buttonProps={{
                                                    buttonClass: "w-full update-button",
                                                    type: "submit",
                                                    text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                                    severity: "primary",
                                                    onClick: () => {
                                                        handleSubmit();
                                                    },
                                                }} parentClass={"update-button"} />
                                            </div>
                                            <div>
                                                <Button buttonProps={{
                                                    buttonClass: "w-full back-button",
                                                    text: translate(localeJson, 'cancel'),
                                                    onClick: () => {
                                                        resetForm();
                                                        close()
                                                    },
                                                }} parentClass={"back-button"} />
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