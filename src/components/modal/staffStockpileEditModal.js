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
import { StockpileStaffService } from "@/services/stockpilestaff.service";

export default function StaffStockpileEdit(props) {
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
        after_count: Yup.number()
            .required(translate(localeJson, 'quantity_is_required')),
        inventoryDate: Yup.string()
            .required(translate(localeJson, 'inventory_date_is_required')),
        expiry_date: Yup.string()
            .required(translate(localeJson, 'expiry_date_is_required'))
            .test('is-valid-date', translate(localeJson, 'expiry_date_must_be_equal_or_greater_than_today'), function (value) {
                if (!value) return true; // Allow empty values  
                const inputDate = new Date(value);
                const today = new Date();
                return inputDate >= today;
            }),
    });
    const { open, close, header, buttonText } = props && props;
    // const initialValues = { productType: "", productName: "", shelfDays: "3", quantity: "", inventoryDate: "", confirmer: "", expiryDate: "", remarks: "" }
    const initialValues = {
                    "id": "",
                    "hinan_id": 1,
                    "before_count": 0,
                    "after_count": 0,
                    "incharge": "",
                    "remarks": "",
                    "expiry_date": "",
                    "history_flag": 0,
                    "Inspection_date_time": "",
                    "category": "",
                    "shelf_life": 0,
                    "product_name": ""
                };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={...props.editObject}
                enableReinitialize={true}
                onSubmit={(values, actions) => {
                    // close();
                    let temp = []
                    console.log({...props.editObject})
                    StockpileStaffService.update(props.editObject.id, [{...props.editObject, ...values}], ()=> {
                        
                    })
                    actions.resetForm()
                    // actions.resetForm({ values: initialValues });
                    
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
                                                close();
                                                
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
                                        <div className="mt-5 ">
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
                                            <InputNumberFloatLabel
                                                inputNumberFloatProps={{
                                                    id: "shelf_life",
                                                    inputId: "integeronly",
                                                    name: "shelf_life",
                                                    disabled: true,
                                                    value: values.shelf_life,
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
                                                    name: "after_count",
                                                    value: values.after_count,
                                                    onValueChange: handleChange,
                                                    onBlur: handleBlur,
                                                    text: translate(localeJson, "quantity"),
                                                    inputNumberClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.after_count && touched.after_count && errors.after_count} />
                                        </div>
                                        <div className="mt-5">
                                            <DateCalendarFloatLabel
                                                dateFloatLabelProps={{
                                                    dateClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem",
                                                    id: "inventoryDate",
                                                    value: values.Inspection_date_time,
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
                                            <ValidationError errorBlock={errors.Inspection_date_time && touched.Inspection_date_time && errors.Inspection_date_time} />
                                        </div>
                                        <div className="mt-5">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'confirmer',
                                                name: 'incharge',
                                                value: values.incharge,
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
                                                    value: values.expiry_date,
                                                    name: "expiry_date",
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    placeholder: "yyyy-mm-dd",
                                                    text: translate(
                                                        localeJson,
                                                        "expiry_date"
                                                    ),
                                                }} />
                                            <ValidationError errorBlock={errors.expiry_date && touched.expiry_date && errors.expiry_date} />
                                        </div>
                                        <div className="mt-5">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                spanClass: "p-error",
                                                value: values.remarks,
                                                name: 'remarks',
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