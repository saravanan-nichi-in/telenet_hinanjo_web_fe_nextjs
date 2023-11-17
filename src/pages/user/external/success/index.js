
import {
    Button,
} from "@/components";
import { LayoutContext } from "@/layout/context/layoutcontext";
import React, { useContext, useEffect, useState, useRef } from "react";
import { getValueByKeyRecursively as translate } from "@/helper";
import { useRouter } from "next/router";
const RefugeeRegistrationPage = () => {
    const { locale, localeJson, setLoader } = useContext(LayoutContext);
    const router = useRouter()
    return (
        <div className='grid flex-1'>
            <div className='col-12 flex-1'>
                <div className='card flex flex-column h-full align-items-center justify-content-center'>
                    <p className="page-header1">{translate(localeJson,"reg_success")}</p>
                    <p className="sub-header">{translate(localeJson,"stay_safe")}</p>
                    <div>
                        <Button buttonProps={{
                            type: "button",
                            buttonClass: "w-8rem",
                            severity:"primary",
                            text: translate(localeJson, 'close'),
                            onClick: () => router.push('/user/external'),
                        }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefugeeRegistrationPage;
