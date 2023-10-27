import axios from "@/utils/api";

export const StaffDashBoardServices = {
  getList: _getStaffDashboardList,
};

function _getStaffDashboardList(payload, callBackFun) {

  axios
    .get(`/staff/dashboard`,{params:payload})
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}


