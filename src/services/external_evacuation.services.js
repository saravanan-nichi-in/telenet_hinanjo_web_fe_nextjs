import toast from 'react-hot-toast';

import axios from '@/utils/api';


/* Identity and Access management (IAM) */
export const ExternalEvacuationServices = {
    exportExternalEvacueesCSVList: _exportExternalEvacueesCSVList,
    getPlaceDropdownList: _getPlaceDropdownList,
    getList: _getList,
};

/**
 * Get External Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportExternalEvacueesCSVList(payload, callBackFun) {
    axios.post('/admin/external/family/export', payload)
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
    axios.get('/admin/external/family/place/dropdown/list', payload)
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
 * Get External Evacuees list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/external/family/list', payload)
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