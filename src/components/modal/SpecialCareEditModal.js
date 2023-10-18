import React, { useContext, useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel, InputIcon } from "../input";

export default function SpecialCareEditModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        name: Yup.string()
            .required(translate(localeJson, 'special_care_name_jp_required')),
        name_en: Yup.string()
            .required(translate(localeJson, 'special_care_name_en_required')),
    });
    const { open, close, onSpecialCareEditSuccess, header, buttonText } = props && props;

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={props.currentEditObj}
                enableReinitialize
                onSubmit={(values, actions) => {
                    if(props.registerModalAction=="create"||props.registerModalAction=="edit")
                    {
                   props.submitForm(values);
                    }

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
                                className="custom-modal"
                                header={header}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    close();
                                    resetForm()
                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "text-600 w-8rem",
                                            bg: "bg-white",
                                            hoverBg: "hover:surface-500 hover:text-white",
                                            text: translate(localeJson, 'cancel'),
                                            type:"reset",
                                            onClick: () => {
                                                close();
                                                resetForm()
                                            },
                                        }} parentClass={"inline"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem",
                                            type: "submit",
                                            text: buttonText,
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="mt-5 mb-5">
                                        <div className="mb-5">
                                            <InputFloatLabel inputFloatLabelProps={{
                                                name: "name",
                                                spanText: "*",
                                                spanClass: "p-error",
                                                value: values.name,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'special_care_name_jp'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.name && touched.name && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className="mt-5 ">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'name_en',
                                                spanText: "*",
                                                name: 'name_en',
                                                spanClass: "p-error",
                                                value: values.name_en,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'special_care_name_en'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.name_en && touched.name_en && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.name_en && touched.name_en && errors.name_en} />
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