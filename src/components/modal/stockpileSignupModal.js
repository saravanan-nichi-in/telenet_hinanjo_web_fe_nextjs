import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import Btn from "../button/btn";
import { NormalLabel } from "../label";
import { Select } from "../dropdown";
import { InputIcon } from "../input";
import { FileUpload } from "../upload";
const StockSignupModal = (props) => {
    const { parentMainClass, modalClass, draggable,
        position, contentClass, value, options, onChange, placeholder,
        selectParentClass, onClickTop, OnClickAddition } = props
    const [visible, setVisible] = useState(false);

    const header = (
        <div>
            <h6 style={{ fontWeight: "600" }} className="page_header">新規登録</h6>
        </div>
    )

    const footer = (
        <div className="text-center">
            <Btn btnProps={{
                bg: "surface-500",
                hoverBg: "w-50 h-4rem hover:surface-700",
                buttonClass: "border-white",
                text: "キャンセル",
                onClick: onClickTop
            }} parentClass={"inline"} />
            <Btn btnProps={{
                buttonClass: "w-50 h-4rem button_stock",
                text: "追加",
                onClick: OnClickAddition
            }} parentClass={"inline"} />
        </div>
    );
    return (
        <div className={`${parentMainClass}`}>
            <Btn btnProps={{
                text: "新規登録",
                rounded: "true",
                buttonClass: "border-green-500",
                bg: "bg-green-500",
                hoverBg: "hover:bg-green-600",
                onClick: () => setVisible(true)
            }} />
            <Dialog className={`${modalClass}`} draggable={draggable} position={position || "top"} header={header} footer={footer} visible={visible} onHide={() => setVisible(false)} style={{ width: '600px', padding: "10px" }} >
                <div class={`${contentClass}`}>
                    <form>
                        <div className="stock_modal">
                            <NormalLabel labelClass="w-full pt-1" text={"種別"} spanClass={"text-red-500"} spanText={"*"} />
                            <Select selectProps={{
                                selectClass: "dropdown_select_stock",
                                value: value,
                                options: options,
                                onChange: onChange,
                                placeholder: placeholder
                            }} parentClass={selectParentClass} />

                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"備蓄品名"} spanClass={"text-red-500"} spanText={"*"} />
                            <Select selectProps={{
                                selectClass: "dropdown_select_stock",
                                value: value,
                                options: options,
                                onChange: onChange,
                                placeholder: placeholder
                            }} parentClass={selectParentClass} />

                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"保管期間"} spanText={"(日)"} />
                            <InputIcon inputIconProps={{
                                keyfilter: "num",
                                inputClass: "input_stock"
                            }} />
                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"画像"} />
                            <FileUpload />
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}
export default StockSignupModal