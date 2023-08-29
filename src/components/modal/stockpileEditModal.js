import React, { useState } from "react"
import { Dialog } from 'primereact/dialog';
import Btn from "../button/btn";
import { NormalLabel } from "../label";
import { Select } from "../dropdown";
import { InputIcon } from "../input";
import { DateCalendar } from "../date&time";

const StockPileEditModal = (props) => {
    const { parentMainClass, modalClass, draggable,
        position, contentClass, value, options,
        onChange, placeholder, selectParentClass, onClickTop, OnClickAddition } = props
    const [visible, setVisible] = useState(false);

    const header = (
        <div>
            <h6 style={{ fontWeight: "600" }} className="page_header">新規登録</h6>
        </div>
    )

    const footer = (
        <div className="text-center pt-1">
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
                text: " 編集",
                buttonClass: "text-primary",
                bg: "bg-white",
                hoverBg: "hover:bg-primary hover:text-white",
                onClick: () => setVisible(true)
            }} />
            <Dialog className={`${modalClass}`} draggable={draggable} position={"top" || position} header={header} footer={footer} visible={visible} onHide={() => setVisible(false)} style={{ width: '600px', padding: "10px" }} >
                <div class={`${contentClass}`}>
                    <form>
                        <div className="stock_modal">
                            <NormalLabel labelClass="w-full pt-1" text={"種別"} spanClass={"text-red-500"} spanText={"*"} />
                            <Select selectProps={{
                                selectClass: "dropdown_select_stock",
                                value: value,
                                options: [options],
                                onChange: onChange,
                                placeholder: placeholder,
                                readOnly: "true",
                                disabled: "true"
                            }} parentClass={selectParentClass} />

                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"備蓄品名"} spanClass={"text-red-500"} spanText={"*"} />
                            <Select selectProps={{
                                selectClass: "dropdown_select_stock",
                                value: value,
                                options: options,
                                onChange: onChange,
                                placeholder: placeholder,
                                readOnly: "true",
                                disabled: "true"
                            }} parentClass={selectParentClass} />

                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"保管期間"} spanText={"(日)"} />
                            <InputIcon inputIconProps={{
                                keyfilter: "num",
                                inputClass: "input_stock",
                                disabled: "true"
                            }} />
                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"数量"} spanClass={"text-red-500"} spanText={"*"} />
                            <InputIcon inputIconProps={{
                                keyfilter: "num",
                                inputClass: "input_stock",
                            }} />
                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"棚卸日"} spanClass={"text-red-500"} spanText={"*"} />
                            <DateCalendar dateProps={{
                                placeholder: "yy-mm-dd",
                                dateClass: "input_stock"
                            }} />
                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"数量"} />
                            <InputIcon inputIconProps={{
                                inputClass: "input_stock",
                            }} />
                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"有効期限"} spanClass={"text-red-500"} spanText={"*"} />
                            <DateCalendar dateProps={{
                                placeholder: "yy-mm-dd",
                                dateClass: "input_stock"
                            }} />
                        </div>
                        <div className="stock_modal pt-3">
                            <NormalLabel labelClass="w-full pt-1" text={"備考"} />
                            <InputIcon inputIconProps={{
                                inputClass: "input_stock",
                            }} />
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}
export default StockPileEditModal