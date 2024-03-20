import toast from 'react-hot-toast';

import axios from '@/utils/api';

export const UserDashboardServices = {
    getListByID: _getListByID,
    getEventListByID: _getEventListByID
};

/**
 * Get place information by place ID
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getListByID(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.get(`/place/detail?${queryParams}`)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error(error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get place information by place ID
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventListByID(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.get(`/user/event/dashboard?${queryParams}`)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error(error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}