import * as ScanbotSDK from 'scanbot-web-sdk';

export async function initializeScanbot() {
    return await ScanbotSDK.initialize({
        licenseKey: process.env.NEXT_PUBLIC_SCANBOT_LICENSE_KEY,
        // engine: '/path-to-scanbot-sdk-wasm/', // WebAssembly engine
        engine: "/wasm/"
    });
}
