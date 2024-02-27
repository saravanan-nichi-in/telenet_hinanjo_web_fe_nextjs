import axios from "@/utils/api";

export const StaffDashBoardServices = {
  getList: _getStaffDashboardList,
  getEventList: _getStaffEventDashboardList
};

function _getStaffDashboardList(payload, callBackFun) {
  axios
    .get(`/staff/place/dashboard`, { params: payload })
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun(false);
    });
}

function _getStaffEventDashboardList(payload, callBackFun) {
  axios
    .get(`/staff/event/dashboard`, { params: payload })
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      callBackFun(false);
    });
}


