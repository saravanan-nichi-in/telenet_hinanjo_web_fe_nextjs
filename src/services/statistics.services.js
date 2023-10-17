import toast from 'react-hot-toast';

import axios from '@/utils/api';

/* Identity and Access management (IAM) */
export const StatisticsServices = {
    getList: _getList,
};

/**
 * Get statistics list
 * @param {*} callBackFun 
 */
function _getList(callBackFun) {
    axios.get('/admin/statistics')
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