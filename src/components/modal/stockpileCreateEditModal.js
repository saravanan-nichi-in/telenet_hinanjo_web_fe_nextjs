import React, { useContext, useState } from "react"
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
import { InputFloatLabel, InputIcon, TextAreaFloatLabel } from "../input";
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';
import { InputFile } from '@/components/upload';
import { StockpileService } from "@/services/stockpilemaster.service";

export default function StockpileCreateEditModal(props) {

    const { localeJson } = useContext(LayoutContext);

    const schema = Yup.object().shape({
        category: Yup.string()
            .required(translate(localeJson, 'type_required'))
            .max(100, translate(localeJson, 'material_page_create_update_name_max')),
        product_name: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required'))
            .max(100, translate(localeJson, 'material_page_create_update_name_max')),
        shelf_life: Yup.number().typeError(translate(localeJson, 'number_field'))
            .positive(translate(localeJson, 'number_field'))
            .integer(translate(localeJson, 'number_field'))
            .max(999, translate(localeJson, 'stockpile_shelf_life_max')),
        image_logo: Yup.mixed()
            .notRequired() // Allow it to be nullable
            .test('fileSize', translate(localeJson, 'image_size_validation'), (value) => {
                if (value) {
                return value && value.size <= 5 * 1024 * 1024; // 5 MB in bytes
                }
                return true; // Null values are allowed
            })
            .test('fileType', translate(localeJson, 'valid_image_file'), (value) => {
                if (value) {
                return value && value.type.startsWith('image/'); // Check if the file type starts with "image/"
                }
                return true; // Null values are allowed
            }),    
    });

    const [category, setCategory] = useState("");
    /**
     * Destructing
    */
    const { open, close, register } = props;

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'stockpile_management_create_edit_modal_header')}
        </div>
    );

    const resetAndCloseForm = (callback) => {
        close();
        callback();
        props.refreshList();
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                enableReinitialize={true}
                // initialValues={{ category: "", product_name: "", shelf_life: "" }}
                initialValues={props.currentEditObj}
                onSubmit={(values, {resetForm}) => {
                    let formData = new FormData();
                    formData.append('category', values.category);
                    formData.append('product_name', values.product_name);
                    formData.append('shelf_life', values.shelf_life);
                    if (values.image_logo) {
                        formData.append('image_logo', values.image_logo);
                    }

                    if (props.registerModalAction == "create") {
                        StockpileService.create(formData, () => {
                            resetAndCloseForm(resetForm);
                        })
                    }
                    else if (props.registerModalAction == "edit") {
                        formData.append('product_id', props.currentEditObj.product_id);
                        StockpileService.update(props.currentEditObj.product_id, formData,
                            () => {
                                resetAndCloseForm(resetForm);
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
                    setFieldValue,
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
                                close()
                                resetForm()
                            }}
                            footer={
                                <div className="text-center">
                                    <Button buttonProps={{
                                        buttonClass: "text-600 w-8rem",
                                        bg: "bg-white",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => {
                                            close()
                                            resetForm()
                                        },
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
                                                <SelectFloatLabel selectFloatLabelProps={{
                                                    inputId: "category",
                                                    spanText: "*",
                                                    spanClass: "p-error",
                                                    selectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    options: props.categories,
                                                    value: values.category,
                                                    onChange: (e) => {
                                                        if(e.value=="--") {
                                                            values.category=''
                                                        } else {
                                                            values.category=e.value
                                                        }
                                                    },
                                                    onBlur: handleBlur,
                                                    text: translate(localeJson, "stockpile_management_create_edit_field_category"),
                                                    
                                                }}/>
                                                <ValidationError errorBlock={errors.category && touched.category && errors.category} />
                                        </div>
                                        <div className="mt-5">
                                                    <InputFloatLabel inputFloatLabelProps={{
                                                        name: "product_name",
                                                        spanText: "*",
                                                        spanClass: "p-error",
                                                        value: values.product_name,
                                                        inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        text : translate(localeJson, 'stockpile_management_create_edit_field_product_name'),
                                                    }} parentClass={`${errors.product_name && touched.product_name && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.product_name && touched.product_name && errors.product_name} />
                                        </div>
                                        <div className="mt-5">
                                                    <InputFloatLabel inputFloatLabelProps={{
                                                        name: "shelf_life",
                                                        spanClass: "p-error",
                                                        value: values.shelf_life,
                                                        inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        text : translate(localeJson, 'stockpile_management_create_edit_field_shelf_life'),
                                                    }} parentClass={`${errors.shelf_life && touched.shelf_life && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.shelf_life && touched.shelf_life && errors.shelf_life} />
                                        </div>
                                        <div className="py-3 ">
                                            <div className='pb-1'>
                                                <NormalLabel
                                                    text={translate(localeJson, 'stockpile_management_create_edit_field_stockpile_image')} />
                                            </div>
                                            <InputFile inputFileProps={{
                                                name: "image_logo",
                                                onChange: (event) => {
                                                    setFieldValue("image_logo", event.currentTarget.files[0]);
                                                },
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                inputFileStyle: { fontSize: "12px" }
                                            }} parentClass={"create_input_stock w-full lg:w-25rem md:w-23rem sm:w-21rem"} />
                                            <ValidationError errorBlock={errors.image_logo && touched.image_logo && errors.image_logo} />
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