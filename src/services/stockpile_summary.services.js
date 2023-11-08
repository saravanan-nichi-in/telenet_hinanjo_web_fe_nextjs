import toast from 'react-hot-toast';

import axios from '@/utils/api';


/* Identity and Access management (IAM) */
export const StockPileSummaryServices = {
    getSummaryList: _getSummaryList,
    getPlaceDropdownList: _getPlaceDropdownList,
    exportStockPileSummaryCSVList: _exportStockPileSummaryCSVList,
    getStockPileEmailData: _getStockPileEmailData,
    getStockPileEmailUpdate: _getStockPileEmailUpdate
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getSummaryList(payload, callBackFun) {
    axios.post('/admin/stockpile/summary', payload)
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
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportStockPileSummaryCSVList(payload, callBackFun) {
    axios.post('/admin/stockpile/summary/export', payload)
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
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get StockPile Email Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getStockPileEmailData(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.get(`admin/stockpile/summary/mail/detail?${queryParams}`)
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
 * Get StockPile Email Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getStockPileEmailUpdate(payload, callBackFun) {
    axios.post('admin/stockpile/summary/mail', payload)
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