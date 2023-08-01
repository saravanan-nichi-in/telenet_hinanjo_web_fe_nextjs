import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { profiles } from '@/utils/constant';

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

function _login(key, values) {
    const { email, password } = values && values;
    const isAuthorized = profiles.filter((profile) => profile.email === email && profile.password === password);
    if (isAuthorized.length > 0) {
        if (key === 'admin') {
            admin.next(values);
            localStorage.setItem('admin', JSON.stringify(values));
            window.location.href = "/admin/dashboard";
        } else {
            staff.next(values);
            localStorage.setItem('staff', JSON.stringify(values));
            window.location.href = "/staff/dashboard";
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
