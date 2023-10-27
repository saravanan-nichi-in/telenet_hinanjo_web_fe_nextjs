import React, { useEffect, useContext } from "react";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, InputSwitch } from "@/components";
import Link from "next/link";

export default function Admission() {
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
                        <h5 className="page-header1">{translate(localeJson, 'new_to_admission_procedures')}</h5>
                        <hr />
                        <div>
                            <div className="mt-3">
                                <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                    <Button buttonProps={{
                                        type: 'submit',
                                        rounded: "true",
                                        buttonClass: "text-600 ",
                                        text: translate(localeJson, 'exit_procedure'),
                                        bg: "bg-white",
                                        hoverBg: "hover:surface-500 hover:text-white"
                                    }} parentClass={"ml-3 mr-3 mt-1"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}