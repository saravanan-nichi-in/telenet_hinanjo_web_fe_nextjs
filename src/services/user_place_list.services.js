import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

export const UserPlaceListServices = {
    getList: _getList,
    getActiveList: _getActiveList
};

/**
 * Get user places list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/user/place/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get user Active places list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getActiveList(payload, callBackFun) {
    axios.post('/user/place/detail', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
        });
}