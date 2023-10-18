import React,{ useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { ValidationError } from "../error";
import { InputFloatLabel, InputIcon } from "../input";
import { MaterialService } from "@/services/material.service";

export default function MaterialCreateEditModal(props) {
 
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        name: Yup.string()
            .required(translate(localeJson, 'supplies_necessary'))
            .max(100, translate(localeJson, 'material_page_create_update_name_max')),
        unit: Yup.string()
            .max(100, translate(localeJson, 'material_page_create_update_unit_max'))
            .nullable()
    });
    /**
     * Destructing
    */
    const { open, close, register } = props && props;



    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'material_information_registration')}
        </div>
    );


    return (
        <>
            <Formik
                validationSchema={schema}
                enableReinitialize={true} 
                initialValues={...props.currentEditObj}
                onSubmit={(values) => {
                    if (props.registerModalAction=="create") {
                        MaterialService.create(values, ()=> {
                            close();
                            props.refreshList();
                        })
                    } else if(props.registerModalAction=="edit") {
                        MaterialService.update(props.currentEditObj.id, {id: props.currentEditObj.id, ...values},
                        ()=> {
                            close();
                            props.refreshList();
                        })
                    }
                    
                    return false;
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <Dialog
                            className="custom-modal"
                            header={header}
                            visible={open}
                            draggable={false}
                            onHide={() => {
                                resetForm();
                                close();
                            }}
                            footer={
                                <div className="text-center">
                                    <Button buttonProps={{
                                        buttonClass: "text-600 w-8rem",
                                        bg: "bg-white",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => {
                                            resetForm();
                                            close()},
                                    }} parentClass={"inline"} />
                                    <Button buttonProps={{
                                        buttonClass: "w-8rem",
                                        type: "submit",
                                        text: translate(localeJson, 'registration'),
                                        severity: "primary",
                                        onClick: () => {
                                            handleSubmit();
                                        },
                                    }} parentClass={"inline"} />
                                </div>
                            }
                        >
                            <div className={`modal-content`}>
                                <div>
                                <form onSubmit={handleSubmit}>
                                                <div className="mt-5">
                                                    <InputFloatLabel inputFloatLabelProps={{
                                                        name: "name",
                                                        spanText: "*",
                                                        value: values.name,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        text : translate(localeJson, 'material_name'),
                                                        inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                                    }} parentClass={`${errors.name && touched.name && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                                </div>
                                                <div className='mt-5 mb-5'>
                                                    <InputFloatLabel inputFloatLabelProps={{
                                                        name: 'unit',
                                                        value: values.unit,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        text: translate(localeJson, 'unit'),
                                                        inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                                    }} parentClass={`${errors.unit && touched.unit && 'p-invalid pb-1'}`}/>
                                                    <ValidationError errorBlock={errors.unit && touched.unit && errors.unit} />
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