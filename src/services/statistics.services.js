import toast from 'react-hot-toast';

import axios from '@/utils/api';

/* Identity and Access management (IAM) */
export const StatisticsServices = {
    getList: _getList,
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/statistics', payload)
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