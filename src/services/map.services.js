import axios from "@/utils/api";
import toast from "react-hot-toast";

/* Identity and Access management (IAM) */
export const MapServices = {
  getPlaceList: _getPlaceList,
};



/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getPlaceList(callBackFun) {
  axios
    .post("/user/registration/place/list")
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      // Handle errors here
      toast.error(error?.response?.data?.message, {
        position: "top-right",
    });
    });
}
