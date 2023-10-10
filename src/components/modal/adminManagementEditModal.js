import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel } from "../input";

export default function AdminManagementEditModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        fullName: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
    });

    const { open, close, register } = props && props;

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'edit_admin_management')}
        </div>
    );


    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", fullName: "" }}
                onSubmit={() => {
                    router.push("/admin/admin-management")
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
                                                    fullName: values.fullName,
                                                    email: values.email
                                                });

                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="mt-5 mb-3">
                                        <div className="mb-5">
                                            <InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
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
                                                id: 'householdNumber',
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