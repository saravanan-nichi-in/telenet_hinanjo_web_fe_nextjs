import axios from "@/utils/api";
import toast from "react-hot-toast";
import { isObject } from "lodash";

/* Identity and Access management (IAM) */
export const ExternalServices = {
  getActivePlaceList: _getActivePlaceList,
  create: _create,
  getAddressByZipCode: _getAddressByZipCode,
};

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getActivePlaceList(callBackFun) {
  const payload = {
    "filters": {
        "sort_by": "refugee_name",
        "order_by": "asc"
    },
    "search": "",
    "map":true
};
  axios
    .post("/user/place/list",payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      
      toast.error(error?.response?.data?.message, {
        position: "top-right",
    });
    });
}

/**
 * Register External
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
  axios
    .post("/user/external", payload)
    .then((response) => {
      callBackFun(response.data);
      if (response && response.data) {
        // Commented for now as per ticket might be useful in future
        // toast.success(response?.data?.message, {
        //   position: "top-right",
        // });
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
 * Get address information by zip code
 * @param {string} zipCode - The zip code to search for.
 * @param {Function} callBackFun - The callback function to handle the response data.
 */
async function _getAddressByZipCode(zipCode, callBackFun) {
  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`
    );
    const data = await response.json();
    if (data.results) {
      callBackFun(data.results);
    } else {
      data && callBackFun();
    }
  } catch (error) {
    console.error("Error fetching address data:", error);
  }
}


