/* eslint-disable no-irregular-whitespace */
import toast from "react-hot-toast";
import { isObject, isArray } from "lodash";

/**
 * 
 * @param {*} data 
 * @param {*} key 
 * @returns value of the key @else undefined
 */
export const getValueByKeyRecursively = (data, key) => {
    // Base case: If data is not an object or data[key] is present, return the value
    if (typeof data !== 'object' || data[key] !== undefined) {
        return data[key];
    }
    // Recursively traverse the nested object
    for (const nestedKey in data) {
        // data.hasOwnProperty(nestedKey)
        if (nestedKey in data) {
            const value = getValueByKeyRecursively(data[nestedKey], key);
            if (value !== undefined) {
                return value;
            }
        }
    }
    // Key not found in the nested object
    return undefined;
};

/**
 * Get japanese date & time with custom format
 * @param {*} dateTime 
 * @returns 
 */
export const getJapaneseDateTimeDisplayFormat = (dateTime) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    const formattedJPDateTime = new Date(dateTime).toLocaleString('ja-JP', options);

    formattedJPDateTime.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ')
    return formattedJPDateTime;
}

/**
 * Get japanese display format
 * @param {*} dateTime 
 * @returns 
 */
export function getJapaneseDateDisplayYYYYMMDDFormat(dateTime) {
    if (dateTime) {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const [year, month, day] = formattedDate.split('/');
        return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    }
    return "";
}

/**
 * Get English display format
 * @param {*} dateTime 
 * @returns 
 */
export const getEnglishDateDisplayFormat = (dateTime) => {
    if (dateTime) {
        const date = new Date(dateTime);

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }
    return "";
}

/**
 * Get Default Today DateTime display format
 * @param {*} hours, minutes 
 * @returns today DateTime
 */
export const getDefaultTodayDateTimeFormat = (hours, minutes) => {
    let constructDate = new Date();
    constructDate.setHours(hours);
    constructDate.setMinutes(minutes);

    const formattedJPDateTime = new Date(constructDate.getFullYear(),
        (constructDate.getMonth()).toString().padStart(2, '0'),
        (constructDate.getDate()).toString().padStart(2, '0'),
        (constructDate.getHours()).toString().padStart(2, '0'),
        (constructDate.getMinutes()).toString().padStart(2, '0'));
    return formattedJPDateTime;
}

/**
 * Get general date & time display format
 * @param {*} dateTime 
 * @returns 
 */
export const getGeneralDateTimeDisplayFormat = (dateTime) => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    let formattedJPDateTime = new Date(dateTime).toLocaleDateString("ja-jp", options);
    return formattedJPDateTime.replaceAll("/", "-");
}

/**
 * Get general display date & time slash display format
 * @param {*} dateTime 
 * @returns 
 */
export const getGeneralDateTimeSlashDisplayFormat = (dateTime) => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    let formattedJPDateTime = new Date(dateTime).toLocaleDateString("ja-jp", options);
    return formattedJPDateTime.replaceAll("-", "/");
}

/**
 * Get general display date & time && second slash display format
 * @param {*} dateTime 
 * @returns 
 */
export const getGeneralDateTimeSecondSlashDisplayFormat = (dateTime) => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    let formattedJPDateTime = new Date(dateTime).toLocaleDateString("ja-jp", options);
    return formattedJPDateTime.replaceAll("-", "/");
}

/**
 * Get current date format
 * @param {*} dateTime 
 * @returns 
 */
export const getYYYYMMDDHHSSSSDateTimeFormat = (dateTime) => {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };
    let formattedJPDateTime = new Date(dateTime).toLocaleDateString("ja-jp", options);
    formattedJPDateTime = formattedJPDateTime.replaceAll("/", "");
    formattedJPDateTime = formattedJPDateTime.replaceAll(":", "");
    return formattedJPDateTime.replaceAll("", "");
}

/**
 * Function to download a base64-encoded file
 * @param {*} base64String 
 * @param {*} fileName 
 */
export const downloadBase64File = (base64String, fileName) => {
    // Decode the Base64 string to a UTF-8 string
    const utf8String = decodeURIComponent(escape(atob(base64String.split('base64,')[1])));
    // Convert the UTF-8 string to a Blob
    const blob = new Blob([utf8String], { type: 'text/csv;charset=utf-8' });
    // Create a download link and trigger a click event to download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

/**
 * Timestamp filename
 * @param {*} fileName 
 */
export const timestampFile = (fileName) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `${fileName}${year}${month}${day}${random}.csv`;
};

