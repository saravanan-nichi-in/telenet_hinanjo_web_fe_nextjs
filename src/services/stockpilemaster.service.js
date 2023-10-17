import { downloadBase64File } from "@/helper";
import axios from "@/utils/api";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const StockpileService = {
    importData: _importData,
    exportData: _exportData,
    getList: _getList,
    create: _create,
    update: _update,
    delete: _delete,
    getCategoryAndProductList: _getCategoryAndProductList
};

/**
 * Import stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/admin/stockpile/import", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                if(response?.data?.success) {
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                } else {
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
        .post("/admin/stockpile/export", payload)
        .then((response) => {
                if (response && response.data && response.data.result.filePath) {
                    downloadBase64File(response.data.result.filePath, "stockpile.csv");
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
        .post("/admin/stockpile/list", payload)
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
        .post("/admin/stockpile", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
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
 * Update stockpile master by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(id, payload, callBackFun) {
    axios
        .post(`/admin/stockpile/update`, payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun();
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
 * Get stockpile master details by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _delete(id, callBackFun) {
    axios
        .delete(`/admin/stockpile/${id}`, {data: {"product_id": id}})
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            console.log(error);
            // Handle errors here
            // console.error("Error fetching data:", error);
            // toast.error(error?.response?.data?.message, {
            //     position: "top-right",
            // });
        });
}