import React, { useContext, useState } from "react";
import { useRouter } from 'next/router';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, ToggleSwitch } from "@/components";
// import { AuthenticationAuthorizationService } from '@/services';
// import Formik from "formik";
import * as Yup from "yup";


export default function PublicExternal() {
    const { localeJson } = useContext(LayoutContext);
    const schema = Yup.object().shape({
        toggleSwitches: Yup.array().of(Yup.boolean().required()),
    });
    const router = useRouter();
    // Getting storage data with help of reducers
    const [buttonStates, setButtonStates] = useState(Array(3).fill(false));

    const handleButtonClick = (index) => {
        const newButtonStates = [...buttonStates];
        newButtonStates.fill(false); // Uncheck all buttons
        newButtonStates[index] = true; // Check the clicked button
        setButtonStates(newButtonStates);
    };
    const toggleSwitchComponents = buttonStates.map((checked, index) => {
        const offLabel = index === 0 ? translate(localeJson, 'within_city') : index === 1 ? translate(localeJson, 'city_outskirts') : translate(localeJson, 'outside_prefecture');
        return (
            <ToggleSwitch
                key={index}
                checked={checked}
                onLabel={offLabel}
                offLabel={offLabel}
                parentClass={"w-11rem"}
                onChange={() => handleButtonClick(index)}
            />
        );
    });
    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5 className="page-header1 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                            {translate(localeJson, 'public_external')}
                        </h5>
                        <hr />
                        <div>
                            <h5 className="page-header2 ">
                                {translate(localeJson, 'not_visiting_the_shelter')}
                            </h5>
                            <div className="mt-3 mb-3">
                                <p>{translate(localeJson, 'which_place_Are_you_planning_to_evacuate')}
                                    <span className="p-error">*</span>
                                </p>
                            </div>
                            <form>
                                <div className=" flex flex-wrap justify-content-start gap-3">
                                    {toggleSwitchComponents}
                                </div>
                                <div className="mt-3">
                                    <Button buttonProps={{
                                        type: 'submit',
                                        buttonClass: "w-8rem",
                                        text: translate(localeJson, 'continue'),
                                    }} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}