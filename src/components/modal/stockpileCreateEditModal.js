import React,{ useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { InputSelect, SelectFloatLabel } from "../dropdown";
import { ValidationError } from "../error";
import { InputIcon, TextAreaFloatLabel } from "../input";
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';
import { InputFile } from '@/components/upload';

export default function StockpileCreateEditModal(props) {

    const [transmissionInterval, setTransmissionInterval] = useState(MailSettingsOption1[4]);
    const [outputTargetArea, setOutputTargetArea] = useState(MailSettingsOption2[0]);
 
 
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        type: Yup.string()
            .required(translate(localeJson, 'type_required')),
        stockpileName: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required')),
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
            {translate(localeJson, 'edit_material_information')}
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
                                                            text={"種別"} />
                                                    </div>
                                                    <InputSelect dropdownProps={{
                                                        name: "type",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        value: values.type,
                                                        inputSelectClass: "create_input_stock"
                                                    }} parentClass={`${errors.type && touched.type && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.type && touched.type && errors.type} />
                                                </div>
                                                <div className="pt-3 ">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            text={"備蓄品名"} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "stockpileName",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        value: values.stockpileName,
                                                        inputClass: "create_input_stock",
                                                    }} parentClass={`${errors.stockpileName && touched.stockpileName && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.stockpileName && touched.stockpileName && errors.stockpileName} />
                                                </div>
                                                <div className="pt-3 ">
                                                    <div className='pb-1'>
                                                        <NormalLabel
                                                            text={"保管期間 (日)"} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        keyfilter: "num",
                                                        inputClass: "create_input_stock",
                                                    }} />
                                                </div>
                                                <div className="pt-3 ">
                                                    <div className='pb-1'>
                                                        <NormalLabel
                                                            text={"画像"} />
                                                    </div>
                                                    <InputFile inputFileProps={{
                                                        inputFileStyle: { fontSize: "12px" }
                                                    }} parentClass={"create_input_stock"} />
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