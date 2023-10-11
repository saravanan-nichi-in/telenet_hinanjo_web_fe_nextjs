import React, { useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { ValidationError } from "../error";
import { InputFloatLabel, TextAreaFloatLabel } from "../input";

export default function StockPileSummaryMailSettingsModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'notification_email_id_required'))
            .test('is-email', translate(localeJson, 'format_notification'), value => {
                // Check if it's a single valid email or a list of valid emails separated by commas
                return Yup.string().email().isValidSync(value) || validateMultipleEmails(value, localeJson);
            }),
    });
    /**
     * Destructing
    */
    const { open, close, register } = props && props;

    const validateMultipleEmails = (value, localeJson) => {
        const emails = value.split(',').map(email => email.trim());

        for (const email of emails) {
            if (!Yup.string().email().isValidSync(email)) {
                return false;
            }
        }

        return true; // Return true if all emails are valid
    };

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'mail_setting')}
        </div>
    );


    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "" }}
                onSubmit={() => {
                    router.push("/admin/stockpile/summary")
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
                            header={translate(localeJson, 'notification_settings')}
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
                                            register({
                                                email: values.email
                                            });
                                            handleSubmit();
                                        },
                                    }} parentClass={"inline"} />
                                </div>
                            }
                        >
                            <div className={`modal-content`}>
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <div >
                                            <div className='mt-5 mb-5'>
                                                <InputFloatLabel
                                                    inputFloatLabelProps={{
                                                        id: 'householdNumber',
                                                        readOnly: "true",
                                                        value: "日比谷公園避難所",
                                                        spanClass: "p-error",
                                                        spanText: "*",
                                                        disabled: "true",
                                                        inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                        text: translate(localeJson, 'shelter_place'),
                                                    }}
                                                />
                                            </div>
                                            <div className='mt-5'>
                                                <TextAreaFloatLabel textAreaFloatLabelProps={{
                                                    textAreaClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem ",
                                                    row: 5,
                                                    cols: 30,
                                                    name: 'email',
                                                    text: translate(localeJson, 'notification_email_id'),
                                                    spanClass: "p-error",
                                                    spanText: "*",
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }} parentClass={`${errors.email && touched.email && 'p-invalid w-full lg:w-25rem md:w-23rem sm:w-21rem '}`} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className='mt-3 ml-1 w-full lg:w-25rem md:w-23rem sm:w-21rem '>
                                                <NormalLabel text={translate(localeJson, 'history_mail_message')} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                )}
            </Formik>
        </>
    );
}