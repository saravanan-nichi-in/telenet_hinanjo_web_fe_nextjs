import { downloadBase64File, timestampFile } from "@/helper";
import axios from "@/utils/api";
import { isObject } from "lodash";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const StockpileStaffService = {
    importData: _importData,
    exportData: _exportData,
    getList: _getList,
    update: _update,
    create: _create,
    dropdown: _dropdown
};

/**
 * Import stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/staff/stockpile/import", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                if (response?.data?.success) {
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                } else {
                    callBackFun(false);
                    toast.error(response?.data?.message, {
                        position: "top-right",
                    });
                }
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Export stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload, callBackFun) {
    axios
        .post("/staff/stockpile/summary/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {

                downloadBase64File(response.data.result.filePath, timestampFile("StaffStockpile"));
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get stockpile master list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getList(payload, callBackFun) {
    axios
        .post("/staff/stockpile/summary", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get stockpile category/product dropdown list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getCategoryAndProductList(callBackFun) {
    axios
        .get("/admin/stockpile/product/dropdown")
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data.data);
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Create a new stockpile master
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
    axios
        .post("/staff/stockpile/create", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            if (error.response && error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    // Join the error messages with line breaks
                    // Join the error messages with line breaks and add a comma at the end of each line, except the last one
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun();
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}

/**
 * Update stockpile master by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(payload, callBackFun) {
    axios
        .post(`/staff/stockpile/summary/update`, payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun();
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            if (error.response && error.response.status == 422) {
                if (isObject(error.response.data.message)) {
                    let errorMessages = Object.values(error.response.data.message);
                    let errorString = errorMessages.join('.')
                    let errorArray = errorString.split(".");
                    errorArray = errorArray.filter(message => message.trim() !== "");
                    // Join the error messages with line breaks
                    // Join the error messages with line breaks and add a comma at the end of each line, except the last one
                    let formattedErrorMessage = errorArray
                        .map((message, index) => {
                            return `${message.trim()}`;
                        })
                        .join("\n");
                    toast.error(formattedErrorMessage, {
                        position: "top-right",
                    });
                }
            } else {
                callBackFun();
                console.error(error);
                toast.error(error.response.data.message, {
                    position: "top-right",
                });
            }
        });
}


/**
 * Get Category dropdown Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _dropdown(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.get(`/staff/stockpile/dropdown/category?${queryParams}`)
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