import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DeleteModal, DividerComponent, NormalTable } from '@/components';
import { AdminPlaceService } from '@/helper/adminPlaceService';
export default function AdminPlacePage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const [checked1, setChecked1] = useState(false);
    const router = useRouter();

    const columns = [
        { field: 'ID', header: 'ID' },
        { field: '避難所', header: '避難所', minWidth: "20rem" },
        { field: '住所', header: '住所' },
        { field: '避難可 能人数', header: '避難可  能人数', minWidth: "10rem" },
        { field: '電話番号', header: '電話番号' },
        {
            field: 'actions',
            header: '状態',
            body: (rowData) => (
                <div>
                    <DeleteModal
                        parentMainClass={"mt-2"}
                        style={{ minWidth: "50px" }}
                        modalClass="w-50rem"
                        header="確認情報"
                        position="top"
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
        AdminPlaceService.getAdminsPlaceMedium().then((data) => setAdmins(data));

    }, []);


    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>{translate(localeJson, 'places')}</h5>
                        <DividerComponent />
                        <div className="col-12">
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
                                    onClick: () => router.push('/admin/place/create'),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div className='mt-3'>
                                <NormalTable showGridlines={"true"} rows={10} paginator={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}