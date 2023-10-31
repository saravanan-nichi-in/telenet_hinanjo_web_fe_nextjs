import toast from 'react-hot-toast';

import axios from '@/utils/api';


/* Identity and Access management (IAM) */
export const QuestionnaireServices = {
    getList: _getList,
    registerQuestionnaire: _registerQuestionnaire,
    getIndividualList: _getIndividualList,
    registerIndividualQuestionnaire: _registerIndividualQuestionnaire,
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.get('/admin/questionnaire', payload)
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
function _getIndividualList(payload, callBackFun) {
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
function _registerQuestionnaire(payload, callBackFun) {
    axios.post('/admin/questionnaire/upsert', payload)
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
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _registerIndividualQuestionnaire(payload, callBackFun) {
    axios.post('/admin/individual/questionnaire/upsert', payload)
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