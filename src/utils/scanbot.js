"use client";
import { ImageUtils } from "@/utils/ImageUtils";

export default class ScanbotSDKService {
    static instance = new ScanbotSDKService();

    constructor() {
        this.sdk = undefined;
        this.documentScanner = undefined;
        this.croppingView = undefined;
        this.documents = [];
        this.LICENSE_KEY = "bdiYoNXngaD8625uPxn2EDLdY5zJC6" + "reFhFzaoUnM/XCT0V5iVM0Lpjq0/ec" + "BrqOROfhZOdE7bvIwMOfeWCYrQYHtH" + "/klGtmm//+cfux2PGI1gju0TXf/ATj" + "skDFBmT5CWDtGuohAr6zIKK95FtfTW" + "Qqhja0DnOcAl3KTG8yKfS1BOCA2j75" + "/BWTyyP9ITLshE15MPFjK7Sz0HjXA7" + "qzA4+J7NhbsrUq5WvEvbfFjJBx6332" + "ON30GEn/ViEtbbM2XJJe3P0eIOsS3k" + "PwkWP4BG18vWhVG9ip6JDuCczsQSGt" + "0qlbHVpSU/6xf7yUiVWmoih1xfVoAp" + "xnKn4K8fhLjQ==\nU2NhbmJvdFNESw" + "psb2NhbGhvc3R8dGVsZW5ldC52ZXJj" + "ZWwuYXBwCjE3MjczMDg3OTkKODM4OD" + "YwNwo4\n";
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

        const image = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG);
        console.log(image);
        const base64 = await this.sdk?.toDataUrl(image.original);
        console.log(base64);
        const contourDetectionResult = await this.sdk?.detectDocument(image.original);

        console.log('Document quality analysis:', contourDetectionResult);

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

    async disposeDocumentScanner() {
        if (this.documentScanner) {
            await this.documentScanner.dispose();
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
                // magneticLines: {
                //     color: 'red',
                // },
            },
        };

        this.croppingView = await this.sdk.openCroppingView(configuration);
    }

    onCropApplied(document) {
        console.log(document);
        const dataToSend = { scannedData: document }; // Replace with actual data
        window.opener.postMessage(dataToSend, window.origin); // Send message to the parent window
        window.close(); // Optionally close the popup after sending the data
    }

    async applyCrop(id) {
        const result = await this.croppingView?.apply();
        const document = this.findDocument(id);
        if (!document) {
            return;
        }
        document.result.cropped = result?.image;
        document.result.polygon = result?.polygon;

        document.image = await this.sdk.toDataUrl(result?.image);
        this.onCropApplied(document);
    }
}

export class ScanbotDocument {
    constructor() {
        this.id = undefined;
        this.image = undefined;
        this.result = undefined;
    }
}
