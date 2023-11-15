import crypto from 'crypto';

import axios from '@/utils/api';

export const CommonServices = {
    zipDownload: _zipDownload,
    getText: _getText,
    getSystemSettingDetails: _getSystemSettingDetails,
    encrypt: _encrypt,
    decrypt: _decrypt,
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
