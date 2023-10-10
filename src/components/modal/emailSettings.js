import React, { useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { InputSelectFloatLabel } from "../dropdown";
import { ValidationError } from "../error";
import { TextAreaFloatLabel } from "../input";

export default function EmailSettings(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const [transmissionInterval, setTransmissionInterval] = useState(null);
    const [outputTargetArea, setOutputTargetArea] = useState(null);
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
    const { open, close, register, intervalFrequency, prefectureList } = props && props;

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
                                        text: translate(localeJson, 'registration'),
                                        severity: "primary",
                                        onClick: () => {
                                            register({
                                                transmissionInterval,
                                                outputTargetArea,
                                                email: values.email,
                                                errors: errors
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
                                            <div className='mt-3 mb-5'>
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
                                            <div className='mt-5 '>
                                                <InputSelectFloatLabel dropdownFloatLabelProps={{
                                                    inputId: "mailFrequency",
                                                    inputSelectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    value: transmissionInterval,
                                                    options: intervalFrequency,
                                                    optionLabel: "name",
                                                    onChange: (e) => setTransmissionInterval(e.value),
                                                    text: translate(localeJson, "transmission_interval"),
                                                }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                            </div>
                                            <div className='mt-5'>
                                                <InputSelectFloatLabel dropdownFloatLabelProps={{
                                                    inputId: "prefecture",
                                                    inputSelectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    value: outputTargetArea,
                                                    options: prefectureList,
                                                    optionLabel: "name",
                                                    onChange: (e) => setOutputTargetArea(e.value),
                                                    text: translate(localeJson, "output_target_area"),

                                                }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                            </div>
                                            <div className='mt-3 ml-1 w-full lg:w-25rem md:w-23rem sm:w-21rem '>
                                                <NormalLabel text={translate(localeJson, 'history_mail_message')} style = {{fontSize: "13px"}} />
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