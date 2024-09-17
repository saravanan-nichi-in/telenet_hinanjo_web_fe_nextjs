"use client";

import { useState, useEffect } from 'react';

class ScanbotSDKService {
    constructor() {
        this.sdk = undefined;
        this.documentScanner = undefined;
        this.barcodeScanner = undefined;
        this.croppingView = undefined;
        this.documents = [];
        this.LICENSE_KEY = process.env.NEXT_PUBLIC_SCANBOT_LICENSE_KEY;
    }

    static getInstance() {
        if (!ScanbotSDKService.instance) {
            ScanbotSDKService.instance = new ScanbotSDKService();
        }
        return ScanbotSDKService.instance;
    }

    async initialize() {
        if (this.sdk) {
            return;
        }

        try {
            if (typeof window !== 'undefined') {
                const ScanbotSDKModule = await import('scanbot-web-sdk');
                this.sdk = await ScanbotSDKModule.default.initialize({
                    licenseKey: this.LICENSE_KEY,
                    engine: '/scanbot-sdk-wasm/', // Path to WASM files
                });
            }
        } catch (error) {
            console.error('Error initializing Scanbot SDK:', error);
        }
    }

    async createDocumentScanner(containerId) {
        await this.initialize();

        const config = {
            containerId: containerId,
            onDocumentDetected: async (e) => {
                const id = (Math.random() + 1).toString(36).substring(7);
                const base64 = await this.sdk.toDataUrl(e.cropped || e.original);
                this.documents.push({ id: id, image: base64, result: e });
                this.sdk.utils.flash();
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

class ScanbotDocument {
    constructor() {
        this.id = undefined;
        this.image = undefined;
        this.result = undefined;
    }
}

export { ScanbotSDKService, ScanbotDocument };