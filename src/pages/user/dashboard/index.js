import React, { useContext } from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import crypto from 'crypto';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button } from "@/components";
import { AuthenticationAuthorizationService } from '@/services';

export default function PublicDashboard() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);

    const encryptId = (id, key) => {
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let encryptedId = cipher.update(id.toString(), 'utf-8', 'hex');
        encryptedId += cipher.final('hex');
        return encryptedId;
    };

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5 className="page-header1 white-space-nowrap overflow-hidden text-overflow-ellipsis">{locale === "en" && !_.isNull(layoutReducer?.user?.place?.name_en) ? layoutReducer?.user?.place?.name_en : layoutReducer?.user?.place?.name}</h5>
                        <hr />
                        <div>
                            <div className="mt-3">
                                <div className='flex' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                                    <Button buttonProps={{
                                        type: "button",
                                        rounded: "true",
                                        custom: "userDashboard",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'admission'),
                                        severity: "primary",
                                        onClick: () => {
                                            router.push({
                                                pathname: 'register/member',
                                            })
                                        },
                                    }} parentClass={"ml-3 mr-3 mt-1 userParentDashboard "} />
                                    <Button buttonProps={{
                                        type: 'button',
                                        rounded: "true",
                                        custom: "userDashboard",
                                        buttonClass: "text-600",
                                        text: translate(localeJson, 'exit'),
                                        bg: "bg-white",
                                        hoverBg: "hover:surface-500 hover:text-white",
                                        onClick: () => {
                                            router.push({
                                                pathname: '/user/checkout',
                                            })
                                        },
                                    }} parentClass={"ml-3 mr-3 mt-1 userParentDashboard"} />
                                </div>
                                <p className="p-error mt-3 flex justify-content-center" style={{fontWeight:"bold"}}>
                                    {translate(localeJson, 'user_dashboard_note')}
                                </p>
                                <div className="mt-3 flex justify-content-end text-higlight clickable-row" onClick={() => {
                                    if (_.isNull(AuthenticationAuthorizationService.staffValue)) {
                                        router.push({
                                            pathname: '/staff/login',
                                            query: { hinan: encryptId("yourData", "sample") },
                                        });
                                    } else {
                                        router.push({
                                            pathname: '/staff/dashboard',
                                        });
                                    }
                                }}>
                                    {translate(localeJson, 'go_to_staff_screen')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}