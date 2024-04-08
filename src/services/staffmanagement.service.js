import { downloadBase64File, timestampFile, importErrorToastDisplay } from "@/helper";
import axios from "@/utils/api";
import { isObject } from "lodash";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const StaffManagementService = {
    importData: _importData,
    exportData: _exportData,
    getList: _getList,
    create: _create,
    update: _update,
    delete: _delete,
    show: _show,
    getActivePlaceList: _getActivePlaceList,
};

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/admin/staff/management/import", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                importErrorToastDisplay(response);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
            importErrorToastDisplay(error.response);
        });
}

/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload) {
    axios
        .post("/admin/staff/management/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("StaffManagement"));
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {

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
    axios
        .post("/admin/staff/management/list", payload)
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
function _show(payload, callBackFun) {
    axios
        .post("/admin/staff/management/detail", payload)
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
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
    axios
        .post("/admin/staff/management/store", payload)
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
                callBackFun();
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
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(payload, callBackFun) {
    axios
        .post(`/admin/staff/management/update`, payload)
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
                callBackFun();
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
 * Get place details by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _delete(id, callBackFun) {
    axios
        .delete(`/admin/staff/management/delete`, { data: { "id": id } })
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
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
function _getActivePlaceList(callBackFun) {
    const payload = {
      "filters": {
          "sort_by": "refugee_name",
          "order_by": "asc"
      },
      "search": "",
      "map":true
  };
    axios
      .post("/user/place/list",payload)
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