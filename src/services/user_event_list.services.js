import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { importErrorToastDisplay } from '@/helper';

export const UserEventListServices = {
    getEventsList: _getEventsList,
    createUserEvent: _createUserEvent
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


/**
 * Get user events list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _createUserEvent(payload, callBackFun) {
    axios.post('/user/event/checkin/manual', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun();
            importErrorToastDisplay(error?.response?.data?.message);
        });
}