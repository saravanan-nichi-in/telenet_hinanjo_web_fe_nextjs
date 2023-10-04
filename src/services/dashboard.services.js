import axios from '@/utils/api';

/* Identity and Access management (IAM) */
export const DashboardServices = {
    getList: _getList,
};

function _getList(payload, callBackFun) {
    console.log("List");
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