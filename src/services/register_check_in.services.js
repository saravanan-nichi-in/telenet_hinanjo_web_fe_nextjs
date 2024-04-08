import axios from "@/utils/api";
import toast from "react-hot-toast";
import { isObject } from "lodash";

export const StaffRegisterServices = {
  getList: _getRegisterCheckInList,
  create: _createRegisterCheckIn,
  bulkUpdateRegisterCheckIn: _bulkUpdateRegisterCheckIn
};

function _getRegisterCheckInList(payload, callBackFun) {
  axios
    .post(`/staff/register/checkin/list`,payload)
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

function _bulkUpdateRegisterCheckIn(payload, callBackFun) {
  axios
    .post(`/staff/register/checkin`,payload)
    .then((response) => {
      if (response) {
        callBackFun(response.data);
        toast.success(response?.data?.message, {
          position: "top-right",
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.status == 422) {
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
