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
                callBackFun(response.data.data.data);
                if (response?.data?.success) {
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                } else {
                    toast.error(response?.data?.message, {
                        position: "top-right",
                    });
                }
            }
        })
        .catch((error) => {
            
            if (error.response && error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    // Join the error messages with line breaks
                    // Join the error messages with line breaks and add a comma at the end of each line, except the last one
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            } else {
                console.error(error.response.data.message);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
            callBackFun(error);
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
                callBackFun(response.data.data);

                if (response?.data?.success) {
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                } else {
                    toast.error(response?.data?.message, {
                        position: "top-right",
                    });
                }
            }
        })
        .catch((error) => {
            if (error.response && error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    // Join the error messages with line breaks
                    // Join the error messages with line breaks and add a comma at the end of each line, except the last one
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun();
                console.error(error);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}
