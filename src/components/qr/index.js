// import React from 'react'
// import QrReader from 'react-qr-scanner'

// const QRCodeScanner = () => {
//     const previewStyle = {
//         height: 240,
//         width: 320,
//     }

//     const handleScan = (data) => {
//         if (data) {
//             console.log(data);
//         }
//     }

//     const handleError = (err) => {
//         if (err) {
//             console.error(err);
//         }
//     }

//     return (
//         <div>
//             <QrReader
//                 style={previewStyle}
//                 onError={(err) => handleError(err)}
//                 onScan={(data) => handleScan(data)}
//             />
//         </div>
//     )
// }

// export default QRCodeScanner;

import { useState } from "react";
import { useZxing } from "react-zxing";

const BarcodeScanner = () => {
    const [result, setResult] = useState("");
    const { ref,
        torch: { on, off, isOn, isAvailable },
    } = useZxing({
        onResult(result) {
            setResult(result.getText());
            console.log(result);
            // if (ref.current) {
            //     ref.current.pause();
            // }
        },
    });

    return (
        <>
            <video ref={ref} />
            {/* {isAvailable ? (
                <button onClick={() => (isOn ? off() : on())}>
                    {isOn ? "Turn off" : "Turn on"} torch
                </button>
            ) : (
                <strong>Unfortunately, torch is not available on this device.</strong>
            )} */}
        </>
    );
};

export default BarcodeScanner; 
