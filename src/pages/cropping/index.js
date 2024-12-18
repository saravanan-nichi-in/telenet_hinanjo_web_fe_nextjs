"use client";

import { Suspense, useState } from "react";
import { useRouter } from 'next/navigation';

import ScanbotSDKService from "@/utils/scanbot";
import FloatingActionButton from "@/subviews/floating-action-button";
import DocumentFetch from "@/utils/DocumentFetch";

function Cropping() {
    const router = useRouter();
    const [document, setDocument] = useState(null);

    return (
        <div>
            <div style={{
                display: "flex",
                padding: 10,
                backgroundColor: "white",
                height: "calc(100vh - 60px)",
            }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <DocumentFetch onDocumentFound={async (document) => {
                        setDocument(document);
                        await ScanbotSDKService.instance.openCroppingView('cropping-view', document?.id);
                    }} />
                </Suspense>
                <div id="cropping-view" style={{
                    backgroundColor: "rgb(230, 230, 230)",
                    width: "100%",
                    height: "calc(100vh - 200px)",
                    borderRadius: 5
                }} />
                {/* <FloatingActionButton
                    // href={{ pathname: `/document`, query: { id: document?.id } }}
                    icon={'icon_check.png'}
                    onClick={() => {
                        ScanbotSDKService.instance.applyCrop(document?.id);
                        // router.back();
                    }}
                /> */}

                <div
                    onClick={() => {
                        ScanbotSDKService.instance.applyCrop(document?.id);
                        // router.back();
                    }}>
                    Crop
                </div>
            </div>
        </div>
    );
}

Cropping.getLayout = function getLayout(page) {
    return page;
};

export default Cropping;
