import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { FaEyeSlash } from 'react-icons/fa';

import { getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DeleteModal, DividerComponent, InputSelect, NormalLabel, NormalTable } from '@/components';
import { AdminStockpileMasterService } from '@/helper/adminStockpileMaster';

export default function AdminStockPileMaster() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const [checked1, setChecked1] = useState(false);
    const router = useRouter();
    const columns = [
        { field: 'Sl No', header: 'Sl No', minWidth: "5rem" },
        { field: '備蓄品名', header: '備蓄品名', minWidth: "30rem" },
        { field: '種別', header: '種別', sortable: "true", minWidth: "10rem" },
        { field: '保管期間 (日)', header: '保管期間 (日)', minWidth: "10rem" },
        {
            field: 'actions',
            header: '画像	',
            minWidth: "5rem",
            body: (rowData) => (
                <div>
                    <FaEyeSlash style={{ fontSize: '20px' }} />
                </div>
            ),
        },
        {
            field: 'actions',
            header: '削除 ',
            minWidth: "10rem",
            body: (rowData) => (
                <div>
                    <DeleteModal
                        parentMainClass={"mt-2"}
                        style={{ minWidth: "50px" }}
                        modalClass="w-50rem"
                        header="確認情報"
                        position="top"
                        text="削除"
                        content={"避難所の運営状態を変更しますか？"}
                        checked={checked1}
                        onChange={(e) => setChecked1(e.value)}
                        parentClass={"mb-3 custom-switch"}
                    />
                </div>
            ),
        }
    ];

    useEffect(() => {
        AdminStockpileMasterService.getAdminsStockpileMasterMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'places')}</h5>
                        <DividerComponent />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />

                                <Button buttonProps={{
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'signup'),
                                    onClick: () => router.push('/admin/stockpile/master/create'),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div>
                                <form >
                                    <div className="pt-3">
                                        <div className='pb-1'>
                                            <NormalLabel
                                                text={"種別"} />
                                        </div>
                                        <InputSelect dropdownProps={{
                                            inputSelectClass: "create_input_stock"
                                        }}
                                        />
                                    </div>
                                    <div className="pt-3">
                                        <div className='pb-1'>
                                            <NormalLabel
                                                text={"備蓄品名"} />
                                        </div>
                                        <InputSelect dropdownProps={{
                                            inputSelectClass: "create_input_stock"
                                        }}
                                        />
                                    </div>
                                    <div className='flex pt-3' style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                                        <div >
                                            <Button buttonProps={{
                                                buttonClass: "evacuation_button_height",
                                                type: 'submit',
                                                text: translate(localeJson, 'update'),
                                                rounded: "true",
                                                severity: "primary"
                                            }} parentStyle={{ paddingLeft: "10px" }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='mt-3'>
                                <NormalTable responsiveLayout={"scrollable"} showGridlines={"true"} rows={10} paginator={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}