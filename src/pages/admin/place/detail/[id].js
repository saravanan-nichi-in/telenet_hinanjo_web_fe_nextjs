import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, DividerComponent, GoogleMapComponent, NormalTable } from '@/components';
// import { AdminManagementService } from '@/helper/adminManagementService';
import { AdminPlaceDetailService } from '@/helper/adminPlaceDetailService';

export default function StaffManagementEditPage() {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const [admin, setAdmins] = useState([]);
    const router = useRouter();

    const columns = [
            { field: '避難所', header: '避難所',minWidth:"10rem"},
            { field: '郵便番号', header: '郵便番号',minWidth:"9rem" },
            { field: '住所', header: '住所',minWidth:"11rem" },
            { field: '初期郵便番号', header: '初期郵便番号',minWidth:"10rem" },
            { field: '避難可能人数', header: '避難可能人数',minWidth:"9rem" },
            { field: '電話番号', header: '電話番号',minWidth:"7rem" },
            { field: '緯度 / 経度', header: '緯度 / 経度',minWidth:"7rem" },
            { field: 'URL', header: 'URL',minWidth:"2rem" },
            { field: 'スマートフォン登録URL', header: 'スマートフォン登録URL',minWidth:"2rem" },
            { field: '海抜', header: '海抜',minWidth:"2rem" },
            { field: '状態', header: '状態',minWidth:"5rem" },
    ]

    useEffect(() => {
        AdminPlaceDetailService.getAdminsPlaceDetailMedium().then((data) => setAdmins(data));
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <section className='col-12'>
                        {/* Header */}
                        <h5 className='page_header'>スタッフ詳細情報</h5>
                        <DividerComponent />
                        <div>
                            <div className=' col-12 flex' style={{ justifyContent: "start", flexWrap: "wrap" }} >
                                <div className='col-6' style={{overflowX:"auto"}}>
                                <NormalTable showGridlines={"true"} columnStyle={{ textAlign: 'center' }} customActionsField="actions" value={admin} columns={columns} />
                                </div>
                            
                            <div className='col-6'>
            <GoogleMapComponent
                initialPosition={{ "lat": 51.505, "lng": -0.09 }}
            />
        </div>
        </div>
                            <div className='flex pt-3 pb-3' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                                <div>
                                    <Button buttonProps={{
                                        buttonClass: "text-600 border-500 evacuation_button_height",
                                        bg: "bg-white",
                                        type: "button",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        text: translate(localeJson, 'cancel'),
                                        rounded: "true",
                                        severity: "primary"
                                    }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                </div>
                                <div >
                                    <Button buttonProps={{
                                        buttonClass: "evacuation_button_height",
                                        type: 'button',
                                        onClick: () => router.push('/admin/admin-management/edit/1'),
                                        text: translate(localeJson, 'update'),
                                        rounded: "true",
                                        severity: "primary"
                                    }} parentStyle={{ paddingTop: "10px", paddingLeft: "10px" }} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}