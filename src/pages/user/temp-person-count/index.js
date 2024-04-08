import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, CustomHeader, PersonCountButton, ToggleSwitch } from "@/components";
import { useAppDispatch } from "@/redux/hooks";
import { clearExceptPlaceId } from "@/redux/tempRegister";

const PersonCountScreen = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { localeJson, locale } = useContext(LayoutContext);
    const [buttonStates, setButtonStates] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
    const [personCount, setPersonCount] = useState("");
    const dispatch = useAppDispatch()

    // Define a function to handle selection changes
    const handleSingleSelectionChange = (selectedName) => {
        setPersonCount(selectedName)
    };
    const handleNextButtonClick = () => {
        if (!personCount) {
            // Person count not selected, show alert
            window.alert(translate(localeJson, 'please_select_person_count'));
        } else {
            dispatch(clearExceptPlaceId());
            // Person count selected, proceed with navigation
            localStorage.setItem("personCount", personCount);
            router.push('/user/temp-register');
        }
    };

    useEffect(()=>{
        dispatch(clearExceptPlaceId());
    },[])

    return (
        <div className='grid flex-1'>
            <div className='col-12 flex-1'>
                <div className='card h-full'>
                    <CustomHeader headerClass={`page-header1`} header={translate(localeJson, "house_hold_evacuee")} />
                    <div className="flex flex-column h-full align-items-center justify-content-center text-2xl" >
                        <div style={{ maxWidth: "330px" }}>
                            <div className=''>
                                <CustomHeader customParentClassName={"mb-0"} headerClass={`${locale == "en" ? "pt-4" : "pt-0"} font-bold`} header={translate(localeJson, "evacuee_count")} />
                                {/* <p style={{fontWeight: "bold"}}><span style={{ borderLeft: '4px solid black', paddingLeft: '3px', fontWeight: "bold",lineHeight:"5px" }}></span> {translate(localeJson, "evacuee_count")}</p> */}
                            </div>
                            <div className=''>
                                <p className='pb-0' style={{ fontSize: "16px" }}>{translate(localeJson, "person_count_evacuated")}
                                </p>
                            </div>

                            <div className=" flex flex-wrap justify-content-center">
                                <PersonCountButton names={buttonStates}
                                    onSelectionChange={handleSingleSelectionChange}
                                    customClassName={"text-3xl"}
                                    customParentClassName={" w-full gap-person-count"} />
                            </div>
                            <div className="pt-2 pb-2">
                                <Button buttonProps={{
                                    buttonClass: "w-full primary-button ",
                                    type: "button",
                                    text: translate(localeJson, 'next'),
                                    severity: "primary",
                                    custom: "person-count-button",
                                    onClick: handleNextButtonClick,
                                }}
                                    parentClass="w-full pb-2 pt-2 primary-button" />
                                {/* <Button buttonProps={{
                                    custom: "person-count-button",
                                    buttonClass: "w-full back-button",
                                    text: translate(localeJson, 'return_hiragana'),
                                    onClick: () => { router.push('/user/temp-register/member') },
                                }}
                                    parentClass="w-full pt-2 pb-2 back-button " /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PersonCountScreen;
