"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ScanbotSDKService from "@/utils/scanbot";

export default function DocumentScanner() {
    const router = useRouter(); // Use router hook to programmatically navigate

    const [documentId, setDocumentId] = useState(null);
    const [documentResult, setDocumentResult] = useState(null);

    useEffect(() => {
        let isMounted = true; // To prevent setting state on an unmounted component

        (async () => {
            try {
                // Step 1: Initialize the SDK
                await ScanbotSDKService.instance.initialize();

                // Step 2: After SDK is initialized, create the document scanner
                if (isMounted) {
                    await ScanbotSDKService.instance.createDocumentScanner(
                        "document-scanner",
                        async (id, document) => {
                            setDocumentId(id);
                            setDocumentResult(document);

                            console.log("Document detected with id:", id);
                            console.log("Document result:", document);

                            // Step 3: After detecting the document, navigate or perform other actions
                            await ScanbotSDKService.instance.openCroppingView('document-scanner', id);
                            // Optionally, handle additional actions like fetching documents
                            // await ScanbotSDKService.instance.getDocuments();
                        }
                    );
                }
            } catch (error) {
                console.error("Error loading SDK or creating scanner:", error);
            }
        })();

        // Cleanup function to dispose of the scanner when the component unmounts
        return () => {
            isMounted = false; // To handle any pending async operations
            ScanbotSDKService.instance.disposeDocumentScanner();
        };
    }, [router]);


    return (
        <div>
            <div id="document-scanner" style={{ width: "100%", height: "calc(100vh - 60px)" }} />
        </div>
    );
}
