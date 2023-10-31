import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { isObject } from "lodash";

export const StockpileHistoryServices = {
    getProductTypes: _getProductTypes,
    getProductNames: _getProductNames,
    getHistoryList: _getHistoryList,
};

/**
 * Get product types
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getProductTypes(payload, callBackFun) {
    axios.post('/staff/stockpile/history/dropdown/product', payload)
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
 * Get product names
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getProductNames(payload, callBackFun) {
    const params = {
        params: payload
    };
    axios.get('/staff/stockpile/history/dropdown/category', params)
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
 * Get history list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getHistoryList(payload, callBackFun) {
    axios.post('/staff/stockpile/history', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            if (error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    callBackFun(false);
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun(false);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}
