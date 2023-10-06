import React, { useContext } from 'react';
import { useRouter } from 'next/router'
import { Formik } from "formik";
import * as Yup from "yup";

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, InputIcon, InputSelect, NormalLabel, ValidationError } from '@/components';
import { InputFile } from '@/components/upload';

export default function AdminStockpileCreatePage() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        type: Yup.string()
            .required(translate(localeJson, 'type_required')),
        stockpileName: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required')),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ type: "", stockpileName: "" }}
                onSubmit={() => {
                    router.push("/admin/stockpile/master")
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
                                    <h5 className='page_header'>{translate(localeJson, 'edit_material_information')}</h5>
                                    <DividerComponent />
                                    <div>
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
                                                            text: translate(localeJson, 'update'),
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