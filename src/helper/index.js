import _ from 'lodash';
import toast from "react-hot-toast";

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
 * Total count get from array with specific key
 * @param {*} array 
 * @param {*} key 
 */
export const getTotalCountFromArray = (array, key, trimKeyLength) => {
    return _.sumBy(array, (item) => {
        if (trimKeyLength && item[key]) {
            let trimKeyData = _.trimEnd(item[key], item[key].slice(-`${trimKeyLength}`));
            return Number(trimKeyData);
        } else if (item[key]) {
            return Number(item[key]);
        } else {
            return 0; // Treat invalid as 0
        }
    });
};

/**
 * Get average percentage
 * @param {*} array 
 * @param {*} key 
 * @returns 
 */
export const getAveragePercentage = (array, key) => {
    // Extract numeric values and convert them to numbers
    const values = array.map(item => parseFloat(item[key]));
    // Calculate the average
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    // Format the result as a percentage
    const formattedAverage = `${average.toFixed(2)}%`;

    return formattedAverage;
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
        timeZone: 'Asia/Kolkata'
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
export const getJapaneseDateDisplayFormat = (dateTime) => {

    const options = {
        year: 'numeric',
        month: '2-digit', // Use '2-digit' to get leading zeros for months
        day: '2-digit',   // Use '2-digit' to get leading zeros for days
    };
    const formattedJPDateTime = new Date(dateTime).toLocaleString('ja-JP', options);

    return formattedJPDateTime.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ');
}

/**
 * Get japanese display format
 * @param {*} dateTime 
 * @returns 
 */
export const getJapaneseDateDisplayYYYYMMDDFormat = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}年${month}月${day}日`;
}

/**
 * Get English display format
 * @param {*} dateTime 
 * @returns 
 */
export const getEnglishDateDisplayFormat = (dateTime) => {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
 * Import fail error status displaying in toast
 * @param {*} response 
 */
export const importErrorToastDisplay = (response) => {
    if (response && response.data) {
        if (!response.data.success && response.data.code == "422") {
            toast.error(() => (
                <div>
                    <a href={response?.data?.error_path} target="_blank" style={{ textDecoration: "underline" }}>
                        {response?.data?.message}
                    </a>
                </div>
            ), {
                position: "top-right",
            });
        } else if (response.data.success) {
            if (response.data.code == "206") {
                toast.success(() => (
                    <div>
                        <a href={response?.data?.error_path} target="_blank" style={{ textDecoration: "underline" }}>
                            {response?.data?.message}
                        </a>
                    </div>
                ), {
                    position: "top-right",
                });
            } else {
                toast.success(response?.data?.message, {
                    position: "top-right",
                });
            }
        } else {
            toast.error(response?.data?.message, {
                position: "top-right",
            });
        }
    }
}

export const generateColors = (length) => {
    const colors = [];
    const hueIncrement = 360 / length; // Divide the hue spectrum evenly

    for (let i = 0; i < length; i++) {
        const hue = i * hueIncrement;

        const color = `hsl(${hue}, 80%, 50%)`;
        colors.push(color);
    }

    return colors;
}


