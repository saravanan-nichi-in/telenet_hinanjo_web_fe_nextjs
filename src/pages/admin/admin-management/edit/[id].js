import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, ValidationError } from '@/components';
import { Formik } from "formik";
import * as Yup from "yup";

export default function AdminManagementCreatePage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();

    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        fullName: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
    });

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
                    <div className="grid">
                        <div className="col-12">
                            <div className='card'>
                                <section className='col-12'>
                                    {/* Header */}
                                    <h5 className='page_header'>{translate(localeJson, 'admin_management_edit')}</h5>
                                    <DividerComponent />
                                    <div>
                                        <div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="">
                                                    <NormalLabel spanClass={"p-error"}
                                                        spanText={"*"}
                                                        labelClass="pt-1 pr-5 evacuation_label"
                                                        text={translate(localeJson, 'full_name')} />
                                                    <InputIcon inputIconProps={{
                                                        name: "fullName",
                                                        value: values.fullName,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,

                                                    }} parentClass={`${errors.fullName && touched.fullName && 'p-invalid'}`} />
                                                    <ValidationError errorBlock={errors.fullName && touched.fullName && errors.fullName} />
                                                </div>
                                                <div className="pt-3 ">
                                                    <NormalLabel spanClass={"p-error"}
                                                        spanText={"*"}
                                                        labelClass="pt-1 pr-5 evacuation_label"
                                                        text={translate(localeJson, 'email')} />
                                                    <InputIcon inputIconProps={{
                                                        name: 'email',
                                                        value: values.email,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.email && touched.email && 'p-invalid'}`} />
                                                    <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                                </div>
                                                <div className='flex' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
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