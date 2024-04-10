import axios from "@/utils/api";
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, importErrorToastDisplay, toastDisplay } from "@/helper";
import toast from "react-hot-toast";
import { isArray, isObject } from "lodash";


export const TempRegisterServices = {
  tempRegister: _tempRegister,
  getMasterQuestionnaireList: _getQuestionnaireList,
  getIndividualQuestionnaireList: _getIndividualQuestionnaireList,
  getSpecialCareDetails: _getSpecialCareDetails,
  registerUser: _registerUser,
  qrScanRegistration: _qrScanRegistration,
  ocrScanRegistration: _ocrScanRegistration,
  getAddressByZipCode: _getAddressByZipCode,
  getBasicDetailsInfo: _getBasicDetailsInfo,
  getBasicDetailsInfoStaffTemp:_getBasicDetailsInfoStaffTemp,
  getBasicDetailsUsingUUID:_getBasicDetailsUsingUUID,
  registerTemporaryUser: _registerTemporaryUser,
  getActiveEvacuationPlaceList: _getActiveEvacuationPlaceList,
  getdefaultEventData: _getDefaultEventData,
  autoCheckoutEvacuee: _autoCheckoutEvacuee,
  staffRegisterUser: _staffRegisterUser,
  staffEditUser: _staffEditUser,
  getPPID: _getppID,
  deleteTempFamily:_deleteTempFamily,
};

function _getDefaultEventData(callBackFun) {
  axios
    .post("/user/event/default")
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      console.error("Error fetching Default Event Info list:", error);
    });
}

function _getActiveEvacuationPlaceList(callBackFun) {
  axios
    .post("/user/active/place/list")
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      console.error("Error fetching Basic Info list:", error);
    });
}

function _registerTemporaryUser(payload, callBackFun) {
  axios
    .post("/user/temporary/registration", payload)
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      if (error.response && error.response.status == 422) {
        if (isObject(error.response.data.message)) {
          let errorMessages = Object.values(error.response.data.message);
          let errorString = errorMessages.join('.')
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
          callBackFun(error)
        }
        else {
          toast.error(error.response.data.message, {
            position: "top-right",
          });
          callBackFun(error)
        }
      } else {
        if (error.code == "ERR_NETWORK") {
          callBackFun(error)
        }
      }
    });
}

function _autoCheckoutEvacuee(payload, callBackFun) {
  axios
    .post("/user/temporary/checkout", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    });
}

function _getBasicDetailsInfo(payload, callBackFun) {
  axios
    .post("/user/basic/info", payload)
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      callBackFun(error);
    });
}

function _getBasicDetailsInfoStaffTemp(payload, callBackFun) {
  axios
    .post("/user/basic/info/search", payload)
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      callBackFun(error);
    });
}

function _getBasicDetailsUsingUUID(payload, callBackFun) {
  axios
    .post("/user/basic/info/uuid", payload)
    .then((response) => {
      callBackFun(response.data);
    })
    .catch((error) => {
      callBackFun(error);
      toast.error(error.response?.data?.message, {
        position: "top-right",
      });
    });
}

function _tempRegister(payload, callBackFun) {
  axios
    .post("/user/registration", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      callBackFun();
      handleRegistrationError(error);
    });
}

function _getQuestionnaireList(payload, callBackFun) {
  axios
    .post("/user/master/questionnaire/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching questionnaire list:", error);
    });
}

function _getIndividualQuestionnaireList(payload, callBackFun) {
  axios
    .post("/user/individual/questionnaire/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching questionnaire list:", error);
    });
}

function _getSpecialCareDetails(callBackFun) {
  axios
    .get("/user/special/care")
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching special care details:", error);
    });
}

function _registerUser(payload, callBackFun) {
  axios
    .post("/user/permanent/registration", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      callBackFun();
      handleRegistrationError(error);
    });
}

function _qrScanRegistration(payload, callBackFun) {
  axios
    .post("/user/registration/qr/scan", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      callBackFun();
      handleRegistrationError(error);
    });
}

function _ocrScanRegistration(payload, callBackFun) {
  axios
    .post("/user/registration/ocr/scan", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      callBackFun();
      handleRegistrationError(error);
    });
}

function _staffRegisterUser(payload, callBackFun) {
  axios
    .post("/staff/family/registration ", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      callBackFun();
      handleRegistrationError(error);
    });
}
function _staffEditUser(payload, callBackFun) {
  axios
    .post("/staff/evacuees/edit ", payload)
    .then((response) => {
      callBackFun(response.data);
      toast.success(response?.data?.message, {
        position: "top-right",
      });
    })
    .catch((error) => {
      callBackFun();
      handleRegistrationError(error);
    });
}
//_staffEditUser

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

function handleRegistrationError(error) {
  if (error.response && error.response?.status === 422) {
    if (isObject(error.response?.data?.message)) {
      let errorMessages = Object.values(error.response.data.message);
      let errorString = errorMessages.join('.');
      let errorArray = errorString.split(".");
      errorArray = errorArray.filter(message => message.trim() !== "");
      let formattedErrorMessage = errorArray
        .map((message) => {
          return `${message.trim()}`;
        })
        .join("\n");
      toast.error(formattedErrorMessage, {
        position: "top-right",
      });
    } else {
      toast.error(error.response?.data?.message, {
        position: "top-right",
      });
    }
  } else {
    toast.error(error?.response?.data?.message, {
      position: "top-right",
    });
  }
}

function _getppID(payload, callBackFun) {
  let env = process.env.NEXT_PUBLIC_CLIENT_ENV;
  let url =
    env === "development"
      ? "https://login-portal-dev-api.biz.cityos-dev.hitachi.co.jp/get_applinkage"
      : "https://login-portal-api.biz.linkage.city.yabu.hyogo.jp/get_applinkage";

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.resultCode === "00") {
        callBackFun(data);
      } else {
        callBackFun();
        toast.error("PPIDが空です。", {
          position: "top-right",
        });
      }
    })
    .catch(error => {
      callBackFun();
      toast.error(error?.message || "An error occurred", {
        position: "top-right",
      });
    });
}

function _deleteTempFamily (payload,callBackFun) {
  axios.post('/user/registration/delete/family', payload)
  .then((response) => {
    callBackFun(response.data);
    toast.success(response?.data?.message, {
      position: "top-right",
    });
  })
  .catch((error) => {
    callBackFun();
   toastDisplay(error?.response)
  });
}
