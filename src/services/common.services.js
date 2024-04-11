import crypto from 'crypto';
import toast from 'react-hot-toast';
import axios from '@/utils/api';
import CryptoJS from 'crypto-js';

export const CommonServices = {
    zipDownload: _zipDownload,
    getText: _getText,
    getSystemSettingDetails: _getSystemSettingDetails,
    encrypt: _encrypt,
    decrypt: _decrypt,
    decryptPassword: _decryptPassword,
    getPlaceList: _getPlaceList,
    getEventList: _getEventList,
    getStaffEventList: _getStaffEventList,
    getZipCode:_getZipCode,
    getAddress:_getAddress,
    convertToKatakana:_convertToKatakana
};

/**
 * Zip download using external URL
 */
function _zipDownload(zipUrl) {
    if (zipUrl) {
        fetch(zipUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then((zipBlob) => {
                // Create a blob URL for the ZIP file
                const zipObjectURL = URL.createObjectURL(zipBlob);

                // Create a hidden anchor element to trigger the download
                const a = document.createElement('a');
                a.href = zipObjectURL;
                a.download = 'QrCodes1697182013.zip';

                // Trigger the download
                a.click();

                // Clean up the object URL to prevent memory leaks
                URL.revokeObjectURL(zipObjectURL);
            })
            .catch((error) => {
                console.error('Error downloading ZIP file:', error);
            });
    }
}

/**
 * Get audio text
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getText(payload, callBackFun) {
    axios.post('/user/speech_to_text', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Get system settings details
 * @param {*} callBackFun 
 */
function _getSystemSettingDetails(callBackFun) {
    axios.get('/system/settings')
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Encryption functionality
 * @param {*} id 
 * @param {*} key 
 * @returns 
 */
function _encrypt(id, key) {
    if (id && key) {
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let encryptedId = cipher.update(id.toString(), 'utf-8', 'hex');
        encryptedId += cipher.final('hex');
        return encryptedId;
    }
}

/**
 * Decryption functionality
 * @param {*} encryptedId 
 * @param {*} key 
 * @returns 
 */
function _decrypt(encryptedId, key) {
    if (encryptedId && key) {
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let decryptedId = decipher.update(encryptedId, 'hex', 'utf-8');
        decryptedId += decipher.final('utf-8');
        return decryptedId;
    }
}

function _decryptPassword(encryptedData, encryptionKey) {
    if (encryptedData.length > 0) {
        // Laravel creates a JSON to store iv, value, and a mac and base64 encodes it.
        // So let's base64 decode the string to get them.
        const decodedEncrypted = JSON.parse(atob(encryptedData));

        // IV is base64 encoded in Laravel, expected as word array in cryptojs
        const iv = CryptoJS.enc.Base64.parse(decodedEncrypted.iv);

        // Value (cipher text) is also base64 encoded in Laravel, same in cryptojs
        const value = decodedEncrypted.value;

        // Encryption key is base64 encoded in Laravel, word array expected in cryptojs
        const cryptoJsKey = CryptoJS.enc.Base64.parse(encryptionKey);

        // Decrypt the value, providing the IV.
        const decrypted = CryptoJS.AES.decrypt(value, cryptoJsKey, {
            iv: iv,
        });
        
        if(decrypted)
        {
        // Convert the decrypted result to a string
        let decryptedString;
        try {
          decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          decryptedString = ''; // Provide a default value or handle the error gracefully
          return null
        }
        // Use a regular expression to extract the password
        const match = decryptedString.match(/"([^"]+)"/);
        // Check if a match is found, and return the password
        return match ? match[1] : null;
        }
        else return null
    }
}

/**
 * Get place list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getPlaceList(callBackFun) {
    axios.get('/user/active/place')
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun()
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get event list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventList(payload, callBackFun) {
    axios.post('/admin/events/dropdown/status/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun()
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

/**
 * Get staff event list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getStaffEventList(payload, callBackFun) {
    axios.post('/admin/events/dropdown/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun()
            toast.error(error?.response?.data?.message, {
                position: "top-right",
            });
        });
}

async function _getZipCode(state, city, street, callBackFun) {
    let payload ={
        "prefecture": state,
        "city" : city,
        "street" : street
    }
    axios.post('/user/get/zipcode',payload )
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun()
        });
}

async function _getAddress(zipCode, callBackFun) {

    let payload ={
        "zipcode1" : zipCode.slice(0,3),
        "zipcode2" : zipCode.slice(3)
    }
    axios.post('/user/get/address',payload )
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data.result);
            }
        })
        .catch((error) => {
            callBackFun()
        });
}

async function _convertToKatakana(inputText, callBackFun) {
const apiUrl = 'https://labs.goo.ne.jp/api/hiragana';
const apiKey = '032207343b569cd84abf5af9ff408aa450b3edb048fd71728a05f4ce64e2f76a'; // Replace with your actual API key


// Create the request headers
const headers = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
});

// Make the Fetch API request
fetch(apiUrl, {
  method: 'POST',
  headers: headers,
  body: new URLSearchParams({
    app_id: apiKey,
    sentence: inputText,
    request_id:"",
    "output_type":"katakana"
  }),
})
  .then(response => response.json())
  .then(data => {
    callBackFun(data)
  })
  .catch(error => {
    callBackFun()
    // Handle errors
    console.error('Error:', error);
  })
}
