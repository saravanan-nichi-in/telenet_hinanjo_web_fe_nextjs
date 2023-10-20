import toast from 'react-hot-toast';
import { isArray, isObject } from "lodash";

import axios from '@/utils/api';
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, importErrorToastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const AdminManagementServices = {
    callImport: _callImport,
    callExport: _callExport,
    callCreate: _callCreate,
    callGetList: _callGetList,
    callUpdate: _callUpdate,
    callDelete: _callDelete,
};

/**
 * Import data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _callImport(payload, callBackFun) {
    axios.post('/admin/management/import', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response);
            }
            // Handling import success && errors
            importErrorToastDisplay(response);
        })
        .catch((error) => {
            callBackFun(false);
            // Handling import errors
            importErrorToastDisplay(error.response);
        });
}

/**
 * Export data
 * @param {*} payload 
 */
function _callExport(payload) {
    axios.post('/admin/management/export', payload)
        .then((response) => {
            if (response && response.data) {
                if (response.data?.result?.filePath) {
                    let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date());
                    downloadBase64File(response.data.result.filePath, `Admin_management_${date}.csv`);
                }
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _callGetList(payload, callBackFun) {
    axios.post('/admin/management/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Create data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _callCreate(payload, callBackFun) {
    axios.post('/admin/management/store', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
            toast.success(response?.data?.message, {
                position: "top-right",
            });
        })
        .catch((error) => {
            if (error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    callBackFun(false);
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun(false);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}

/**
 * Update data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _callUpdate(payload, callBackFun) {
    axios.post('/admin/management/update', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
            toast.success(response?.data?.message, {
                position: "top-right",
            });
        })
        .catch((error) => {
            if (error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    callBackFun(false);
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun(false);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}

/**
 * Delete data
 * @param id
 * @param {*} callBackFun 
 */
function _callDelete(id, callBackFun) {
    axios.delete('/admin/management/delete', { data: { "id": id } })
        .then((response) => {
            if (response && response.data) {
                callBackFun(response);
            }
            toast.success(response?.data?.message, {
                position: "top-right",
            });
        })
        .catch((error) => {
            if (error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    callBackFun(false);
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun(false);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}