/**
 * Zip download functionality
 * @param zipURL
 */
export const zipDownloadWithURL = (zipURL) => {
    if (zipURL) {
        // Create a temporary anchor element for the download
        let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date())
        const link = document.createElement('a');
        link.href = zipURL;
        const fileName = `Sample_${date}.zip`;
        link.setAttribute('download', fileName); // Specify the file name you want to give to the downloaded file
        link.click();
    }
}

/**
 * Function help to display error messages on toast
 * @param {*} error 
 * @param {*} key 
 * @param {*} position 
 */
export const toastDisplay = (response, key, position = "top-right", rawMsgType) => {
    if (response && response?.data && response?.status) {
        const { status, data } = response;
        if (status != 401 && status != 403) {
            if (data.success) {
                if (key == 'import' && status == 206 && response?.data?.error_path) {
                    toast.success(() => (
                        <div>
                            <a href={response?.data?.error_path} target="_blank" style={{ textDecoration: "underline" }}>
                                {response?.data?.message}
                            </a>
                        </div>
                    ), {
                        position: position,
                    });
                } else {
                    toast.success(data?.message, {
                        position: position,
                    });
                }
            } else {
                if (key == 'import' && status == 422) {
                    if (response?.data?.error_path) {
                        toast.error(() => (
                            <div>
                                <a href={data?.error_path} target="_blank" style={{ textDecoration: "underline" }}>
                                    {data?.message}
                                </a>
                            </div>
                        ), {
                            position: position,
                        });
                    } else {
                        if (!isArray(data?.message)) {
                            toast.error(data?.message, {
                                position: "top-right",
                            });
                        }
                    }
                } else if (status == 422) {
                    if (isObject(data?.message)) {
                        let errorMessages = Object.values(data?.message);
                        let errorString = errorMessages.join('.')
                        let errorArray = errorString.split(".");
                        errorArray = errorArray.filter(message => message.trim() !== "");
                        let formattedErrorMessage = errorArray
                            .map((message, index) => {
                                return `${message.trim()}`;
                            })
                            .join("\n");
                        toast.error(formattedErrorMessage, {
                            position: position,
                        });
                    } else {
                        if (!isArray(data?.message)) {
                            toast.error(data?.message, {
                                position: "top-right",
                            });
                        }
                    }
                } else {
                    if (!isArray(data?.message)) {
                        toast.error(data?.message, {
                            position: "top-right",
                        });
                    }
                }
            }
        }
    } else {
        if (rawMsgType == 'success') {
            toast.success(response, {
                position: "top-right",
            });
        } else {
            toast.error(response, {
                position: "top-right",
            });
        }
    }
}

/**
 * Get number of evacuation days
 * @param {*} createdDate 
 * @returns 
 */
export const getNumberOfEvacuationDays = (createdDate) => {
    let givenDate = new Date(createdDate);
    let todayDate = new Date();
    let timeDifference = todayDate - givenDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

/**
 * Remove duplicate object from array
 * @param {*} array 
 * @param {*} key 
 * @returns 
 */
export const removeDuplicatesByKey = (array, key) => {
    const uniqueKeys = new Set();
    return array.filter((item) => {
        const itemKey = item[key];
        if (!uniqueKeys.has(itemKey)) {
            uniqueKeys.add(itemKey);
            return true;
        }
        return false;
    });
};

/**
 * Get japanese date & time format
 * @param {*} dateTime 
 * @returns 
 */
export const getJapaneseDateTimeDisplayActualFormat = (dateTime) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
    };
    const formattedJPDateTime = new Date(dateTime).toLocaleString('ja-JP', options);

    formattedJPDateTime.replace(/(\d+)年(\d+)月(\d+)日, (\d+):(\d+):(\d+)/, '$1年$2月$3日 $4:$5');
    return formattedJPDateTime;
};

/**
 * Get english date & time format
 * @param {*} dateTime 
 * @returns 
 */
export const getEnglishDateTimeDisplayActualFormat = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} (${dayOfWeek}) ${hour}:${minute}`;
};

/**
 * Get Japanese date & time format
 * @param {*} dateTime 
 * @returns 
 */
export const getJapaneseDateTimeDayDisplayActualFormat = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}年${month}月${day}日  (${dayOfWeek}) ${hour}:${minute}`;
};

