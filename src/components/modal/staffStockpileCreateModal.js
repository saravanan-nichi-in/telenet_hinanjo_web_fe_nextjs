import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputNumberFloatLabel } from "../input";
import { InputSelectFloatLabel, SelectFloatLabel } from "../dropdown";
import { InputFile } from "../upload";
import { NormalLabel } from "../label";

export default function StaffStockpileCreate(props) {
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        productType: Yup.string()
            .required(translate(localeJson, 'type_required')),
        productName: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required')),
        file: Yup.mixed()
            .nullable()
            .test(
                "is-image",
                translate(localeJson, "valid_image_file"),
                (value) => {
                    if (!value) return true; // If no file is selected, the validation passes.
                    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
                    const fileExtension = value.split(".").pop().toLowerCase();
                    if (allowedExtensions.includes(fileExtension)) {
                        // Check image size not exceeding 5MB
                        if (value.size <= 5 * 1024 * 1024) {
                            return true; // Pass validation
                        } else {
                            // Custom error message for image size exceeded
                            return new Yup.ValidationError(
                                translate(localeJson, "image_size_validation"),
                                null
                            );
                        }
                    }
                    return false; // Return false for invalid input.
                }
            ),
    });
    const { open, close, header, buttonText } = props && props;
    const initialValues = { productType: "", productName: "", file: "" }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    close();
                    actions.resetForm({ values: initialValues });

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
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className="custom-modal"
                                header={header}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    close();
                                    resetForm({ values: initialValues });
                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "text-600 w-8rem",
                                            bg: "bg-white",
                                            hoverBg: "hover:surface-500 hover:text-white",
                                            text: translate(localeJson, 'cancel'),
                                            onClick: () => {
                                                close();
                                                resetForm({ values: initialValues });
                                            },
                                        }} parentClass={"inline"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem",
                                            type: "submit",
                                            text: buttonText,
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="mt-5 mb-3">
                                        <div className="mb-5">
                                            <SelectFloatLabel selectFloatLabelProps={{
                                                inputId: "productType",
                                                spanText: "*",
                                                spanClass: "p-error",
                                                selectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                options: props.categories,
                                                value: values.productType,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'stockpile_management_create_edit_field_category'),

                                            }} />
                                            <ValidationError errorBlock={errors.productType && touched.productType && errors.productType} />
                                        </div>
                                        <div className="mt-5 ">
                                            <InputSelectFloatLabel dropdownFloatLabelProps={{
                                                inputId: "productName",
                                                spanText: "*",
                                                spanClass: "p-error",
                                                inputSelectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                options: props.categories,
                                                value: values.productName,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'stockpile_management_create_edit_field_product_name'),
                                            }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                            <ValidationError errorBlock={errors.productName && touched.productName && errors.productName} />
                                        </div>
                                        <div className="mt-5">
                                            <InputNumberFloatLabel
                                                inputNumberFloatProps={{
                                                    id: "altitude",
                                                    inputId: "integeronly",
                                                    name: "altitude",
                                                    text: translate(localeJson, "stockpile_management_create_edit_field_shelf_life"),
                                                    inputNumberClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <div className="mb-1">
                                                <NormalLabel text={translate(localeJson, 'header_stockpile_image')} />
                                            </div>
                                            <div>
                                                <InputFile
                                                    inputFileProps={{
                                                        onChange: handleChange,
                                                        name: "file",
                                                        accept: ".jpg,.png",
                                                        onBlur: handleBlur,
                                                    }}
                                                    parentClass={`${errors.file && touched.file && "p-invalid mt-2 pb-1"
                                                        }`}
                                                />
                                                <ValidationError
                                                    errorBlock={
                                                        errors.file && touched.file && errors.file
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                        </form>
                    </div>
                )}
            </Formik>
        </>
    );
}