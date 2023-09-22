import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { Formik } from "formik";
import * as Yup from "yup";

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, NormalLabel, ValidationError } from '@/components';

export default function AdminMaterialCreatePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        supplies: Yup.string()
            .required(translate(localeJson, 'supplies_necessary'))
    });

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
                    <div className="grid">
                        <div className="col-12">
                            <div className='card'>
                                <section className='col-12'>
                                    <h5 className='page_header'>{translate(localeJson, 'material_information_registration')}</h5>
                                    <DividerComponent />
                                    <div>
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