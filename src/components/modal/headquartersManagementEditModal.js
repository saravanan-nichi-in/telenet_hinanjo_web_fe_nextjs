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
        userId: Yup.string()
            .required(translate(localeJson, 'userId_required')),
        name: Yup.string()
            .required(translate(localeJson, 'staff_name_required'))
            .max(200, translate(localeJson, 'staff_name_max_required')),
        password: Yup.string()
        .required(translate(localeJson, 'new_password_required'))
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/,
            translate(localeJson, 'new_password_not_matched')
        ),
    });
    const [admins, setAdmins] = useState(null);

    const { open, close, register, modalHeaderText, buttonText } = props && props;

    const header = (
        <div className="custom-modal">
            {modalHeaderText}
        </div>
    );

    const [rowClick, setRowClick] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const initialValues={userId:"",name:"",password:""}
    const columns = [
        {
            selectionMode: "multiple",
            textAlign: "center",
            alignHeader: "center",
            minWidth: "4rem",
            maxWidth: "4rem",
            className: "action_class",
        },
        { field: 'Name', header: translate(localeJson, 'questionnaire_name'), headerClassName: "custom-header", minWidth: "10rem", maxWidth: "10rem" },
    ]

    useEffect(() => {
        AdminQuestionarieService.getAdminQuestionarieRowExpansionWithOrdersSmall().then((data) => setAdmins(data));
    }, []);


    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, actions) => {
                    if (props.registerModalAction == "create") {
                        actions.resetForm({ values: initialValues });

                    } else if (props.registerModalAction == "edit") {
                        actions.resetForm({ values: initialValues });
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
                                                        name: 'userId',
                                                        spanClass: "p-error",
                                                        value: values && values.userId,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        text: translate(localeJson, 'address_userId'),
                                                        inputClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                                    }} parentClass={`${errors.userId && touched.userId && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.userId && touched.userId && errors.userId} />
                                                </div>
                                                <div className="mt-5">
                                                    <PasswordFloatLabel passwordFloatLabelProps={{
                                                        id: 'householdNumber',
                                                        spanText: "*",
                                                        name: 'password',
                                                        value: values.password,
                                                        spanClass: "p-error",
                                                        text: translate(localeJson, 'password'),
                                                        passwordClass: "w-full lg:w-25rem md:w-23rem sm:w-21rem "
                                                    }}
                                                        parentClass={`"w-full lg:w-25rem md:w-23rem sm:w-21rem `}
                                                    />
                                                    <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                                </div>
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