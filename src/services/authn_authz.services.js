import { BehaviorSubject } from 'rxjs';
import toast from 'react-hot-toast';

import axios from '@/utils/api';
import { common422ErrorToastDisplay, toastDisplay } from '@/helper';

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
    let loginUrl = {
        'admin': '/auth/admin/login',
        'staff': '/auth/staff/login'
    }[key]

    if (values && callBackFun) {
        axios.post(loginUrl, { ...values, type: key })
            .then((response) => {
                if (response && response.data) {
                    let subject;
                    if (key == 'admin') {
                        subject = admin
                    } else if (key == 'staff') {
                        subject = staff
                    }
                    subject.next(response.data);
                    callBackFun(response.data);
                    toastDisplay(response);
                }
            })
            .catch((error) => {
                callBackFun(false);
                toastDisplay(error?.response);
            });
    }
}

/**
 * Logout functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _logout(key, values, callBackFun) {
    let logoutUrl = '/auth/logout';

    if (values && callBackFun) {
        axios.post(logoutUrl, { ...values })
            .then((response) => {
                if (response && response.data) {
                    let subject;
                    if (key == 'admin') {
                        subject = admin
                    } else if (key == 'staff') {
                        subject = staff
                    }
                    localStorage.removeItem(key);
                    subject.next(null);
                    callBackFun(key);
                    toastDisplay(response);
                }
            })
            .catch((error) => {
                callBackFun(false);
                toastDisplay(error?.response);
            });
    }
}

/**
 * Forgot functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _forgot(key, values, callBackFun) {
    axios.post('/auth/forgot/password', { ...values, type: key })
        .then((response) => {
            if (response && response.data) {
                callBackFun(response);
                toastDisplay(response);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
        });
}

/**
 * Reset functionality
 * @param {*} key 
 * @param {*} values 
 * @param {*} callBackFun 
 */
function _reset(key, values, callBackFun) {
    let payload = {
        new_password: values.password,
        confirm_password: values.confirmPassword,
        token: values.query.token
    }
    axios.post('/auth/reset/password', payload)
        .then((response) => {
            if (response) {
                callBackFun();
                toastDisplay(response);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
        });
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
                common422ErrorToastDisplay(error);
            });
    }
}