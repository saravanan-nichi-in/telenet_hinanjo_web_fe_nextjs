import React,{ useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router'

import Button from "../button/button";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { NormalLabel } from "../label";
import { SelectFloatLabel } from "../dropdown";
import { ValidationError } from "../error";
import { InputIcon, TextAreaFloatLabel } from "../input";
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';
import { MaterialService } from "@/services/material.service";

export default function MaterialCreateEditModal(props) {

    const [transmissionInterval, setTransmissionInterval] = useState(MailSettingsOption1[4]);
    const [outputTargetArea, setOutputTargetArea] = useState(MailSettingsOption2[0]);
 
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const schema = Yup.object().shape({
        name: Yup.string()
            .required(translate(localeJson, 'supplies_necessary')),
            unit: Yup.string()
            .required(translate(localeJson, 'supplies_necessary'))    
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
                initialValues={props.currentEditObj}
                onSubmit={(values) => {
                    if (props.registerModalAction=="create") {
                        MaterialService.create(values, ()=> {
                            close();
                        })
                    } else if(props.registerModalAction=="edit") {
                        MaterialService.update(props.currentEditObj.id, {id: props.currentEditObj.id, ...values},
                        ()=> {
                            close();
                        })
                    }
                    router.push("/admin/material");
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
                }) => (
                    <div>
                        <Dialog
                            className="custom-modal"
                            header={header}
                            visible={open}
                            draggable={false}
                            onHide={() => close()}
                            footer={
                                <div className="text-center">
                                    <Button buttonProps={{
                                        buttonClass: "text-600 w-8rem",
                                        bg: "bg-white",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => close(),
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
                                                <div className="pt-3">
                                                    <div className='pb-1'>
                                                        <NormalLabel spanClass={"p-error"}
                                                            spanText={"*"}
                                                            text={translate(localeJson, 'supplies')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: "name",
                                                        value: values.name,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }} parentClass={`${errors.name && touched.name && 'p-invalid pb-1'}`} />
                                                    <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                                </div>
                                                <div className='pt-3'>
                                                    <div className='pb-1'>
                                                        <NormalLabel
                                                            text={translate(localeJson, 'unit')} />
                                                    </div>
                                                    <InputIcon inputIconProps={{
                                                        name: 'unit',
                                                        value: values.unit,
                                                        inputClass: "create_input_stock",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
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