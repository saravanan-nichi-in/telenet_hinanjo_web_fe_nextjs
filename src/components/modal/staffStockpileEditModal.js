import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel, InputNumberFloatLabel } from "../input";
import { InputSelectFloatLabel, SelectFloatLabel } from "../dropdown";
import { DateCalendarFloatLabel } from "../date&time";

export default function StaffStockpileEdit(props) {
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        quantity: Yup.number()
            .required(translate(localeJson, 'quantity_is_required')),
        inventoryDate: Yup.string()
            .required(translate(localeJson, 'inventory_date_is_required')),
        expiryDate: Yup.string()
            .required(translate(localeJson, 'expiry_date_is_required'))
            .test('is-valid-date', translate(localeJson, 'expiry_date_must_be_equal_or_greater_than_today'), function (value) {
                if (!value) return true; // Allow empty values  
                const inputDate = new Date(value);
                const today = new Date();
                return inputDate >= today;
            }),
    });
    const { open, close, header, buttonText } = props && props;
    const initialValues = { productType: "", productName: "", shelfDays: "3", quantity: "", inventoryDate: "", confirmer: "", expiryDate: "", remarks: "" }

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
                                                value: values.productType,
                                                disabled: true,
                                                readOnly: true,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'stockpile_management_create_edit_field_category'),
                                            }} />
                                        </div>
                                        <div className="mt-5 ">
                                            <InputSelectFloatLabel dropdownFloatLabelProps={{
                                                inputId: "productName",
                                                spanText: "*",
                                                spanClass: "p-error",
                                                inputSelectClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                value: values.productName,
                                                disabled: true,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'stockpile_management_create_edit_field_product_name'),
                                            }} parentClass="w-full lg:w-25rem md:w-23rem sm:w-21rem " />
                                        </div>
                                        <div className="mt-5">
                                            <InputNumberFloatLabel
                                                inputNumberFloatProps={{
                                                    id: "shelfDays",
                                                    inputId: "integeronly",
                                                    name: "shelfDays",
                                                    disabled: true,
                                                    value: values.shelfDays,
                                                    text: translate(localeJson, "stockpile_management_create_edit_field_shelf_life"),
                                                    inputNumberClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                }}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <InputNumberFloatLabel
                                                inputNumberFloatProps={{
                                                    id: "quantity",
                                                    spanText: "*",
                                                    spanClass: "p-error",
                                                    inputId: "quantity",
                                                    name: "quantity",
                                                    value: values.quantity,
                                                    onValueChange: handleChange,
                                                    onBlur: handleBlur,
                                                    text: translate(localeJson, "quantity"),
                                                    inputNumberClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.quantity && touched.quantity && errors.quantity} />
                                        </div>
                                        <div className="mt-5">
                                            <DateCalendarFloatLabel
                                                dateFloatLabelProps={{
                                                    dateClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    id: "inventoryDate",
                                                    value: values.inventoryDate,
                                                    spanText: "*",
                                                    spanClass: "p-error",
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    placeholder: "yyyy-mm-dd",
                                                    text: translate(
                                                        localeJson,
                                                        "inventory_date"
                                                    ),
                                                }} />
                                            <ValidationError errorBlock={errors.inventoryDate && touched.inventoryDate && errors.inventoryDate} />
                                        </div>
                                        <div className="mt-5">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'confirmer',
                                                name: 'confirmer',
                                                value: values.confirmer,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'confirmer'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} />
                                        </div>
                                        <div className="mt-5">
                                            <DateCalendarFloatLabel
                                                dateFloatLabelProps={{
                                                    dateClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    id: "expiryDate",
                                                    spanText: "*",
                                                    spanClass: "p-error",
                                                    value: values.expiryDate,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    placeholder: "yyyy-mm-dd",
                                                    text: translate(
                                                        localeJson,
                                                        "expiry_date"
                                                    ),
                                                }} />
                                            <ValidationError errorBlock={errors.expiryDate && touched.expiryDate && errors.expiryDate} />
                                        </div>
                                        <div className="mt-5">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                spanClass: "p-error",
                                                value: values.remarks,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'remarks'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} />
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