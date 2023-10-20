import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, importErrorToastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const AdminManagementServices = {
    callImport: _callImport,
    callExport: _callExport,
    callCreate: _callCreate,
    callGetList: _callGetList,
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
                // Handling import success && errors
                importErrorToastDisplay(response);
            }
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
    axios.post('/admin/material/supply/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Delete data
 * @param {*} callBackFun 
 */
function _callDelete(callBackFun) {
    axios.get('/admin/qrcreate/zip/delete')
        .then((response) => {
            if (response && response.data) {
                callBackFun(response);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            callBackFun(false);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}