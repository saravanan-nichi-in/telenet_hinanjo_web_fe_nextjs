"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ScanbotSDKService from "@/utils/scanbot";

export default function DocumentScanner() {
    const router = useRouter(); // Use router hook to programmatically navigate

    const [documentId, setDocumentId] = useState(null);
    const [documentResult, setDocumentResult] = useState(null);

    useEffect(() => {
        (async () => {
            await ScanbotSDKService.instance.createDocumentScanner(
                "document-scanner",
                async (id, document) => {
                    setDocumentId(id);
                    setDocumentResult(document);

                    console.log("Document detected with id:", id);
                    console.log("Document result:", document);

                    // Programmatically navigate to the document page with the detected ID
                    // router.push(`/document?id=${id}`);
                    await ScanbotSDKService.instance.openCroppingView('document-scanner',id)
                    // await ScanbotSDKService.instance.getDocuments();
                }
            );
        })();

        // Cleanup function to dispose of the scanner when the component unmounts
        return () => {
            ScanbotSDKService.instance.disposeDocumentScanner();
        };
    }, [router]);

    return (
        <div>
            <div id="document-scanner" style={{ width: "100%", height: "calc(100vh - 60px)" }} />
        </div>
    );
}
