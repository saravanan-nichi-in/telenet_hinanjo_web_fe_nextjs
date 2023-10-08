import React,{ useContext, useState } from "react"
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
import { InputIcon, TextAreaFloatLabel } from "../input";
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';

export default function MaterialCreateEditModal(props) {

    const [transmissionInterval, setTransmissionInterval] = useState(MailSettingsOption1[4]);
    const [outputTargetArea, setOutputTargetArea] = useState(MailSettingsOption2[0]);
 
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        supplies: Yup.string()
            .required(translate(localeJson, 'supplies_necessary'))
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
            {translate(localeJson, 'material_information_registration')}
        </div>
    );


    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ supplies: "" }}
                onSubmit={() => {
                    router.push("/admin/material")
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
                                        type: "submit",
                                        text: translate(localeJson, 'registration'),
                                        severity: "primary",
                                        onClick: () => {
                                            register({
                                                transmissionInterval,
                                                outputTargetArea,
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
                                                <div className="pt-3">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            text={translate(localeJson, 'supplies')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "supplies",
                                                        value: values.supplies,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.supplies && touched.supplies && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.supplies && touched.supplies && errors.supplies} />
                                                </div>
                                                <div className='pt-3'>
                                                    <div className='pb-1'>
                                                        <NormalLabel
                                                            text={translate(localeJson, 'unit')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: 'email',
                                                        inputClass: "create_input_stock",
                                                    }} />
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