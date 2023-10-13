import _ from 'lodash';

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

export const getJapaneseDateTimeDisplayFormat = (dateTime) => {
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
    };
    const formattedJPDateTime = new Date(dateTime).toLocaleString('ja-JP', options);

    formattedJPDateTime.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ')
    return formattedJPDateTime;
}

export const getJapaneseDateDisplayFormat = (dateTime) => {
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    };
    const formattedJPDateTime = new Date(dateTime).toLocaleString('ja-JP', options);

    formattedJPDateTime.replace(/(\d+)年(\d+)月(\d+)日,/, '$1年$2月$3日 ')
    return formattedJPDateTime;
}

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
    formattedJPDateTime = formattedJPDateTime.replaceAll(":","");
    return formattedJPDateTime.replaceAll("","");
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
