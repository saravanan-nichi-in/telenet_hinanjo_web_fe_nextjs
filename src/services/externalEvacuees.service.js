import { downloadBase64File, timestampFile } from "@/helper";
import axios from "@/utils/api";
import { isObject } from "lodash";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const ExternalEvacueesService = {
    exportData: _exportData,
    getList: _getList,
    getEvacueeList: _getEvacueeList
};


/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload) {
    axios
        .post("/staff/external/family/export", payload)
        .then((response) => {
                if (response && response.data && response.data.result.filePath) {
                    downloadBase64File(response.data.result.filePath, timestampFile("ExternalEvacuees"));
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
    axios
        .post("/staff/external/family/list", payload)
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
 * Get Evacuee list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getEvacueeList(payload, callBackFun) {
    console.log(payload);
    axios
        .post("/staff/external/family/detail", payload)
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
