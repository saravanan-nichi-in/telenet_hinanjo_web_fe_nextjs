import { BehaviorSubject } from 'rxjs';
import toast from 'react-hot-toast';
import { isObject } from "lodash";

import axios from '@/utils/api';

const admin = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('admin')));
const staff = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('staff')));

/* Identity and Access management (IAM) */
export const AuthenticationAuthorizationService = {
    get adminValue() { return admin.value },
    get staffValue() { return staff.value },
    login: _login,
    logout: _logout,
    forgot: _forgot,
    reset: _reset,
    changePassword: _changePassword,
};

/**
 * Login functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _login(key, values, callBackFun) {
    if (key === 'admin' && values && callBackFun) {
        axios.post('/auth/admin/login', values)
            .then((response) => {
                if (response && response.data) {
                    admin.next(response.data);
                    callBackFun(response.data);
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    } else {
        axios.post('/auth/staff/login', values)
            .then((response) => {
                if (response && response.data) {
                    staff.next(response.data);
                    callBackFun(response.data);
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    }
}

/**
 * Logout functionality
 * @param {*} key 
 * @param {*} callBackFun 
 */
function _logout(key, callBackFun) {
    if (key === 'admin') {
        localStorage.removeItem('admin');
        admin.next(null);
        callBackFun('admin');
    } else {
        localStorage.removeItem('staff');
        staff.next(null);
        callBackFun('staff');
    }
}

/**
 * Forgot functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _forgot(key, values, callBackFun) {
    if (key === 'admin' && values && callBackFun) {
        axios.post('/auth/forgot/password', values)
            .then((response) => {
                if (response) {
                    callBackFun(response);
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    } else {
        axios.post('/auth/staff/forgot/password', values)
            .then((response) => {
                if (response) {
                    callBackFun(response);
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    }
}

/**
 * Reset functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _reset(key, values, callBackFun) {
    if (key === 'admin' && values && callBackFun) {
        let payload = {
            new_password: values.password,
            confirm_password: values.confirmPassword,
            token: values.query.token
        }
        axios.post('/auth/reset/password', payload)
            .then((response) => {
                if (response) {
                    callBackFun();
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    } else {
        let payload = {
            new_password: values.password,
            confirm_password: values.confirmPassword,
            token: values.query.token
        }
        axios.post('/auth/staff/reset/password', payload)
            .then((response) => {
                if (response) {
                    callBackFun();
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    }
}

/**
 * Change password functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _changePassword(key, values, callBackFun) {
    if (key === 'admin' && values && callBackFun) {
        axios.put('/admin/change/password', values)
            .then((response) => {
                if (response && response.data) {
                    callBackFun(response.data);
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                }
            })
            .catch((error) => {
                if (error.response.status == 422) {
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
                    }
                } else {
                    toast.error(error.response.data.message, {
                        position: "top-right",
                    });
                }
            });
    }
}