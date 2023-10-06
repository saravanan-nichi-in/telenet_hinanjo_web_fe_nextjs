import React, { useState, useEffect, useContext } from 'react';
import { AiFillEye } from 'react-icons/ai';

import { RowExpansionTable, Button, InputSwitch } from '@/components';
import { StockpileSummaryService } from '@/helper/adminStockpileSummaryService';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputSelectFloatLabel } from '@/components/dropdown';
import { StockPileSummaryMailSettingsModal, StockpileSummaryImageModal } from '@/components/modal';
import { summaryShelterOptions } from '@/utils/constant';

function AdminStockpileSummary() {
    const { localeJson, setLoader } = useContext(LayoutContext);
    const [emailModal, setEmailModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [stockpileSummary, setStockpileSummary] = useState([]);
    const [shelterSelect, setShelterSelect] = useState(summaryShelterOptions[0]);
    const stockPilerMainRow = [
        {
            field: "避難所", header: "避難所", minWidth: "10rem", textAlign: "left", body: (rowData) => (
                <a className='text-decoration' style={{ color: "grren" }} onClick={() => setEmailModal(true)}>
                    {rowData['避難所']}
                </a>
            )
        },
        { field: "通知先", header: "通知先" },
    ]
    const stockPileRowExpansionColumn = [
        { field: "種別", header: "種別" },
        { field: "備蓄品名", header: "備蓄品名" },
        { field: "数量", header: "数量" },
        {
            field: 'actions',
            header: '画像',
            textAlign: "center",
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <AiFillEye style={{ fontSize: '20px' }} onClick={() => setImageModal(true)} />
                </div>
            ),
        },
    ]
    const innerColumn1 = [
        { field: "種別", header: "種別" },
        { field: "備蓄品名", header: "備蓄品名" },
        { field: "数量", header: "有効期限" },
        {
            field: 'actions',
            header: '画像',
            textAlign: "center",
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <AiFillEye style={{ fontSize: '20px' }} onClick={() => setImageModal(true)} />
                </div>
            ),
        },
    ]

    useEffect(() => {
        const fetchData = async () => {
            await StockpileSummaryService.getStockpileSummaryWithOrdersSmall().then((data) => setStockpileSummary(data));
            setLoader(false);
        };
        fetchData();
    }, []);

    /**
    * Image setting modal close
   */
    const onImageModalClose = () => {
        setImageModal(!imageModal);
    };
    /**
    * Email setting modal close
   */
    const onEmailModalClose = () => {
        setEmailModal(!emailModal);
    };
    /**
     * 
     * @param {*} values 
     */
    const onRegister = (values) => {
        setEmailModal(false);
    };

    return (
        <React.Fragment>
            <StockpileSummaryImageModal
                open={imageModal}
                close={onImageModalClose}
            />
            <StockPileSummaryMailSettingsModal
                open={emailModal}
                close={onEmailModalClose}
                register={onRegister}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <h5 className='page-header1'>
                            {translate(localeJson, 'stockpile_summary')}
                        </h5>
                        <hr />
                        <div >
                            <div class="mb-3" >
                                <div class="summary_flex input-switch-summary w-13rem">
                                    {translate(localeJson, 'display_in_registration_screen')}<InputSwitch inputSwitchProps={{
                                        checked: false,
                                    }}
                                    />
                                </div>
                                <div>
                                    <form>
                                        <div class="summary_flex_search float-right mt-5" >
                                            <div class="flex flex-row justify-content-end" >
                                                <InputSelectFloatLabel dropdownFloatLabelProps={{
                                                    text: translate(localeJson, 'shelter_place'),
                                                    inputId: "float label",
                                                    optionLabel: "name",
                                                    options: summaryShelterOptions,
                                                    value: shelterSelect,
                                                    onChange: (e) => setShelterSelect(e.value),
                                                    inputSelectClass: "w-full lg:w-13rem md:w-20rem sm:w-14rem"
                                                }} parentClass={"w-full xl:20rem lg:w-13rem md:w-14rem sm:w-14rem"}
                                                />

                                            </div>
                                            <div>
                                                <Button buttonProps={{
                                                    buttonClass: "w-12 search-button",
                                                    text: translate(localeJson, "search_text"),
                                                    icon: "pi pi-search",
                                                    severity: "primary"
                                                }} />
                                            </div>
                                            <div class="flex justify-content-end">
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    rounded: "true",
                                                    buttonClass: "",
                                                    text: translate(localeJson, 'export'),
                                                    severity: "primary"
                                                }} parentClass={"mr-1 mt-2 mb-2"} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div>
                            <RowExpansionTable rows={10} columnStyle={{ textAlign: 'left' }} paginator="true" paginatorLeft={true} customRowExpansionActionsField="actions" value={stockpileSummary} innerColumn1={innerColumn1} innerColumn={stockPileRowExpansionColumn} outerColumn={stockPilerMainRow} rowExpansionField1="orders1" rowExpansionField="orders" />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AdminStockpileSummary;