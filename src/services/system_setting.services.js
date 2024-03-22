import axios from "@/utils/api";
import toast from "react-hot-toast";
import { isObject } from "lodash";

/* Identity and Access management (IAM) */
export const systemSettingServices = {
  getList: _getSystemSettingList,
  update: _updateSystemSetting,
};

function _getSystemSettingList(callBackFun) {
  axios
    .get('/admin/systemSetting')
    .then((response) => {
      console.log(response);
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function _updateSystemSetting(payload, callBackFun) {
  axios
    .post(`/admin/systemSetting/upsert`, payload)
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

