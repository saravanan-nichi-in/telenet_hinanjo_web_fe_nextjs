'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DocumentScanner = () => {
    const scannerContainerRef = useRef(null);

    useEffect(() => {
        async function initScanner() {
            try {
                const ScanbotSDKModule = await import('scanbot-web-sdk');
                const ScanbotSDK = ScanbotSDKModule.default || ScanbotSDKModule;

                const scanbotSDK = await ScanbotSDK.initialize({
                    licenseKey: process.env.NEXT_PUBLIC_SCANBOT_LICENSE_KEY,
                    // engine: '/scanbot-sdk-wasm/', // Ensure this path is correct
                });

                console.log('Scanbot SDK initialized:', scanbotSDK); // Inspect the SDK object

                // if (scanbotSDK.UI) {
                    scanbotSDK.UI.startDocumentScanner({
                        containerId: scannerContainerRef.current.id,
                        onDocumentDetected: (result) => {
                            console.log('Document detected:', result);
                        },
                        onError: (error) => {
                            console.error('Scanner error:', error);
                        },
                    });
                // } else {
                //     console.error('Scanbot SDK UI component is unavailable');
                // }
            } catch (error) {
                console.error('Error initializing Scanbot SDK:', error);
            }
        }

        initScanner();
    }, []);

    return (
        <div>
            <h1>Document Scanner</h1>
            <div ref={scannerContainerRef} id="scanner-container" style={{ width: '100%', height: '500px' }} />
        </div>
    );
};

export default dynamic(() => Promise.resolve(DocumentScanner), { ssr: false });