/**
 * Get english date & time format
 * @param {*} dateTime 
 * @returns 
 */
export const getEnglishDateTimeDisplayFormat = (dateTime) => {
    if (dateTime != "") {
        const date = new Date(dateTime);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}`;
    }
    return "";
};

/**
 * Get english slash date format
 * @param {*} dateTime 
 * @returns 
 */
export const getEnglishDateSlashDisplayFormat = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
};

/**
 * Get english slash date time format with seconds
 * @param {*} dateTime 
 * @returns 
 */
export const getEnglishDateTimeSlashDisplayFormatWithSeconds = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

/**
 * Function to convert double-byte number string to single-byte
 * Function to convert full-width alphanumeric characters to single-byte
 * @param {*} fullWidthString 
 * @returns 
 */
export function convertToSingleByte(fullWidthString) {
    var hasFullWidth = /[Ａ-Ｚａ-ｚ０-９]/.test(fullWidthString);
    if (!hasFullWidth) {
        return fullWidthString; // Return input string as it is if it doesn't contain full-width characters
    }

    var output = fullWidthString.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (match) {
        return String.fromCharCode(match.charCodeAt(0) - 65248);
    });
    return output;
}

/**
 * hiding the background scroll when modal is open
 */
export const hideOverFlow = () => {
    document.body.style.overflow = 'hidden';
}

/**
 * enabling the background scroll when modal is closed
 */
export const showOverFlow = () => {
    document.body.style.overflow = 'auto';
}

/**
 * Function to calculate Age with help of date of birth
 * @param {*} year 
 * @param {*} month 
 * @param {*} date 
 * @returns 
 */
export const calculateAge = (year, month, date) => {
    year = year || new Date().getFullYear();
    month = month || 1;
    date = date || 1;

    const dobDate = new Date(year, month - 1, date);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - dobDate.getFullYear();
    const dobMonth = dobDate.getMonth();
    const currentMonth = currentDate.getMonth();

    if (currentMonth < dobMonth || (currentMonth === dobMonth && currentDate.getDate() < dobDate.getDate())) {
        age--;
    }

    return age;
}

/**
 * Function will help to split japanese address
 * @param {*} address 
 * @returns 
 */
export function splitJapaneseAddress(address) {
    // Define a regular expression that captures all characters up to the last occurrence of any known city/ward marker
    const cityRegex = /^([\s\S]*[\u5e02\u533a\u753a\u6751\u90e1\u90fd\u9053\u5e9c\u770c])/;

    // Match the city part of the address
    const cityMatch = address.match(cityRegex);
    let city = '';
    let street = '';

    if (cityMatch && cityMatch.length > 0) {
        // Extract the city from the matched part of the address
        city = cityMatch[0].trim();

        // Extract the street from the remaining part of the address after the city
        street = address.slice(city.length).trim();
    } else {
        // If no city suffix is found, consider the entire address as the street
        street = address.trim();
    }

    return { city, street };
}

/**
 * Function will help to combine special care name based on locale
 */
export const getSpecialCareName = (nameList, locale = 'ja') => {
    let specialCareName = '';
    if (nameList.length > 0) {
        if (locale == 'ja') {
            nameList.map((item) => {
                specialCareName = specialCareName ? (specialCareName + ", " + item.name) : item.name;
            });
            return specialCareName;
        }
        nameList.map((item) => {
            specialCareName = specialCareName ? (specialCareName + ", " + item.name_en) : item.name_en;
        });
    }
    return specialCareName;
}

export function downloadImage(base64String, fileName) {

    //Convert base64 string to binary data
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    // Create Blob object from binary data
    const blob = new Blob(byteArrays, { type: 'image/png' }); // Adjust type if necessary

    // Create a URL for the Blob object
    const downloadUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;

    // Append the link to the body
    document.body.appendChild(link);

    // Click the link to trigger the download
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);

    // Revoke the URL to free up memory
    URL.revokeObjectURL(downloadUrl);
}

export function formatAddress(zipCode, prefecture, familyOrPersonAddress, familyOrPersonAddressDefault) {
    return `${zipCode ? zipCode : ''} ${prefecture ? prefecture : ''} ${familyOrPersonAddress ? familyOrPersonAddress : ''} ${familyOrPersonAddressDefault ? familyOrPersonAddressDefault : ''}`;
}