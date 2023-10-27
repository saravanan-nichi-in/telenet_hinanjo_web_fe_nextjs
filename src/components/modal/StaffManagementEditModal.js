import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel } from "../input";
import { StaffManagementService } from "@/services/staffmanagement.service";

export default function StaffManagementEditModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        name: Yup.string()
            .required(translate(localeJson, 'staff_name_required'))
            .max(200,translate(localeJson,'staff_name_max_required')),
        tel: Yup.string()
            .required(translate(localeJson, 'phone_no_required'))
            .min(10, translate(localeJson, 'phone_min10_required')),
    });

    const { open, close, register, modalHeaderText, buttonText } = props && props;

    const header = (
        <div className="custom-modal">
            {modalHeaderText}
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
                initialValues={props.currentEditObj}
                validationSchema={schema}
                enableReinitialize={true} 
                onSubmit={(values, {resetForm}) => {
                    if (props.registerModalAction=="create") {
                        StaffManagementService.create(values, ()=> {
                            resetAndCloseForm(resetForm);
                        })
                    } else if(props.registerModalAction=="edit") {
                        StaffManagementService.update(props.currentEditObj.id, {id: props.currentEditObj.id, ...values},
                        ()=> {
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
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className="custom-modal"
                                header={props.registerModalAction=='create'? translate(localeJson, 'add_staff_management') : translate(localeJson, 'edit_staff_management')}
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
                                                close()
                                            },
                                        }} parentClass={"inline"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem",
                                            type: "submit",
                                            text: props.registerModalAction=='create'? translate(localeJson, 'submit') : translate(localeJson, 'update'),
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
                                            <InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
                                                name: "name",
                                                spanText: "*",
                                                spanClass: "p-error",
                                                value: values && values.name,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'name'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.name && touched.name && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className="mt-5 ">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
                                                spanText: "*",
                                                name: 'email',
                                                spanClass: "p-error",
                                                value: values && values.email,
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'address_email'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`${errors.email && touched.email && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                        </div>
                                        <div className="mt-5 ">
                                            < InputFloatLabel inputFloatLabelProps={{
                                                id: 'householdNumber',
                                                spanText: "*",
                                                name: 'tel',
                                                value: values && values.tel,
                                                spanClass: "p-error",
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                text: translate(localeJson, 'tel'),
                                                inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                            }} parentClass={`w-full ${errors.tel && touched.tel && 'p-invalid pb-1'}`} />
                                            <ValidationError errorBlock={errors.tel && touched.tel && errors.tel} />
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