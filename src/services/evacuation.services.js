import toast from 'react-hot-toast';

import axios from '@/utils/api';


/* Identity and Access management (IAM) */
export const EvacuationServices = {
    getList: _getList,
    getPlaceDropdownList: _getPlaceDropdownList,
    exportEvacueesCSVList: _exportEvacueesCSVList,
    getFamilyEvacueesDetail: _getFamilyEvacueesDetail
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/evacuations', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error('Error fetching data:', error);
        });
}

/**
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportEvacueesCSVList(payload, callBackFun) {
    axios.post('/admin/evacuation/export', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
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
 * Get Place Dropdown List
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getPlaceDropdownList(payload, callBackFun) {
    axios.get('/admin/place/history/dropdown/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error('Error fetching data:', error);
        });
}

/**
 * Get Evacuees Family Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getFamilyEvacueesDetail(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.get(`/admin/evacuation/detail?${queryParams}`)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}