"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import ScanbotSDKService from "@/utils/scanbot";
import FloatingActionButton from "@/subviews/floating-action-button";
import DocumentFetch from "@/utils/DocumentFetch";

function Document() {
    const router = useRouter();
    const [document, setDocument] = useState(null);

    // useEffect(() => {
    //     ScanbotSDKService.instance.onCropApplied = () => {
    //         setDocument(document);
    //         router.refresh();
    //     };
    // }, [router, document]);

    return (
        <div>
            <div style={{
                width: "100%",
                height: "calc(100vh - 60px)",
                display: "flex",
                backgroundColor: "white",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 10,
                padding: 10,
                alignContent: "flex-start"
            }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <DocumentFetch onDocumentFound={async (document) => {
                        console.log(document);
                        
                        setDocument(document);
                    }} />
                </Suspense>
                {/* Next.js attempts to optimize image loading by using the next/image component,
                  * but these images are fundamentally dynamic, revert to native html component 
                  */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={document?.image} alt="X" style={{ maxWidth: "100%", height: "auto" }} />
                <FloatingActionButton
                    href={{ pathname: `/cropping`, query: { id: document?.id } }}
                    icon={'icon_crop.png'}
                />
            </div>
        </div>
    );
}

Document.getLayout = function getLayout(page) {
    return page;
};

export default Document;
