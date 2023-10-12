import React,{ useContext, useState } from "react"
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
import { InputIcon, TextAreaFloatLabel } from "../input";
import { MailSettingsOption1, MailSettingsOption2 } from '@/utils/constant';
import { InputFile } from '@/components/upload';
import { StockpileService } from "@/services/stockpilemaster.service";

export default function StockpileCreateEditModal(props) {
 
    const { localeJson } = useContext(LayoutContext);
    
    const schema = Yup.object().shape({
        category: Yup.string()
            .required(translate(localeJson, 'type_required')),
        product_name: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required')),
            shelf_life:Yup.number()
    });

    const [category,  setCategory] = useState("");
    /**
     * Destructing
    */
    const { open, close, register } = props;

    const header = (
        <div className="custom-modal">
            {translate(localeJson, 'edit_material_information')}
        </div>
    );
    let categoryNames = ['category1', 'category2', 'category3'];

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ category: "" }}
                onSubmit={(values) => {
                    console.log(values.image_logo)
                    let formData = new FormData();
                    formData.append('category', values.category);
                    formData.append('product_name', values.category);
                    formData.append('shelf_life', values.shelf_life);
                    formData.append('image_logo', values.image_logo);
                    // if (props.registerModalAction=="create") {
                        StockpileService.create(formData, ()=> {
                            close();
                            // props.refreshList();
                        })
                    // } 
                    // else if(props.registerModalAction=="edit") {
                    //     StockpileService.update(props.currentEditObj.id, {id: props.currentEditObj.id, ...values},
                    //     ()=> {
                    //         close();
                    //         // props.refreshList();
                    //     })
                    // }
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
                                                            text={"種別"} />
                                                    </div>
                                                    <InputSelect dropdownProps={{
                                                        name: "category",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        values: category,
                                                        options: categoryNames,
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
                                                        name: "product_name",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        value: values.product_name,
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
                                                        name: "shelf_life",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        value: values.shelf_life,
                                                        inputClass: "create_input_stock",
                                                    }} />
                                                </div>
                                                <div className="pt-3 ">
                                                    <div className='pb-1'>
                                                        <NormalLabel
                                                            text={"画像"} />
                                                    </div>
                                                    <InputFile inputFileProps={{
                                                         name: "image_logo",
                                                         onChange: (event) => {
                                                            setFieldValue("image_logo", event.currentTarget.files[0]);
                                                        },
                                                        inputFileStyle: { fontSize: "12px" }
                                                    }} parentClass={"create_input_stock"} />
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