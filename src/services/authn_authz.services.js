import { BehaviorSubject } from 'rxjs';

import axios from '@/utils/api';

const admin = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('admin')));
const staff = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('staff')));

/* Identity and Access management (IAM) */
export const AuthenticationAuthorizationService = {
    get adminValue() { return admin.value },
    get staffValue() { return staff.value },
    login: _login,
    logout: _logout,
};

function _login(key, values, callBackFun) {
    if (key === 'admin') {
        axios.post('/auth/admin/login', values)
            .then((response) => {
                console.log(response);
                if (response && response.data) {
                    admin.next(response.data);
                    callBackFun(response.data);
                }
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    } else {
        axios.post('/auth/staff/login', values)
            .then((response) => {
                console.log(response);
                if (response && response.data) {
                    staff.next(response.data);
                    callBackFun(response.data);
                }
            })
            .catch((error) => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
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
        window.location.href = "/staff/login?hinan=1";
    }
}