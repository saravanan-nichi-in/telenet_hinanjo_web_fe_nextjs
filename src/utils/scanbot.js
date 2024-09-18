"use client";

import dynamic from 'next/dynamic';

// Dynamically import ScanbotSDK
const ScanbotSDK = dynamic(() => import('scanbot-web-sdk'), { ssr: false });

export default class ScanbotSDKService {
    static instance = new ScanbotSDKService();

    constructor() {
        this.sdk = undefined;
        this.documentScanner = undefined;
        this.barcodeScanner = undefined;
        this.croppingView = undefined;
        this.documents = [];
        this.LICENSE_KEY = "dKyz+1oEEfFy6jDktgyAns+wzgbaa5" +"PdCLVA/gJHP0QcmeEgO3zkOsx9wTxp" +"3XhZwFtr39noJrEznToTNtnTdAzsi4" +"7pyKQTzLLBMEmPcgP0otlUjues2ymL" +"6ro54cMa8CSkwh1WFfjbNoapEXRcRx" +"+RKDdCfYmt1kxfbPD8LcQjtI7t9sDE" +"8/smWrSDw0RCA2UePuHgBjNEBnv7Sl" +"o8Kq6i0DXtUmsDWfb+lw94dRVMxES0" +"2NUYlR/OB9SHYg4IXrRdhwAMM0Okud" +"8Sg2zDG7LQMGd8UiqdEtT1/Mls223v" +"cbOlSMk7mhH5nANmNfGft1UODZNbB9" +"pzmOw69GXV3g==\nU2NhbmJvdFNESw" +"psb2NhbGhvc3R8c2NhbmJvdC10ZWxl" +"bmV0LnZlcmNlbC5hcHAKMTcyNzMwOD" +"c5OQo4Mzg4NjA3Cjg=\n";
    }

    async initialize() {
        if (this.sdk) {
            return;
        }

        try {
            if (typeof window !== 'undefined') {
                const reference = (await import('scanbot-web-sdk')).default;
                this.sdk = await reference.initialize({
                    licenseKey: this.LICENSE_KEY,
                    engine: 'wasm',
                });
            }
        } catch (error) {
            console.error('Error initializing Scanbot SDK:', error);
        }
    }

    async createDocumentScanner(containerId, onDocumentDetected) {
        await this.initialize();

        if (!this.sdk) {
            console.error('SDK not initialized');
            return;
        }

        const config = {
            containerId: containerId,
            onDocumentDetected: async (e) => {
                const id = (Math.random() + 1).toString(36).substring(7);
                const base64 = await this.sdk.toDataUrl(e.cropped || e.original);
                await this.documents.push({ id, image: base64, result: e });
                await this.sdk.utils.flash();
                onDocumentDetected(id, e);
            },
            onError: (error) => {
                console.log('Encountered error scanning documents:', error);
            },
            style: {
                outline: {
                    polygon: {
                        strokeCapturing: 'green',
                        strokeWidth: 4,
                    },
                },
            },
        };

        this.documentScanner = await this.sdk.createDocumentScanner(config);
    }

    async createBarcodeScanner(containerId, onBarcodeFound) {
        await this.initialize();

        if (!this.sdk) {
            console.error('SDK not initialized');
            return;
        }

        const config = {
            containerId: containerId,
            overlay: {
                visible: true,
                textFormat: 'TextAndFormat',
                automaticSelectionEnabled: false,
                style: {
                    highlightedTextColor: '#EC3D67',
                    highlightedPolygonStrokeColor: '#3DEC4A',
                },
                onBarcodeFound: (code, polygon, label) => {
                    onBarcodeFound(code);
                },
            },
            returnBarcodeImage: true,
            onBarcodesDetected: (e) => {
                console.log('Detected barcodes:', e.barcodes);
            },
            onError: (error) => {
                console.log('Encountered error scanning barcodes:', error);
            },
        };

        this.barcodeScanner = await this.sdk.createBarcodeScanner(config);
    }

    async disposeDocumentScanner() {
        if (this.documentScanner) {
            await this.documentScanner.dispose();
        }
    }

    disposeBarcodeScanner() {
        if (this.barcodeScanner) {
            this.barcodeScanner.dispose();
        }
    }

    getDocuments() {
        return this.documents;
    }

    hasDocuments() {
        return this.documents.length > 0;
    }

    findDocument(id) {
        return this.getDocuments().find(d => d.id === id);
    }

    async openCroppingView(containerId, id) {
        console.log(this.documents);

        if (!id) {
            console.log('No document id provided');
            return;
        }

        const document = this.findDocument(id)?.result;
        if (!document) {
            console.log('No document found for id:', id);
            return;
        }

        const configuration = {
            containerId: containerId,
            image: document.original,
            polygon: document.polygon,
            disableScroll: true,
            style: {
                padding: 20,
                polygon: {
                    color: 'green',
                    width: 4,
                    handles: {
                        size: 14,
                        color: 'white',
                        border: '1px solid lightgray',
                    },
                },
                magneticLines: {
                    color: 'red',
                },
            },
        };

        this.croppingView = await this.sdk.openCroppingView(configuration);
    }

    onCropApplied() { }

    async applyCrop(id) {
        const result = await this.croppingView?.apply();
        const document = this.findDocument(id);
        if (!document) {
            return;
        }
        document.result.cropped = result?.image;
        document.result.polygon = result?.polygon;

        document.image = await this.sdk.toDataUrl(result?.image);
        this.onCropApplied();
    }
}

export class ScanbotDocument {
    constructor() {
        this.id = undefined;
        this.image = undefined;
        this.result = undefined;
    }
}
