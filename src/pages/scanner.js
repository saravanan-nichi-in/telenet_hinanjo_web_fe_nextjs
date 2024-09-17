"use client";

import { useEffect } from "react";
import { ScanbotSDKService } from "@/utils/scanbot"

export default function DocumentScanner() {
    useEffect(() => {
        const scannerService = ScanbotSDKService.getInstance();

        // Initialize the document scanner
        scannerService.createDocumentScanner("document-scanner");

        // Cleanup function to dispose of the scanner
        return () => {
            scannerService.disposeDocumentScanner();
        };
    }, []);

    return (
        <div>
            <div id="document-scanner" style={{ width: "100%", height: "calc(100vh - 60px)" }} />
        </div>
    );
}
