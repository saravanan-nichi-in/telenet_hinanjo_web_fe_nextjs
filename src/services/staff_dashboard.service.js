import axios from "@/utils/api";

export const StaffDashBoardServices = {
  getList: _getStaffDashboardList,
};

function _getStaffDashboardList(payload, callBackFun) {
    const no = 1
    const payload2 = {
        place_id:parseInt(no, 10)
    }
  axios
    .get(`/staff/dashboard`,{params:payload2})
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}


