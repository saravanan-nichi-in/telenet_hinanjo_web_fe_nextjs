import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { profiles } from '@/utils/constant';
import { Toast } from 'primereact/toast';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const admin = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('admin')));
const staff = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('staff')));

/* Identity and Access management (IAM) */
export const AuthenticationAuthorizationService = {
    get adminValue() { return admin.value },
    get staffValue() { return staff.value },
    login: _login,
    logout: _logout,
    register: _register,
    getAll: _getAll,
    getById: _getById,
    update: _update,
    delete: _delete
};

function _login(key, values, callBackFun) {
    const { email, password } = values && values;
    const isAuthorized = profiles.filter((profile) => profile.email === email && profile.password === password);
    if (isAuthorized.length > 0) {
        if (key === 'admin') {
            admin.next(values);
            callBackFun(values);
        } else {
            staff.next(values);
            callBackFun(values);
        }
    }
}

function _logout() {
    const url = window.location.pathname
    if (url.startsWith('/admin')) {
        localStorage.removeItem('admin');
        admin.next(null);
        window.location.href = "/admin/login";
    } else {
        localStorage.removeItem('staff');
        admin.next(null);
        window.location.href = "/staff/login";
    }
}

function _register(user) {
}

function _getAll() {
}

function _getById(id) {
}

function _update(id, params) {
}

function _delete(id) {
}
