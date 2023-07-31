import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import { profiles } from '@/utils/constant';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

/* Identity and Access management (IAM) */
export const AuthenticationAuthorizationService = {
    get userValue() { return userSubject.value },
    login: _login,
    logout: _logout,
    register: _register,
    getAll: _getAll,
    getById: _getById,
    update: _update,
    delete: _delete
};

function _login(values) {
    const { email, password } = values && values;
    const isAuthorized = profiles.filter((profile) => profile.email === email && profile.password === password);
    if (isAuthorized.length > 0) {
        localStorage.setItem('user', JSON.stringify(values));
        if (isAuthorized[0].profile === 'admin') {
            window.location.href = "/admin/dashboard"
        } else {
            window.location.href = "/staff/dashboard"
        }
    }
}

function _logout() {
    localStorage.removeItem('user');
    userSubject.next(null);
    window.location.href = "/account/login"
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
