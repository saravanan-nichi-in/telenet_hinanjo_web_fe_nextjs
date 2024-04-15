import axios from "@/utils/api";
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, toastDisplay } from "@/helper";
import toast from "react-hot-toast";
import { isArray, isObject } from "lodash";

export const SpecialCareServices = {
  importData: _importSpecialCareData,
  exportData: _exportSpecialCareData,
  getList: _getSpecialCareList,
  create: _createSpecialCare,
  update: _updateSpecialCare,
  details: _specialCareDetails,
  deleteSpecialCare: _deleteSpecialCare
};

function _importSpecialCareData(payload, callBackFun) {
  axios
    .post("/admin/specialcare/import", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response);
        toastDisplay(response, "import");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun(false);
      toastDisplay(error.response, "import");
    });
}

function _exportSpecialCareData(payload, callBackFun) {
  axios
    .post("/admin/specialcare/export", payload)
    .then((response) => {
      if (response && response.data && response.data.result.filePath) {
        let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date());
        downloadBase64File(response.data.result.filePath, `SpecialCare_${date}.csv`);
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

function _getSpecialCareList(payload, callBackFun) {
  axios
    .post("/admin/specialcare/list", payload)
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

function _createSpecialCare(payload, callBackFun) {
  axios
    .post("/admin/specialcare/store", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        toast.success(response?.data?.message, {
          position: "top-right",
        });
      }
    })
    .catch((error) => {
      callBackFun();
      if (error.response && error.response.status == 422) {
        if (isObject(error.response.data.message)) {
          let errorMessages = Object.values(error.response.data.message);
          let errorString = errorMessages.join('.');
          let errorArray = errorString.split(".");
          errorArray = errorArray.filter(message => message.trim() !== "");
          let formattedErrorMessage = errorArray
            .map((message, index) => {
              return `${message.trim()}`;
            })
            .join("\n");
          toast.error(formattedErrorMessage, {
            position: "top-right",
          });
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
          });
        }
      } else {
        console.error(error);
      }
    });
}

function _updateSpecialCare(payload, callBackFun) {
  axios
    .put(`/admin/specialcare/update`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toast.success(response?.data?.message, {
          position: "top-right",
        });
      }
    })
    .catch((error) => {
      callBackFun();
      if (error.response && error.response.status == 422) {
        if (isObject(error.response.data.message)) {
          let errorMessages = Object.values(error.response.data.message);
          let errorString = errorMessages.join('.');
          let errorArray = errorString.split(".");
          errorArray = errorArray.filter(message => message.trim() !== "");
          let formattedErrorMessage = errorArray
            .map((message, index) => {
              return `${message.trim()}`;
            })
            .join("\n");
          toast.error(formattedErrorMessage, {
            position: "top-right",
          });
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
          });
        }
      } else {
        console.error(error);
      }
    });
}

function _specialCareDetails(id, callBackFun) {
  const params = {
    params: {
      id: id,
    },
  };
  axios
    .get(`/admin/specialcare/${id}`, params)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}



function _deleteSpecialCare(id, callBackFun) {
  axios
    .delete(`/admin/specialcare/delete`, { data: { id: id } })
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
        toast.success(response?.data?.message, {
          position: "top-right",
        });
      }
    })
    .catch((error) => {
      if (!isArray(error.response.data.message)) {
        toast.error(error.response.data.message, {
          position: "top-right",
        });
      }
      callBackFun(false);
    });
}
