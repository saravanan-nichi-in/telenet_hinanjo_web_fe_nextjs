import { downloadBase64File, timestampFile } from "@/helper";
import axios from "@/utils/api";
import { isObject } from "lodash";
import toast from 'react-hot-toast';

export const AdminEvacueeTempServices = {
    exportData: _exportData,
    getEvacueeTempList: _getEvacueeTempList,
    getTempFamilyEvacueesDetail:_getTempFamilyEvacueesDetail
};


/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload) {
    axios
        .post("/admin/management/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("Admin"));
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
function _getEvacueeTempList(payload, callBackFun) {
    axios
        .post("/admin/temp/evacuations/list", payload)
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
 * Get Evacuees Family Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getTempFamilyEvacueesDetail(payload, callBackFun) {
    axios.post(`/admin/temp/evacuations/detail`,payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            callBackFun(false);
        });
}
