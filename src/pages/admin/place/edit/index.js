import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { Formik } from "formik";
import * as Yup from "yup";

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, ValidationError } from '@/components';

export default function AdminManagementCreatePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters')),
        fullName: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: "", password: "", fullName: "" }}
                onSubmit={(values) => {
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
                                    {/* Header */}
                                    <h5 className='page_header'>{translate(localeJson, 'admin_information_registration')}</h5>
                                    <DividerComponent />
                                    <div>
                                        <div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="pt-3">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            text={translate(localeJson, 'full_name')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "fullName",
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,

                                                    }} parentClass={`${errors.fullName && touched.fullName && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.fullName && touched.fullName && errors.fullName} />
                                                </div>
                                                <div className='pt-3'>
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            text={translate(localeJson, 'email')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: 'email',
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.email && touched.email && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                                </div>
                                                <div className=" pt-3 ">
                                                    <div className='pb-1'>
                                                        <NormalLabel htmlFor="password" spanClass={"p-error"}
                                                            spanText={"*"}
                                                            text={translate(localeJson, 'password')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: 'password',
                                                        type: 'password',
                                                        inputClass: "create_input_stock",
                                                        value: values.password,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.password && touched.password && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                                </div>
                                                <div className='flex pt-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                                    <div>
                                                        <Button buttonProps={{
                                                            buttonClass: "text-600 border-500 evacuation_button_height",
                                                            bg: "bg-white",
                                                            type: "button",
                                                            hoverBg: "hover:surface-500 hover:text-white",
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