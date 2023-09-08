import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, ValidationError } from '@/components';
import { Formik } from "formik";
import * as Yup from "yup";

export default function AdminSpecialCareEditPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();

    const schema = Yup.object().shape({
        mattersToConsider: Yup.string()
            .required(translate(localeJson, 'matters_to_consider_required')),
        thingsToConsider: Yup.string()
            .required(translate(localeJson, 'things_to_consider_required')),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ mattersToConsider: "", thingsToConsider: "" }}
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
                    <div className="grid">
                        <div className="col-12">
                            <div className='card'>
                                <section className='col-12'>
                                    {/* Header */}
                                    <h5 className='page_header'>{translate(localeJson, 'special_care_registration')}</h5>
                                    <DividerComponent />
                                    <div>
                                        <div>
                                            <form onSubmit={handleSubmit}>
                                                <div >
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            labelClass="pt-1"
                                                            text={translate(localeJson, 'special_care_list')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "mattersToConsider",
                                                        value: values.mattersToConsider,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.mattersToConsider && touched.mattersToConsider && 'p-invalid'}`} />
                                                    <ValidationError errorBlock={errors.mattersToConsider && touched.mattersToConsider && errors.mattersToConsider} />
                                                </div>
                                                <div className='pt-3' >
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            labelClass="pt-1"
                                                            text={translate(localeJson, 'things_to_consider')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "thingsToConsider",
                                                        value: values.thingsToConsider,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.thingsToConsider && touched.thingsToConsider && 'p-invalid'}`} />
                                                    <ValidationError errorBlock={errors.thingsToConsider && touched.thingsToConsider && errors.thingsToConsider} />
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
                                                            text: translate(localeJson, 'registration'),
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