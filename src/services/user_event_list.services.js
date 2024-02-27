import toast from 'react-hot-toast';

import axios from '@/utils/api';

export const UserEventListServices = {
    getEventsList: _getEventsList,
};

/**
 * Get user events list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventsList(payload, callBackFun) {
    axios.post('/user/event/list', payload)
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