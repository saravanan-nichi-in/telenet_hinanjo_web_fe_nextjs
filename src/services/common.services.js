export const CommonServices = {
    zipDownload: _zipDownload,
};

/**
 * Zip download using external URL
 */
function _zipDownload(zipUrl) {
    console.log(zipUrl);
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