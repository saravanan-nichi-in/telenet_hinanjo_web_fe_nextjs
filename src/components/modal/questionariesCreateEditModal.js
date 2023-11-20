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

export default function QuestionnairesCreateEditModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        name: Yup.string()
            .required(translate(localeJson, 'questionnaire_name_is_required'))
            .max(200, translate(localeJson, 'questionnaire_name_max')),
        name_en: Yup.string()
            .max(200, translate(localeJson, 'questionnaire_name_en_max')),
        remarks: Yup.string()
            .max(255, translate(localeJson, 'questionnaire_remarks_is_max_required')),
    });
    const { open, close, onRegister, header, buttonText, modalAction, editObject } = props && props;
    const [initialValues, setInitialValues] = useState({
        name: "",
        name_en: "",
        remarks: ""
    })

    useEffect(() => {
        if (open) {
            if(modalAction == "create"){
                setInitialValues({
                    name: "",
                    name_en: "",
                    remarks: ""
                });
            } else {
                setInitialValues({
                    name: editObject.name,
                    name_en: editObject.name_en,
                    remarks: editObject.description
                });
            }
            
        }
    }, [open]);

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values, actions) => {
                    close();
                    onRegister(values);
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
                                            type: "reset",
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
                                                text: translate(localeJson, 'questionnaires_name_jp'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.name && touched.name && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className="mt-5 ">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'name_en',
                                                name: 'name_en',
                                                value: values.name_en,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'questionnaires_name_en'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.name_en && touched.name_en && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.name_en && touched.name_en && errors.name_en} />
                                        </div>
                                        <div className="mt-5 ">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'remarks',
                                                name: 'remarks',
                                                value: values.remarks,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'remarks'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.remarks && touched.remarks && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.remarks && touched.remarks && errors.remarks} />
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