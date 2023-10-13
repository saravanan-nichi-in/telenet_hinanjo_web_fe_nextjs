import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { downloadBase64File } from '@/helper';

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
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, "qr_code_create.csv");
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
 */
function _callImport(payload, callBackFun) {
    axios.post('/admin/qrcreate/import', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Delete data
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
            console.log(error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Zip download
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
            console.log(error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}