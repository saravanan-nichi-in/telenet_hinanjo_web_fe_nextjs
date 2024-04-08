import axios from "@/utils/api";
import toast from "react-hot-toast";
import { isObject } from "lodash";

export const StaffSuppliesServices = {
  getList: _getStaffSuppliesList,
  create: _createStaffSupply,
};

function _getStaffSuppliesList(payload, callBackFun) {
  axios
    .post(`/staff/supplies`,payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function _createStaffSupply(payload, callBackFun) {
  axios
    .post("/staff/supplies/store", payload)
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
        console.error(error);
      }
    });
}
