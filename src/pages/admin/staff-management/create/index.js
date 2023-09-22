import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { Formik } from "formik";
import * as Yup from "yup";

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, ValidationError } from '@/components';

export default function StaffManagementCreatePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        phoneNumber: Yup.string()
            .required(translate(localeJson, 'phone_no_required'))
            .min(10, translate(localeJson, 'phone_min10_required    ')),
        fullName: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", phoneNumber: "", fullName: "" }}
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
                    <div className="grid">
                        <div className="col-12">
                            <div className='card'>
                                <section className='col-12'>
                                    <h5 className='page_header'>{translate(localeJson, 'staff_information_registration')}</h5>
                                    <DividerComponent />
                                    <div>
                                        <div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="pt-3">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            labelClass="pt-1"
                                                            text={translate(localeJson, 'full_name')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "fullName",
                                                        value: values.fullName,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.fullName && touched.fullName && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.fullName && touched.fullName && errors.fullName} />
                                                </div>
                                                <div className="pt-3">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            labelClass="pt-1"
                                                            text={translate(localeJson, 'email')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: 'email',
                                                        inputClass: "create_input_stock",
                                                        value: values.email,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={` ${errors.email && touched.email && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                                </div>
                                                <div className="pt-3">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            labelClass="pt-1"
                                                            text={translate(localeJson, 'telephone_number')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: 'phoneNumber',
                                                        value: values.phoneNumber,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        keyfilter: "num"
                                                    }} parentClass={`w-full ${errors.phoneNumber && touched.phoneNumber && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.phoneNumber && touched.phoneNumber && errors.phoneNumber} />
                                                </div>
                                                <div className='flex pt-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <div>
                                                        <Button buttonProps={{
                                                            buttonClass: "text-600 border-500 evacuation_button_height",
                                                            bg: "bg-white",
                                                            hoverBg: "hover:surface-500 hover:text-white",
                                                            type: 'button',
                                                            text: translate(localeJson, 'cancel'),
                                                            rounded: "true",
                                                            severity: "primary"
                                                        }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                                    </div>
                                                    <div >
                                                        <Button buttonProps={{
                                                            buttonClass: "evacuation_button_height",
                                                            type: 'submit',
                                                            text: translate(localeJson, 'renew'),
                                                            rounded: "true",
                                                            severity: "primary"
                                                        }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    )
}