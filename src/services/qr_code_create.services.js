import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, importErrorToastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const QRCodeCreateServices = {
    callExport: _callExport,
    callImport: _callImport,
    callDelete: _callDelete,
    callZipDownload: _callZipDownload,
};

/**
 * Export data
 */
function _callExport() {
    axios.get('/admin/qrcreate/sample/export')
        .then((response) => {
            if (response && response.data) {
                if (response.data?.result?.filePath) {
                    let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date());
                    downloadBase64File(response.data.result.filePath, `Sample_${date}.csv`);
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
 * Import data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _callImport(payload, callBackFun) {
    axios.post('/admin/qrcreate/import', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response);
            }
        })
        .catch((error) => {
            callBackFun(false);
            // Handling import errors
            importErrorToastDisplay(error.response);
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

/**
 * Zip download
 * @param {*} callBackFun 
 */
function _callZipDownload(callBackFun) {
    axios.get('/admin/qrcreate/zip/download')
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
