import React from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { SelectFloatLabel } from "../dropdown";
import { ValidationError } from "../error";
import { TextAreaFloatLabel } from "../input";
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';
import { useContext, useState } from 'react';

export default function EmailSettings(props) {
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [transmissionInterval, setTransmissionInterval] = useState(MailSettingsOption1[4]);
    const [outputTargetArea, setOutputTargetArea] = useState(MailSettingsOption2[0]);
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
                    router.push("/admin/history/place")
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
                                        text: translate(localeJson, 'registration'),
                                        severity: "primary",
                                        onClick: () => {
                                            handleSubmit();
                                            register({
                                                transmissionInterval,
                                                outputTargetArea,
                                                email: values.email
                                            });
                                        },
                                    }} parentClass={"inline"} />
                                </div>
                            }
                        >
                            <div class={`text-1rem`}>
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <div >
                                            {/* <div className='mt-5 mb-3 flex sm:flex-no-wrap md:w-auto flex-wrap flex-grow align-items-center justify-content-end gap-2 mobile-input ' > */}
                                            <div className='mt-5 mb-5 custom-align-label'>
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
                                                <ValidationError parentClass={"ml-2"} errorBlock={errors.email && touched.email && errors.email} />

                                            </div>
                                            <div className='mt-5'>
                                                <SelectFloatLabel selectFloatLabelProps={{
                                                    inputId: "shelterCity",
                                                    selectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    value: transmissionInterval,
                                                    options: MailSettingsOption1,
                                                    optionLabel: "name",
                                                    onChange: (e) => setTransmissionInterval(e.value),
                                                    text: translate(localeJson, "transmission_interval"),

                                                }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                            </div>
                                            <div className='mt-6'>
                                                <SelectFloatLabel selectFloatLabelProps={{
                                                    inputId: "shelterCity",
                                                    selectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    value: outputTargetArea,
                                                    options: MailSettingsOption2,
                                                    optionLabel: "name",
                                                    onChange: (e) => setOutputTargetArea(e.value),
                                                    text: translate(localeJson, "output_target_area"),

                                                }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
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