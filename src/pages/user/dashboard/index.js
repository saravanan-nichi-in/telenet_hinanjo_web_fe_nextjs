import React, { useEffect, useContext } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button } from "@/components";
import Link from "next/link";

export default function PublicDashboard() {
    const { localeJson, setLoader } = useContext(LayoutContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoader(false);
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5 className="page-header1">日比谷公園避難所</h5>
                        <hr />
                        <div>
                            <div className="mt-3">
                                <div className='flex' style={{ justifyContent: "center", flexWrap: "wrap" }}>
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        custom: "userDashboard",
                                        buttonClass: "evacuation_button_height",
                                        text: translate(localeJson, 'admission'),
                                        severity: "primary"
                                    }} parentClass={"ml-3 mr-3 mt-1 userParentDashboard "} />
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        custom: "userDashboard",
                                        buttonClass: "text-600",
                                        text: translate(localeJson, 'exit'),
                                        bg: "bg-white",
                                        hoverBg: "hover:bg-primary hover:text-white"
                                    }} parentClass={"ml-3 mr-3 mt-1 userParentDashboard"} />
                                </div>
                                <p className="p-error mt-3 flex justify-content-center" >
                                    {translate(localeJson, 'user_dashboard_note')}
                                </p>
                                <div className="text-link">
                                    <Link href="/staff/dashboard" className="mt-3 flex justify-content-end" >
                                        {translate(localeJson, 'go_to_staff_screen')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}