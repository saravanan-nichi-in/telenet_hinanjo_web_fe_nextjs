import axios from '@/utils/api';

/* Identity and Access management (IAM) */
export const DashboardServices = {
    getList: _getList,
    updateFullStatus: _updateFullStatus,
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/dashboard', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error('Error fetching data:', error);
        });
}

/**
 * Update full status by id
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _updateFullStatus(payload, callBackFun) {
    axios.post('/admin/place/status/update/full', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun();
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error('Error fetching data:', error);
        });
}