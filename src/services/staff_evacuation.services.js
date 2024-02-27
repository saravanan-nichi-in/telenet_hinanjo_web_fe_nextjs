import toast from 'react-hot-toast';

import axios from '@/utils/api';


/* Identity and Access management (IAM) */
export const StaffEvacuationServices = {
    getList: _getList,
    exportEvacueesCSVList: _exportEvacueesCSVList,
    getFamilyEvacueesDetail: _getFamilyEvacueesDetail,
    updateCheckoutDetail: _updateCheckoutDetail,
    getStaffEvecueesList: _getStaffEvecueesList,
    getStaffPermanantEvecueesDetail: _getStaffPermanantEvecueesDetail,
    getStaffAttendeesList: _getStaffAttendeesList,
    getStaffFamilyEvacueesDetail: _getStaffFamilyEvacueesDetail
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/staff/evacuees', payload)
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
function _exportEvacueesCSVList(payload, callBackFun) {
    axios.post('/staff/family/export', payload)
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
 * Get Evacuees Family Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getFamilyEvacueesDetail(payload, callBackFun) {
    axios.post('/staff/family/detail', payload)
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
 * Get Evacuees Family Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getStaffFamilyEvacueesDetail(payload, callBackFun) {
    axios.post('/staff/attendees/detail', payload)
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
function _updateCheckoutDetail(payload, callBackFun) {
    axios.post('/staff/evacuees/checkout', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
            toast.success(response?.data?.message, {
                position: "top-right",
            });
        })
        .catch((error) => {
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}


/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getStaffEvecueesList(payload, callBackFun) {
    axios
        .post("/staff/permanent/evacuees", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
        });
}


/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getStaffPermanantEvecueesDetail(payload, callBackFun) {
    axios
        .post("/staff/evacuees/detail", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
        });
}

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getStaffAttendeesList(payload, callBackFun) {
    axios
        .post("/staff/attendees/list", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
        });
}