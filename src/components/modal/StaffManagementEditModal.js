import React, { useContext, useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { ValidationError } from "../error";
import { InputFloatLabel, PasswordFloatLabel } from "../input";
import { StaffManagementService } from "@/services/staffmanagement.service";
import { TabView, TabPanel } from 'primereact/tabview';
import { AdminQuestionarieService } from "@/helper/adminQuestionarieService";
import { NormalTable } from "../datatable";
import { InputText } from "primereact/inputtext";

export default function StaffManagementEditModal(props) {
    const router = useRouter();
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'email_required'))
            .email(translate(localeJson, 'email_valid')),
        name: Yup.string()
            .required(translate(localeJson, 'staff_name_required'))
            .max(200, translate(localeJson, 'staff_name_max_required')),
        tel: Yup.string()
            .required(translate(localeJson, 'phone_no_required'))
            .min(10, translate(localeJson, 'phone_min10_required')),
    });
    const [admins, setAdmins] = useState(null);

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
    const [rowClick, setRowClick] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState(null);

    const columns = [
        {
            selectionMode: "multiple",
            textAlign: "center",
            alignHeader: "center",
            minWidth: "4rem",
            maxWidth: "4rem",
            className: "action_class",
        },
        { field: 'Name', header: translate(localeJson, 'questionnaire_name'), headerClassName: "custom-header", minWidth: "20rem", maxWidth: "20rem" },
    ]

    useEffect(() => {
        AdminQuestionarieService.getAdminQuestionarieRowExpansionWithOrdersSmall().then((data) => setAdmins(data));
    }, []);


    return (
        <>
            <Formik
                initialValues={props.currentEditObj}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                    if (props.registerModalAction == "create") {
                        StaffManagementService.create(values, () => {
                            resetAndCloseForm(resetForm);
                        })
                    } else if (props.registerModalAction == "edit") {
                        StaffManagementService.update(props.currentEditObj.id, { id: props.currentEditObj.id, ...values },
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
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className={`custom-modal `}
                                header={props.registerModalAction == 'create' ? translate(localeJson, 'add_staff_management') : translate(localeJson, 'edit_staff_management')}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                style={{ width: '27em'}}
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
                                            text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content staff_modal`}>
                                    <TabView >
                                        <TabPanel header={translate(localeJson, 'staff_information')}>
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
                                                {props.registerModalAction === "edit" && (
                                                    <>
                                                        <div className="mt-5">
                                                            <PasswordFloatLabel passwordFloatLabelProps={{
                                                                id: 'householdNumber',
                                                                spanText: "*",
                                                                name: 'password',
                                                                value: "Admin@123",
                                                                spanClass: "p-error",
                                                                text: translate(localeJson, 'password'),
                                                                passwordClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                                            }}
                                                                parentClass={`"w-full lg:w-25rem md:w-23rem sm:w-21rem `}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </TabPanel>
                                        <TabPanel header={translate(localeJson, 'event_information')}>
                                            <div className="mt-5">

                                                <div className="flex justify-content-center overflow-x-auto">
                                                    <NormalTable
                                                        className={"custom-table-cell"}
                                                        selection={selectedProducts}
                                                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                                                        selectionMode={rowClick ? null : "checkbox"}
                                                        paginator={"true"}
                                                        tableStyle={{ maxWidth: "30rem" }}
                                                        paginatorLeft={true}
                                                        showGridlines={"true"}
                                                        value={admins}
                                                        columns={columns}
                                                        filterDisplay="menu"
                                                    />
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </TabView>
                                </div>
                            </Dialog>
                        </form>
                    </div>
                )}
            </Formik>
        </>
    );
}