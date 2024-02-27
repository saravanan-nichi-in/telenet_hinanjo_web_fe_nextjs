import React, { useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { FaArrowRightToBracket, FaArrowRightFromBracket } from "react-icons/fa6";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { ButtonRounded } from "@/components";
import { UserDashboardServices, CommonServices } from '@/services';
import { useAppDispatch } from '@/redux/hooks';
import { setUserDetails } from '@/redux/layout';

export default function PublicDashboard() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);

    /* Services */
    const { getListByID } = UserDashboardServices;
    const { decrypt } = CommonServices;

    useEffect(() => {
        updatePlaceDetails();
    }, []);

    /**
     * Update place details in redux / Place ID
     */
    const updatePlaceDetails = () => {
        // Get the URLSearchParams object from the window location
        const queryParams = new URLSearchParams(window.location.search);
        let key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
        let decryptedData = decrypt(queryParams.get('hinan'), key);
        if (decryptedData) {
            let payload = {
                id: decryptedData
            }
            getListByID(payload, (response) => {
                if (response && response.data) {
                    let obj = response.data.model;
                    obj['type'] = 'place';
                    let payload = Object.assign({}, layoutReducer?.user);
                    payload['place'] = obj;
                    dispatch(setUserDetails(payload));
                }
            })
        }
    }

    return (
        <>
            <div className="flex flex-1 w-full">
                <div className="grid w-full">
                    <div className="col-12 flex justify-content-center">
                        <div className="card h-full  w-full lg:w-9 flex flex-column justify-content-center">
                            <div className="flex flex-column justify-content-center align-item-center w-full" style={{ marginBottom: "40PX" }}>
                                <h5 className="text-center  user-dashboard-header"> {translate(localeJson, "user_dashboard_1")}</h5>
                                <div className="flex justify-content-center">
                                    <h5 className="user-dashboard-header" style={{ lineHeight: "32px" }}></h5>
                                    <h5 className="text-center header_clr user-dashboard-header white-space-nowrap overflow-hidden text-overflow-ellipsis">
                                        {`${locale === "en" && !_.isNull(layoutReducer?.user?.place?.name_en) ? layoutReducer?.user?.place?.name_en : layoutReducer?.user?.place?.name}`}
                                    </h5>
                                    <h5 className="user-dashboard-header" style={{ lineHeight: "32px" }}></h5>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className='flex' style={{ justifyContent: "center" }}>
                                        <div className="grid w-full">
                                            <div className="col-12 lg:col-6 md:col-6">
                                                <ButtonRounded buttonProps={{
                                                    type: "button",
                                                    rounded: "true",
                                                    custom: "user_Dashboard",
                                                    buttonClass: "flex align-items-center justify-content-center evacuation_button_height primary-button user_Dashboard",
                                                    text: layoutReducer?.user?.place?.type === "place"?translate(localeJson, 'admission_user_dashboard'):translate(localeJson,'admission_user_event_dashboard'),
                                                    icon: <FaArrowRightToBracket className="icon-dashboard"/>,
                                                    onClick: () => {
                                                        router.push({
                                                            pathname: 'register/member',
                                                        })
                                                    },
                                                }} parentClass={"user_Parent_Dashboard primary-button"} />
                                            </div>
                                            <div className="flex flex-column col-12 lg:col-6 md:col-6">
                                                <ButtonRounded buttonProps={{
                                                    type: 'button',
                                                    rounded: "true",
                                                    custom: "user_Dashboard",
                                                    buttonClass: "back-button flex align-items-center justify-content-center user_Dashboard",
                                                    text: layoutReducer?.user?.place?.type === "place"? translate(localeJson, 'exit_user_dashboard') : translate(localeJson, 'exit_user_event_dashboard'),
                                                    icon: <FaArrowRightFromBracket className="icon-dashboard"/>,
                                                    onClick: () => {
                                                        router.push({
                                                            pathname: '/user/checkout',
                                                        })
                                                    },
                                                }} parentClass={"flex align-items-center justify-content-center  user_Parent_Dashboard back-button"} />
                                                <div className={`${layoutReducer?.user?.place?.type === "place" ? '':'hidden'}`}>
                                                <p className={`mt-3 flex justify-content-center text-xs `}>
                                                    {translate(localeJson, 'user_dashboard_note')}
                                                </p>
                                                </div>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}