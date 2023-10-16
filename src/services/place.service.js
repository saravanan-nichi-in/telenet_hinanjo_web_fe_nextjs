import axios from "@/utils/api";
import { downloadBase64File,getYYYYMMDDHHSSSSDateTimeFormat } from '@/helper';
import toast from 'react-hot-toast';
import { isArray } from "lodash";

/* Identity and Access management (IAM) */
export const PlaceServices = {
  importData: _importData,
  exportData: _exportData,
  getList: _getList,
  create: _create,
  update: _update,
  details: _details,
  deletePlace: _deletePlace,
  updateStatus: _updateStatus,
  getAddressByZipCode:_getAddressByZipCode
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
      if (response && response.data && response.data.result.filePath) {
          let date =getYYYYMMDDHHSSSSDateTimeFormat(new Date())
          downloadBase64File(response.data.result.filePath, `Place_${date}.csv`);
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
      callBackFun(response.data)
      if (response && response.data) {
        toast.success(response?.data?.message, {
          position: "top-right",
      });
      }
    })
    .catch((error) => {
      callBackFun()
      if (error.response && error.response.status === 422) {

        if(isArray(error.response.data.message))
        {
        const errorMessages = Object.values(error.response.data.message);
        errorMessages.forEach((messages) => {
          messages.forEach((msg) => {
            toast.error(msg, {
              position: "top-right",
            });
          });
        });
      }
      else {
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      }
      } else {
        console.error(error);
      }
    });
}

/**
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(payload, callBackFun) {
  let place_id=payload.place_id
  axios
    .put(`/admin/place/${place_id}`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toast.success(response?.data?.message, {
          position: "top-right",
      });
      }
    })
    .catch((error) => {
      callBackFun()
      if (error.response && error.response.status === 422) {

        if(isArray(error.response.data.message))
        {
        const errorMessages = Object.values(error.response.data.message);
        errorMessages.forEach((messages) => {
          messages.forEach((msg) => {
            toast.error(msg, {
              position: "top-right",
            });
          });
        });
      }
      else {
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      }
      } else {
        console.error(error);
      }
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

/**
 * Get address information by zip code
 * @param {string} zipCode - The zip code to search for.
 * @param {Function} callBackFun - The callback function to handle the response data.
 */
async function _getAddressByZipCode(zipCode, callBackFun) {
  try {
    const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`);
    const data = await response.json();
    if (data.results) {
      callBackFun(data.results);
    }
    else {
      data&&callBackFun()
    }
  } catch (error) {
    console.error("Error fetching address data:", error);
  }
}

/**
 * delete place by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _deletePlace(id, callBackFun) {
  axios
      .delete(`/admin/place/${id}`, {data: {"id": id}})
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
