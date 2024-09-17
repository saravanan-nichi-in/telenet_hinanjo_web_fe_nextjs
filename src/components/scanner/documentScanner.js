'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const DocumentScanner = () => {
    const scannerContainerRef = useRef(null);

    useEffect(() => {
        async function initScanner() {
            try {
                const ScanbotSDKModule = (await import('scanbot-web-sdk')).default;

                const scanbotSDK = await ScanbotSDKModule.initialize({
                    licenseKey: process.env.NEXT_PUBLIC_SCANBOT_LICENSE_KEY,
                    engine: '/scanbot-sdk-wasm/', // WASM engine path
                });

                console.log(scanbotSDK); // Log to inspect the SDK object

                if (scanbotSDK.UI) {
                    scanbotSDK.UI.startDocumentScanner({
                        containerId: scannerContainerRef.current.id,
                        onDocumentDetected: (result) => {
                            console.log('Document detected:', result);
                        },
                        onError: (error) => {
                            console.error('Scanner error:', error);
                        },
                    });
                } else {
                    console.error('Scanbot SDK UI component is unavailable');
                }
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
