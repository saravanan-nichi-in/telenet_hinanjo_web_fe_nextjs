import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { downloadBase64File } from '@/helper';

/* Identity and Access management (IAM) */
export const QRCodeCreateServices = {
    callExport: _calExport,
    callImport: _calImport,
};

/**
 * Export data
 */
function _calExport() {
    axios.get('/admin/qrcreate/sample/export')
        .then((response) => {
            if (response && response.data && response.data.result.file) {
                downloadBase64File(response.data.result.file, "qr_code_create.csv");
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
function _calImport(payload, callBackFun) {
    axios.post('/admin/qrcreate/import', payload)
        .then((response) => {
            console.log(response);
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