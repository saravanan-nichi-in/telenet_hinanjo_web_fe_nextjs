import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { downloadBase64File } from '@/helper';

/* Identity and Access management (IAM) */
export const ShortageSuppliesServices = {
    getList: _getList,
    calExport: _calExport,
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/dashboard', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Export data
 */
function _calExport() {
    axios.get('/admin/material/supply/export')
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, "shortage_supplies.csv");
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