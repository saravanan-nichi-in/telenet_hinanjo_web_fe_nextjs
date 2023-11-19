import axios from "@/utils/api";
import toast from 'react-hot-toast';

/* Identity and Access management (IAM) */
export const UserQrService = {
    register: _register,
};

/**
 * Import place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _register(payload, callBackFun) {
    axios
        .post("/user/registration/qr/app", payload)
        .then((response) => {
            if (response && response.data) {
                // callBackFun(response.data.data);
                
                if(response?.data?.success) {
                    toast.success(response?.data?.message, {
                        position: "top-right",
                    });
                } else {
                    toast.error(response?.data?.message, {
                        position: "top-right",
                    });
                }
            }
        })
        .catch((error) => {
            // Handle errors here
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
        console.log('here',temp.data.data);
        callBackFun(temp.data.data);
}

const temp = {
    "success": true,
    "code": 200,
    "locale": "en",
    "message": "Data fetched successfully.",
    "data": {
        "data": {
            "id": 11,
            "family_code": "002-011",
            "place_id": 2,
            "address": "武蔵野市",
            "address_default": "武蔵野市",
            "zip_code": "960-0000",
            "prefecture_id": 25,
            "language_register": "en",
            "tel": "0887905178",
            "join_date": "2023-02-19 00:00:00",
            "out_date": null,
            "is_public": 1,
            "is_registered": 0,
            "public_info": 1,
            "qr_code": "images/qr/11/1700207970.png",
            "created_at": "2023/11/17 16:59:29",
            "updated_at": null,
            "deleted_at": null,
            "join_date_modified": "2023-02-19 (Sun) 0:00",
            "updated_at_day": "2023-11-17 (Fri) 16:59",
            "question": [],
            "perfecture_name": "Shiga",
            "person": [
                {
                    "id": 11,
                    "family_id": 11,
                    "name": "トネガ",
                    "refugee_name": "ヤジマ アキヨ",
                    "postal_code": "180-2342",
                    "prefecture_id": 28,
                    "address": "武蔵野市",
                    "dob": "2000-06-16 00:00:00",
                    "address_default": null,
                    "age": 23,
                    "month": 6,
                    "gender": 2,
                    "option": [
                        3,
                        4
                    ],
                    "note": "remarksr",
                    "is_owner": 0,
                    "connecting_code": "connecting",
                    "created_at": "2023/11/17 16:59:30",
                    "updated_at": "2023/11/17 16:59:30",
                    "deleted_at": null,
                    "specialCareName": [
                        "Persons with disabilities",
                        "Nursing care recipient"
                    ],
                    "individualQuestions": [],
                    "created_at_day": "2023-11-17 (Fri) 16:59"
                }
            ]
        }
    }
};
