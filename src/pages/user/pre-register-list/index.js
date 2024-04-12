import React, { useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button, CustomHeader, BarcodeDialog, PreRegisterConfirmDialog } from '@/components';
import { setSelfID } from "@/redux/self_id";
import { useAppDispatch } from "@/redux/hooks";
import { TempRegisterServices } from '@/services';

export default function HitachiList() {
    const { localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [openBarcodeDialog, setOpenBarcodeDialog] = useState(false);
    const [yappleID, setYappleID] = useState(null);
    const [ppid, setPpid] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [openBarcodeConfirmDialog, setOpenBarcodeConfirmDialog] = useState(false);
    const [registrationData, setRegistrationData] = useState({
        lgwanID: null,
        isRegistered: null
    });
    const [defaultEventData, setDefaultEventData] = useState({
        remarks: "避難所事前登録をしておくことで、マイナンバーカード、やっぷるカード(ID)を利用して、避難情報を読み込むことができます。"
    })

    const { getdefaultEventData, getBasicDetailsInfo, autoCheckoutEvacuee } = TempRegisterServices;

    useEffect(() => {
        const windowURL = window.location.pathname;
        setYappleID(getCookie("city_id"))
        setPpid(getCookie("ppid"))
        setUserProfile(getCookie("profile"))
        const windowURLSplitted = windowURL.split('/');
        const clientDomain = "shelter.biz.cityos-dev.hitachi.co.jp";
        if (windowURLSplitted[2] != clientDomain) {
            const fetchData = async () => {
                await onGetTempRegisterDefaultEvent()
            }
            fetchData()
        }

    }, []);

    const validateAndMoveToForm = (id) => {
        triggerPreRegisterConfirmation(id);
        dispatch(setSelfID({
            id: id,
            ppid: ppid
        }));
    }

    const onGetTempRegisterDefaultEvent = () => {
        getdefaultEventData((response) => {
            if (response.success) {
                const data = response.data.model;
                if (data) {
                    setDefaultEventData({
                        remarks: data.remarks
                    })
                }
            }
        })
    }

    const triggerPreRegisterConfirmation = (id) => {
        if (id == null) {
            toast.error(translate(localeJson, 'no_data_in_request_header'), {
                position: "top-right",
            });
            return;
        }
        let payload = {
            "ppid": "",
            "yapple_id": id ? id : ""
        };
        if (id == null) {
            toast.error(translate(localeJson, 'no_data_in_request_header'), {
                position: "top-right",
            });
            return;
        }
        dispatch(setSelfID({
            id: id,
            ppid: ppid
        }));
        getBasicDetailsInfo(payload, (response) => {
            if (response.code == "ERR_NETWORK") {
                toast.error(translate(localeJson, 'base_info_connection_error'), {
                    position: "top-right",
                });
            }
            else if (response.success) {
                const data = response.data;
                let lgwanID = data.lgwan_familiy_id;
                let isRegistered = data.is_registered;
                if (lgwanID && isRegistered == 1) {
                    setRegistrationData({
                        lgwanID: lgwanID,
                        isRegistered: isRegistered,
                        place_id: data.place_id
                    });
                    setOpenBarcodeConfirmDialog(true);
                }
                else {
                    router.replace('/user/pre-register');
                }
            }
        })
    }

    const proceedToAutoCheckout = () => {
        setOpenBarcodeConfirmDialog(false);
        let payload = {
            lgwan_family_id: registrationData.lgwanID,
            place_id: registrationData.place_id
        }
        autoCheckoutEvacuee(payload, (response) => {
            if (response.success) {
                router.replace('/user/pre-register');
            }
        })
    }

    const getCookie = (cookieName) => {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }

    const onClickReturn = () => {
        router.push({
            pathname: `${process.env.NEXT_PUBLIC_PRODUCTION_HOST}`,
            target: '_blank'
        })
    }

    return (
        <>
            <div>
                <BarcodeDialog header={translate(localeJson, "barcode_dialog_heading")}
                    visible={openBarcodeDialog} setVisible={setOpenBarcodeDialog}
                    validateAndMoveToTempReg={(data) => validateAndMoveToForm(data)}
                ></BarcodeDialog>
                <PreRegisterConfirmDialog header={translate(localeJson, "c_temp_register_status")}
                    visible={openBarcodeConfirmDialog}
                    setVisible={setOpenBarcodeConfirmDialog}
                    doAutoCheckout={proceedToAutoCheckout}
                />
                <div className="grid col-12 justify-content-center">
                    <div className="col-12 sm:col-12 md:col-10 lg:col-8">
                        <div className="card">
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "hitachi_list_main_heading")} />
                            <div>
                                <h6 className="mt-2">{defaultEventData.remarks}</h6>
                                <p className='text-red-500 mt-3'>{translate(localeJson, 'pre_register_main_list_note')}</p>
                            </div>
                            <div className={userProfile == '[yabu_cityworker]' ? 'mt-6' : 'mt-8 pt-8'}>
                                <div className={`p-2 w-12 text-center ${userProfile == '[yabu_cityworker]' ? '' : 'mt-5 pt-5'}`}>
                                    <div className=''>
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'c_temp_register'),
                                            buttonClass: "multi-form-submit border-round-lg w-12 sm:w-10 md:w-6 lg:w-5",
                                            rounded: true,
                                            onClick: () => {
                                                if (window.location.origin === "https://hitachi.nichi.in" || window.location.origin === "http://localhost:3000" || window.location.origin === "https://hitachi-dev-delta.vercel.app") {
                                                    triggerPreRegisterConfirmation("357703");
                                                } else {
                                                    triggerPreRegisterConfirmation(yappleID);
                                                }
                                            }
                                        }} parentClass={"p-2"} />
                                        {userProfile == '[yabu_cityworker]' &&
                                            (
                                                <div>
                                                    <Button buttonProps={{
                                                        type: "button",
                                                        text: translate(localeJson, 'to_staff_screen'),
                                                        buttonClass: "multi-form-submit border-round-lg w-12 sm:w-10 md:w-6 lg:w-5",
                                                        rounded: true,
                                                        onClick: () => router.push("/user/list")
                                                    }} parentClass={"p-2"} />
                                                    <Button buttonProps={{
                                                        type: "button",
                                                        text: translate(localeJson, 'to_head_staff'),
                                                        buttonClass: "multi-form-submit border-round-lg w-12 sm:w-10 md:w-6 lg:w-5",
                                                        rounded: true,
                                                        onClick: () => router.push("/hq-staff/login")
                                                    }} parentClass={"p-2"} />
                                                    <Button buttonProps={{
                                                        type: "button",
                                                        text: translate(localeJson, 'to_admin'),
                                                        buttonClass: "multi-form-submit border-round-lg w-12 sm:w-10 md:w-6 lg:w-5",
                                                        rounded: true,
                                                        onClick: () => router.push("/admin/login")
                                                    }} parentClass={"p-2"} />
                                                </div>
                                            )}
                                        <Button buttonProps={{
                                            type: "button",
                                            text: translate(localeJson, 'back'),
                                            buttonClass: "multi-form-submit return w-12 sm:w-10 md:w-6 lg:w-5",
                                            rounded: true,
                                            onClick: () => onClickReturn()
                                        }} parentClass={"p-2 back-button"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>);
}