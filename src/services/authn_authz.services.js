import { BehaviorSubject } from 'rxjs';
import toast from 'react-hot-toast';
import { isObject } from "lodash";

import axios from '@/utils/api';
import { common422ErrorToastDisplay } from '@/helper';

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
 * @param {*} prepareKey 
 */
function _login(key, values, callBackFun, prepareKey) {
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

/**
 * Logout functionality
 * @param {*} key 
 * @param {*} callBackFun 
 * @param {*} prepareKey 
 */
function _logout(key, values, callBackFun, prepareKey) {
    // let logoutUrl = {
    //     'admin': '/auth/admin/login',
    //     'staff': '/auth/staff/login'
    // }[key]

    // if (values && callBackFun) {
    //     axios.post(logoutUrl, { ...values })
    //         .then((response) => {
    //             if (response && response.data) {
    //                 let subject;
    //                 if (key == 'admin') {
    //                     subject = admin
    //                 } else if (key == 'staff') {
    //                     subject = staff
    //                 }
    //                 localStorage.removeItem(key);
    //                 subject.next(null);
    //                 callBackFun(key);
    //             }
    //         })
    //         .catch((error) => {
    //             common422ErrorToastDisplay(error);
    //         });
    // }

    let subject;
    if (key == 'admin') {
        subject = admin
    } else if (key == 'staff') {
        subject = staff
    }
    localStorage.removeItem(key);
    subject.next(null);
    callBackFun(key);
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
            if (response) {
                callBackFun(response);
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            common422ErrorToastDisplay(error);
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
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        })
        .catch((error) => {
            common422ErrorToastDisplay(error);
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