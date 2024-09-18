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
        this.LICENSE_KEY = "UjaU0WHQNZE5LO9+19rYLirNhwqnFT" +
            "CZn5GbPFtnCLD0Mk4AJEk8UuIfFyvT" +
            "R5Yzt/ukx4pXJivhJPZ7y/wVZQxhh3" +
            "J8gfpUNmr8qJau0bTniVnM7ow+JVwK" +
            "FP3m3P5BWLdbQEUninhP3s39clahz8" +
            "Zq7ZS92lnwyAQZGj/oubyWyt7dRMlj" +
            "c5WDIqsZjbDLH4tYwPl1C7FQTKfTwo" +
            "HAVeph5luqKBfoANlX6R4TtqCQxfEo" +
            "Il8dMD7r4kI1uyVuvWoiwNRhFrAyNa" +
            "fUGvJtUbfQcAlDL5P+GcidLe2acsuY" +
            "8PDqD/BmvL5f5xspwVKbjF3Xskjhfh" +
            "H9jxT2dJpq/A==\nU2NhbmJvdFNESw" +
            "podHRwczovL3NjYW5ib3QtdGVsZW5l" +
            "dC52ZXJjZWwuYXBwLwoxNzI3MzA4Nz" +
            "k5CjgzODg2MDcKMTk=\n";
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
