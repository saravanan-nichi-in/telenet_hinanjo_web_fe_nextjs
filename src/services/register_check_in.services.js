import axios from "@/utils/api";
import toast from "react-hot-toast";
import { isObject } from "lodash";

export const StaffRegisterServices = {
  getList: _getRegisterCheckInList,
  create: _createRegisterCheckIn,
};

function _getRegisterCheckInList(payload, callBackFun) {
  axios
    .get(`/staff/register/checkin`,{params:payload})
    .then((response) => {
      if (response) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function _createRegisterCheckIn(payload, callBackFun) {
  axios
    .post("/staff/register/checkin", payload)
    .then((response) => {
      callBackFun(response);
      if (response) {
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
        toast.error(error?.response?.data?.message, {
          position: "top-right",
      });
      }
    });
}
