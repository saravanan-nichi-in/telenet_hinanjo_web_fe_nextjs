import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'

import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DeleteModal, DividerComponent, NormalTable } from '@/components';
import { AdminMaterialService } from '@/helper/adminMaterialService';

export default function AdminMaterialPage() {
    const { localeJson } = useContext(LayoutContext);
    const [admins, setAdmins] = useState([]);
    const [checked1, setChecked1] = useState(false);
    const router = useRouter();
    const content = (
        <div>
            <p>一度削除したデータは、元に戻せません </p>
            <p>削除してもよろしいでしょうか？</p>
        </div>
    )
    const columns = [
        { field: 'ID', header: 'ID' },
        { field: '物資', header: '物資', minWidth: "20rem" },
        { field: '単位', header: '単位' },
        {
            field: 'actions',
            header: '削除',
            minWidth: "7rem",
            body: (rowData) => (
                <div>
                    <DeleteModal
                        buttonClass="text-primary"
                        bg="bg-white"
                        hoverBg="hover:bg-primary hover:text-white"
                        modalClass="w-50rem"
                        header="確認情報"
                        text="削除"
                        content={content}
                        position={"top"}
                        checked={checked1}
                        onChange={(e) => setChecked1(e.value)}
                        parentClass={"mt-3"}
                    />
                </div>
            ),
        }
    ];

    useEffect(() => {
        AdminMaterialService.getAdminsMaterialMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        <h5 className='page_header'>{translate(localeJson, 'material')}</h5>
                        <DividerComponent />
                        <div className="col-12">
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'import'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'export'),
                                    severity: "primary"
                                }} parentClass={"mr-1 mt-1"} />

                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height",
                                    text: translate(localeJson, 'signup'),
                                    onClick: () => router.push('/admin/material/create'),
                                    severity: "success"
                                }} parentClass={"mr-1 mt-1"} />
                            </div>
                            <div className='mt-3'>
                                <NormalTable paginator={"true"} showGridlines={"true"} rows={10} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admins} columns={columns} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}