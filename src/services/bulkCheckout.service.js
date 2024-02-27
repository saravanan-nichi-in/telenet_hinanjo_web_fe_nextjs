import axios from "@/utils/api";
import { isObject } from "lodash";
import toast from 'react-hot-toast';

export const BulkCheckoutService = {
  getPlacesList: _getPlacesList,
  getEventsList: _getEventsList,
  checkoutBulkEvents: _checkoutBulkEvents,
  checkoutBulkPlaces: _checkoutBulkPlaces,
};

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getPlacesList(callBackFun) {
  axios
    .get("/admin/place/history/dropdown/list")
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun();
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
function _getEventsList(payload, callBackFun) {
  axios
    .post("/admin/events/dropdown/status/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
    });
}

/**
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkoutBulkPlaces(payload, callBackFun) {
  axios
    .put(`/admin/place/bulk/checkout`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun();
      }
      toast.success(response?.data?.message, {
        position: "top-right",
      });
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


/**
 * Update place by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _checkoutBulkEvents(payload, callBackFun) {
  axios
    .put(`/admin/events/bulk/checkout`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun();
      }
      toast.success(response?.data?.message, {
        position: "top-right",
      });
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
