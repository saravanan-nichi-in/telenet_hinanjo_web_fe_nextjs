import { downloadBase64File, timestampFile } from "@/helper";
import axios from "@/utils/api";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const StaffManagementService = {
    importData: _importData,
    exportData: _exportData,
    getList: _getList,
    create: _create,
    update: _update,
    delete: _delete,
};

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/admin/material/import", payload)
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
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload) {
    axios
        .post("/admin/material/export", payload)
        .then((response) => {
                if (response && response.data && response.data.result.filePath) {
                    downloadBase64File(response.data.result.filePath, timestampFile("Material"));
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
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getList(payload, callBackFun) {
    console.log(payload);
    axios
        .post("/admin/staff_management/list", payload)
        .then((response) => {
            // console.log(response);
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
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
    axios
        .post("/admin/staff_management/store", payload)
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
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(id, payload, callBackFun) {
    axios
        .post(`/admin/staff_management/update`, payload)
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
 * Get place details by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _delete(id, callBackFun) {
    axios
        .delete(`/admin/staff_management/delete`, {data: {"id": id}})
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