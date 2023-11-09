import toast from 'react-hot-toast';
import { isArray, isObject } from "lodash";
import axios from '@/utils/api';

/* Identity and Access management (IAM) */
export const CheckInOutServices = {
    getList: _getList,
    checkIn: _checkIn,
    checkOut:_checkOut
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/user/family/search', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
          toast.dismiss()
          callBackFun()
          toast.error(error?.response?.data?.message, {
            position: "top-right",
        });
        });
}


/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkIn(payload, callBackFun) {
    axios
      .put("/user/update/family/checkin", payload)
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

  
/**
 * Create a new place
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkOut(payload, callBackFun) {
    axios
      .post("/user/update/family/checkout", payload)
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

