import axios from "@/utils/api";
import { downloadBase64File,getYYYYMMDDHHSSSSDateTimeFormat } from '@/helper';
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const PlaceServices = {
  importData: _importData,
  exportData: _exportData,
  getList: _getList,
  create: _create,
  update: _update,
  details: _details,
  updateStatus: _updateStatus,
};

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
  axios
    .post("/admin/place/import", payload)
    .then((response) => {
      if (response && response.data) {
        toast.success(response?.data?.message, {
          position: "top-right",
      });
      }
    })
    .catch((error) => {
      // Handle errors here
      toast.error(error?.response?.data?.message, {
        position: "top-right",
    })
    });
}

/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload, callBackFun) {
  axios
    .post("/admin/place/export", payload)
    .then((response) => {
      if (response && response.data && response.data.result.file) {
          let date =getYYYYMMDDHHSSSSDateTimeFormat(new Date())
          downloadBase64File(response.data.result.file, `palce_${date}.csv`);
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
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getList(payload, callBackFun) {
  const params = {params:payload}
  axios
    .get("/admin/place", params)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}

/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
  axios
    .post("/admin/place", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}

/**
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(payload, callBackFun) {
  axios
    .put("/admin/place/{place}", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun();
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}

/**
 * Get place details by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _details(id, callBackFun) {
  const params = {
    params: {
      id: id,
    },
  };
  axios
    .get(`/admin/place/${id}`, params)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}

/**
 * Update place status by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _updateStatus(payload, callBackFun) {
  axios
    .put(`/admin/place/status/update/${payload.place_id}`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun();
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
    });
}
