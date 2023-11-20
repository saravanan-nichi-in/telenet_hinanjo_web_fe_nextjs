import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { isObject } from 'lodash';


/* Identity and Access management (IAM) */
export const EventQuestionnaireServices = {
    getList: _getList,
    registerUpdateEvent: _registerUpdateEvent,
    getEventDetail: _getEventDetail,
    deleteEvent: _deleteEvent
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/questionnaireTemplate/list', payload)
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
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventDetail(payload, callBackFun) {
    axios.get('/admin/individual/questionnaire', payload)
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
function _registerUpdateEvent(payload, callBackFun) {
    axios.post('/admin/questionnaireTemplate/store', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
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

/**
 * delete Event
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _deleteEvent(payload, callBackFun) {
    axios.delete('/admin/questionnaireTemplate/delete', { data: { "id": payload.id } })
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