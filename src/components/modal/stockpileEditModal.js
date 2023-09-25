import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import Button from "../button/button";
import { NormalLabel } from "../label";
import { Select } from "../dropdown";
import { InputIcon } from "../input";
import { DateCalendar } from "../date&time";
import { ValidationError } from "../error";

const StockPileEditModal = (props) => {
    const {
        parentMainClass,
        modalClass,
        draggable,
        position,
        contentClass,
        value,
        options,
        onChange,
        placeholder,
        selectParentClass,
        onClickTop,
        OnClickAddition,
        ...restProps
    } = props;
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const header = (
        <div>
            <h6 style={{ fontWeight: "600" }} className="page_header">新規登録</h6>
        </div>
    );
    const schema = Yup.object().shape({
        quantity: Yup.number()
            .required("数量は必須です。")
            .integer("数量は整数で入力してください。"),
        inventoryDate: Yup.string()
            .nullable()
            .required('棚卸日は必須です。'),
        expirationDate: Yup.string()
            .nullable()
            .required('棚卸日は必須です。'),

    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ quantity: "", inventoryDate: null, expirationDate: null }}
                onSubmit={() => {
                    router.push("/admin/admin-management")
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
                    <div className={`${parentMainClass}`}>
                        <Button buttonProps={{
                            text: " 編集",
                            buttonClass: "text-primary",
                            bg: "bg-white",
                            hoverBg: "hover:bg-primary hover:text-white",
                            onClick: () => setVisible(true)
                        }} />
                        <Dialog className={`${modalClass}`}
                            draggable={draggable}
                            position={position || "top"}
                            header={header}
                            visible={visible}
                            onHide={() => setVisible(false)}
                            style={{ width: '600px' }}
                            {...restProps}
                        >
                            <div class={`${contentClass}`}>
                                <form onSubmit={handleSubmit}>
                                    <div className="">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full" text={"種別"} spanClass={"text-red-500"} spanText={"*"} />
                                        </div>
                                        <Select selectProps={{
                                            selectClass: "w-full",
                                            value: value,
                                            options: [options],
                                            onChange: onChange,
                                            placeholder: placeholder,
                                            readOnly: "true",
                                            disabled: "true"
                                        }} parentClass={selectParentClass} />

                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"備蓄品名"} spanClass={"p-error"} spanText={"*"} />
                                        </div>
                                        <Select selectProps={{
                                            selectClass: "w-full",
                                            value: value,
                                            options: options,
                                            onChange: onChange,
                                            placeholder: placeholder,
                                            readOnly: "true",
                                            disabled: "true"
                                        }} parentClass={selectParentClass} />

                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"保管期間"} spanText={"(日)"} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            keyfilter: "num",
                                            inputClass: "w-full",
                                            disabled: "true"
                                        }} />
                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"数量"} spanClass={"p-error"} spanText={"*"} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            name: 'quantity',
                                            keyfilter: "num",
                                            value: values.quantity,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            inputClass: "w-full",
                                        }} parentClass={`${errors.quantity && touched.quantity && 'p-invalid'} selectParentClass pb-1`} />
                                        <ValidationError errorBlock={errors.quantity && touched.quantity && errors.quantity} />
                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"棚卸日"} spanClass={"text-red-500"} spanText={"*"} />
                                        </div>
                                        <DateCalendar dateProps={{
                                            placeholder: "yy-mm-dd",
                                            name: "inventoryDate",
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            dateClass: "w-full"
                                        }} parentClass={`${errors.inventoryDate && touched.inventoryDate && 'p-invalid'} selectParentClass pb-1`} />
                                        <ValidationError errorBlock={errors.inventoryDate && touched.inventoryDate && errors.inventoryDate} />
                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"数量"} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            inputClass: "w-full",
                                        }} />
                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"有効期限"} spanClass={"text-red-500"} spanText={"*"} />
                                        </div>
                                        <DateCalendar dateProps={{
                                            name: "expirationDate",
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            placeholder: "yy-mm-dd",
                                            dateClass: "w-full"
                                        }} parentClass={`${errors.expirationDate && touched.expirationDate && 'p-invalid'} selectParentClass pb-1`} />
                                        <ValidationError errorBlock={errors.expirationDate && touched.expirationDate && errors.expirationDate} />
                                    </div>
                                    <div className="pt-3">
                                        <div className="pb-1">
                                            <NormalLabel labelClass="w-full pt-1" text={"備考"} />
                                        </div>
                                        <InputIcon inputIconProps={{
                                            inputClass: "w-full",
                                        }} />
                                    </div>
                                    <div className="p-dialog-footer pt-3">
                                        <div className="text-center">
                                            <Button buttonProps={{
                                                bg: "surface-500",
                                                hoverBg: "hover:surface-700",
                                                buttonClass: "evacuation_button_height border-white ",
                                                type: "button",
                                                text: "キャンセル",
                                                onClick: onClickTop
                                            }} parentClass={"inline"} />
                                            <Button buttonProps={{
                                                buttonClass: "evacuation_button_height",
                                                text: "追加",
                                                type: "submit",
                                                onClick: OnClickAddition
                                            }} parentClass={"inline"} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Dialog>
                    </div>
                )}
            </Formik>
        </>
    );
}

export default StockPileEditModal;