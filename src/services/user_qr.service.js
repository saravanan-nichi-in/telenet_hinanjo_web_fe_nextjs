import { toastDisplay } from "@/helper";
import axios from "@/utils/api";
import { isObject } from "lodash";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const UserQrService = {
    register: _register,
    create: _create
};

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _register(payload, callBackFun) {
    axios
        .post("/user/registration/qr/app", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
            }
        })
        .catch((error) => {
            toastDisplay(error.response);
            callBackFun(false);
        });
}

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
    axios
        .post("/user/registration/qr/app/checkin", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);

                if (response?.data?.success) {
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            }
        })
        .catch((error) => {
            toastDisplay(error.response);
            callBackFun(false);
        });
}
