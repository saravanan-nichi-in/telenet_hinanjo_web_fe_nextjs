import toast from 'react-hot-toast';

import axios from '@/utils/api';

/* Identity and Access management (IAM) */
export const DashboardServices = {
    getList: _getList,
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/user/family/search', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

